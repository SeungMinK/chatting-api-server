import * as request from "supertest";
import { io, Socket } from "socket.io-client";
import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { ChattingServerModule } from "../../src/chatting-server.module";

describe("Chatting API Server", () => {
  let app: INestApplication;
  let server;
  let sockets: Socket[] = [];
  let accessTokens: string[] = [];
  let userIds: string[] = [];
  let usernames: string[] = [];

  const createUsernames = ["testuser1", "testuser2", "testuser3"];
  let createdChattingRoomId: number;

  const signupUser = async (username: string) => {
    await request(server).post("/users").send({ username });
  };

  const loginUser = async (username: string) => {
    const loginResponse = await request(server)
      .post("/auth/login")
      .send({ username });
    return loginResponse.body.access_token;
  };

  const getUserProfile = async (token: string) => {
    const profileResponse = await request(server)
      .get("/my/profile")
      .set("Authorization", `Bearer ${token}`);
    return profileResponse.body;
  };

  const initializeSocket = (
    token: string,
    userId: string,
    username: string,
  ) => {
    const socket = io("http://localhost:3000", {
      transports: ["websocket"],
      auth: { token },
    });

    socket.on("connect", () => {
      socket.emit("login", { userId, username }, (response) => {
        expect(response.statusCode).toBe(200);
      });
    });

    socket.on("connect", () => {
      console.log(`Socket connected: ${username}`);
    });

    socket.on("connect_error", (error) => {
      console.log(`Connect error: ${error}`);
    });

    socket.on("error", (error) => {
      console.log(`Socket error: ${error}`);
    });

    return socket;
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ChattingServerModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    server = app.getHttpServer();

    // 사용자 회원가입 및 로그인
    await Promise.all(createUsernames.map(signupUser));

    // 로그인 및 프로필 가져오기
    for (let i = 0; i < createUsernames.length; i++) {
      accessTokens[i] = await loginUser(createUsernames[i]);
      const profile = await getUserProfile(accessTokens[i]);
      userIds[i] = profile.id;
      usernames[i] = profile.username;
    }

    // 테스트용 채팅방 생성
    const createdChattingRoom = await request(server)
      .post("/chatting-rooms")
      .set("Authorization", `Bearer ${accessTokens[0]}`)
      .send({
        title: "테스트용 채팅방",
        description: "테스트 케이스에서 만듬",
      });

    createdChattingRoomId = createdChattingRoom.body.id;

    // WebSocket 클라이언트 초기화
    sockets = createUsernames.map((username, index) =>
      initializeSocket(accessTokens[index], userIds[index], username),
    );
  });

  afterAll(async () => {
    sockets.forEach((socket) => socket.close());
    await app.close();
  });

  it("채팅방 조회 기능 테스트", async () => {
    const roomsResponse = await request(server)
      .get("/chatting-rooms?limit=25&page=1")
      .set("Authorization", `Bearer ${accessTokens[0]}`);

    expect(roomsResponse.status).toBe(200);
    expect(Array.isArray(roomsResponse.body)).toBe(true);
  });

  it("채팅룸 JOIN 테스트 ( 실시간 유저 수 업데이트)", (done) => {
    // 유저 1 채팅룸 Join
    sockets[0].emit("join", {
      chattingRoomId: createdChattingRoomId,
      userId: userIds[0],
      username: usernames[0],
    });

    // 전체 유저 수신 _ 실시간 유저수 업데이트
    sockets[0].on("user-joined", (payload: any) => {
      expect(payload.chattingRoomId).toBe(createdChattingRoomId);
      expect(payload.numActiveUsersHalfHour).toBe(1);

      done();
    });

    sockets[1].on("user-joined", (payload: any) => {
      expect(payload.chattingRoomId).toBe(createdChattingRoomId);
      expect(payload.numActiveUsersHalfHour).toBe(1);

      done();
    });

    sockets[2].on("user-joined", (payload: any) => {
      expect(payload.chattingRoomId).toBe(createdChattingRoomId);
      expect(payload.numActiveUsersHalfHour).toBe(1);

      done();
    });
  });

  it("메시지 발송 및 수신 테스트(실시간 업데이트)", (done) => {
    const testSendALlMessage = '"HI This is testMessage One"';

    // 채팅방에 메시지 발송
    sockets[0].emit("send-message", {
      message: testSendALlMessage,
      chattingRoomId: createdChattingRoomId,
      userId: userIds[0],
      username: usernames[0],
    });

    // 채팅방 들어간 유저 수신
    sockets[0].on("receive-message", (payload: any) => {
      expect(payload.message).toBe(testSendALlMessage);

      done();
    });

    // 전체 유저 수신 _ 실시간 마지막 메시지 갱신
    sockets[0].on("last-message", (payload: any) => {
      expect(payload.message).toBe(testSendALlMessage);

      done();
    });

    sockets[1].on("last-message", (payload: any) => {
      expect(payload.message).toBe(testSendALlMessage);

      done();
    });

    sockets[2].on("last-message", (payload: any) => {
      expect(payload.message).toBe(testSendALlMessage);

      done();
    });

    //테스크 케이스 정상 동작 테스트 _ 주석 삭제 하면 테스트 케이스 실패
    // sockets[2].on("last-message", (payload: any) => {
    //   connectedCount++;
    //   if (connectedCount === 3) {
    //     done();
    //   }
    //   expect(payload.message).toBe("여기 주석을 해제하면 실패해야함");
    // });
  });

  it("채팅 메시지 조회 기능 테스트", async () => {
    const chatHistoryResponse = await request(server)
      .get(
        `/chatting-messages?limit=25&page=1&chattingRoomId=${createdChattingRoomId}`,
      )
      .set("Authorization", `Bearer ${accessTokens[0]}`);

    expect(chatHistoryResponse.status).toBe(200);
    expect(Array.isArray(chatHistoryResponse.body)).toBe(true);
  });

  it("로그인 기능 테스트", async () => {
    const loginResponse = await request(server)
      .post("/auth/login")
      .send({ username: "invaliduser" });

    expect(loginResponse.status).toBe(404);
  });

  it("회원 가입 기능 테스트", async () => {
    const registerResponse = await request(server)
      .post("/users")
      .send({ username: "testuser1" });

    expect(registerResponse.status).toBe(409);
  });
});
