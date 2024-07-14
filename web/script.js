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
  let roomsData = []; // Keep track of rooms data

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
        await fetchChattingRooms();

        // Hide login form
        loginContainer.style.display = "none";

        // Connect WebSocket and join login event
        connectWebSocket();
      } else {
        alert("Failed to fetch profile");
      }
    } else {
      alert("Login failed");
    }
  });

  async function fetchChattingRooms() {
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
      roomsData = await roomsResponse.json();
      displayChattingRooms(roomsData);
    } else {
      alert("Failed to fetch chatting rooms");
    }
  }

  function displayChattingRooms(rooms) {
    chattingRoomsDiv.innerHTML = ""; // Clear current rooms
    rooms.forEach((room) => {
      const roomElement = document.createElement("div");
      roomElement.classList.add("chat-room-item");
      const lastChattingMessageContent =
        room.lastChattingMessage?.content ?? "아직 진행중인 대화가 없습니다.";
      const lastChattingMessageTime = room.lastChattingMessage
        ? new Date(room.lastChattingMessage.createdAt).toLocaleString()
        : "";
      roomElement.innerHTML = `
        <div class="chat-room-header">
          <div class="chat-room-title">${room.title}</div>
          <div class="chat-room-activeUsers" data-room-id="${room.id}">실시간 접속자수: ${room.numActiveUsersHalfHour}</div>
        </div>
        <div class="chat-room-description">${room.description}</div>
        <div class="chat-room-createdAt">${new Date(room.createdAt).toLocaleString()}</div>
        <div class="chat-room-lastChattingMessage" data-room-id="${room.id}">
          <div class="last-message-content">${lastChattingMessageContent}</div>
          <div class="last-message-time">${lastChattingMessageTime}</div>
        </div>
      `;
      roomElement.addEventListener("click", async () => {
        if (selectedChattingRoomId !== room.id) {
          selectedChattingRoomId = room.id;
          chatRoomTitle.textContent = room.title;
          joinChannel();
          await loadChatHistory();
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

        // Emit login event
        socket.emit("login", { userId, username }, (response) => {
          if (response.statusCode === 200) {
            console.log("Logged in successfully");
          }
        });
      });

      socket.on("receive-message", (message) => {
        displayMessage(message);
      });

      socket.on("last-message", (message) => {
        updateLastMessage(message);
      });

      socket.on("user-joined", (data) => {
        console.log("User joined: ", data);
        updateActiveUserCount(data.chattingRoomId, data.numActiveUsersHalfHour);
      });

      socket.on("user-left", (data) => {
        console.log("User left: ", data);
        updateActiveUserCount(data.chattingRoomId, data.numActiveUsersHalfHour);
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
          if (response && response.statusCode === 200) {
            console.log("Left the previous room");
          }
        },
      );

      socket.emit(
        "join",
        { chattingRoomId: selectedChattingRoomId, userId, username },
        (response) => {},
      );
    }
  }

  function updateActiveUserCount(chattingRoomId, activeUserCount) {
    const activeUserElement = document.querySelector(
      `.chat-room-activeUsers[data-room-id="${chattingRoomId}"]`,
    );
    if (activeUserElement) {
      activeUserElement.textContent = `실시간 접속자수: ${activeUserCount}`;

      // Update the numActiveUsersHalfHour in roomsData
      roomsData.forEach((room) => {
        if (room.id === chattingRoomId) {
          room.numActiveUsersHalfHour = activeUserCount;
        }
      });

      // Re-sort the roomsData based on numActiveUsersHalfHour
      roomsData.sort(
        (a, b) => b.numActiveUsersHalfHour - a.numActiveUsersHalfHour,
      );

      // Re-display the chatting rooms
      displayChattingRooms(roomsData);
    }
  }

  function updateLastMessage(message) {
    const lastChattingMessageElement = document.querySelector(
      `.chat-room-lastChattingMessage[data-room-id="${message.chattingRoomId}"]`,
    );
    if (lastChattingMessageElement) {
      lastChattingMessageElement.querySelector(
        ".last-message-content",
      ).textContent = message.message;
      lastChattingMessageElement.querySelector(
        ".last-message-time",
      ).textContent = new Date(message.createdAt).toLocaleString();

      // Update the last message in roomsData
      roomsData.forEach((room) => {
        if (room.id === message.chattingRoomId) {
          room.lastChattingMessage = {
            content: message.message,
            createdAt: message.createdAt,
          };
        }
      });
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
