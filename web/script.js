document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const messagesDiv = document.getElementById("messages");
  const loginContainer = document.getElementById("login-container");
  const chattingRoomContainer = document.getElementById(
    "chattingRoom-container",
  );
  const chattingRoomsDiv = document.getElementById("chattingRooms");
  const chatContainer = document.getElementById("chat-container");
  const chatRoomTitle = document.getElementById("chat-room-title");
  const messageForm = document.getElementById("message-form");
  const messageInput = document.getElementById("message-input");
  let socket;
  let accessToken;
  let userId;
  let username;
  let selectedChattingRoomId;

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const usernameInput = document.getElementById("username").value;

    // Send login request
    const loginResponse = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ username: usernameInput }),
    });

    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      accessToken = loginData.access_token;

      // Fetch user profile
      const profileResponse = await fetch("http://localhost:3000/my/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
      });

      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        userId = profileData.id;
        username = profileData.username;

        // Fetch chatting rooms
        const roomsResponse = await fetch(
          "http://localhost:3000/chatting-rooms?limit=25&page=1&order=createdAt",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              Accept: "application/json",
            },
          },
        );

        if (roomsResponse.ok) {
          const roomsData = await roomsResponse.json();
          displayChattingRooms(roomsData);

          // Hide login form
          loginContainer.style.display = "none";
        } else {
          alert("Failed to fetch chatting rooms");
        }
      } else {
        alert("Failed to fetch profile");
      }
    } else {
      alert("Login failed");
    }
  });

  function displayChattingRooms(rooms) {
    rooms.forEach((room) => {
      const roomElement = document.createElement("div");
      roomElement.classList.add("chat-room-item");
      roomElement.innerHTML = `
        <div class="chat-room-title">${room.title}</div>
        <div class="chat-room-description">${room.description}</div>
        <div class="chat-room-createdAt">${new Date(room.createdAt).toLocaleString()}</div>
      `;
      roomElement.addEventListener("click", () => {
        if (selectedChattingRoomId !== room.id) {
          selectedChattingRoomId = room.id;
          chatRoomTitle.textContent = room.title;
          joinChannel();
        }
      });
      chattingRoomsDiv.appendChild(roomElement);
    });
  }

  async function loadChatHistory() {
    const response = await fetch(
      `http://localhost:3000/chatting-messages?limit=25&page=1&order=createdAt&chattingRoomId=${selectedChattingRoomId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
      },
    );

    if (response.ok) {
      const messages = await response.json();
      messagesDiv.innerHTML = ""; // Clear current messages
      messages.forEach((message) => {
        displayMessage({
          username: message.user.username,
          message: message.content,
        });
      });
    } else {
      alert("Failed to load chat history");
    }
  }

  function connectWebSocket() {
    if (!socket) {
      socket = io("http://localhost:3000", {
        transports: ["websocket"],
        auth: {
          token: accessToken,
        },
      });

      socket.on("connect", () => {
        console.log("WebSocket connected");
      });

      socket.on("receive-message", (message) => {
        displayMessage(message);
      });

      socket.on("error", (error) => {
        alert(error.message);
      });

      socket.on("disconnect", () => {
        console.log("WebSocket disconnected");
      });
    }
  }

  function joinChannel() {
    if (socket) {
      socket.emit(
        "leave",
        { chattingRoomId: selectedChattingRoomId, userId, username },
        (response) => {
          if (response.statusCode === 200) {
            console.log("Left the previous room");
          }
        },
      );

      socket.emit(
        "join",
        { chattingRoomId: selectedChattingRoomId, userId, username },
        (response) => {
          if (response.statusCode === 200) {
            console.log("Joined successfully");
            loadChatHistory();
          }
        },
      );
    }
  }

  messageForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const message = messageInput.value;
    socket.emit("send-message", {
      message,
      chattingRoomId: selectedChattingRoomId,
      userId,
      username,
    });
    messageInput.value = "";
  });

  function displayMessage(message) {
    const messageElement = document.createElement("div");
    messageElement.textContent = `${message.username}: ${message.message}`;
    messagesDiv.appendChild(messageElement);
    messageElement.scrollIntoView();
  }

  // 처음 페이지 로드 시 WebSocket 연결 설정
  connectWebSocket();
});
