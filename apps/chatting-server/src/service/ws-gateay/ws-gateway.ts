import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { HttpStatus } from "@nestjs/common";
import { ChattingMessageService } from "../chatting-message/chatting-message.service";
import { ChattingRoomUserService } from "../chatting-room-user/chatting-room-user.service";
import { ChattingRoomService } from "../chatting-room/chatting-room.service";

interface UserRoomMap {
  [userId: string]: Set<string>;
}

@WebSocketGateway({
  cors: {
    origin: "*",
  },
  transports: ["websocket", "polling"],
})
export class WsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  private userRooms: UserRoomMap = {};

  constructor(
    private chattingMessageService: ChattingMessageService,
    private chattingRoomUserService: ChattingRoomUserService,
    private chattingRoomService: ChattingRoomService,
  ) {}

  @SubscribeMessage("login")
  login(client: Socket, payload: { userId: string; username: string }) {
    // Login 성공 시 소켓 서버에 연결
    client.join(payload.userId); // Client 연결

    this.server.to(payload.userId).emit("login", {
      statusCode: HttpStatus.OK,
      message: ["success"],
      userId: payload.userId,
      username: payload.username,
    });
  }

  @SubscribeMessage("join")
  async join(
    client: Socket,
    payload: { chattingRoomId: string; userId: string; username: string },
  ) {
    if (!this.userRooms[payload.userId]) {
      this.userRooms[payload.userId] = new Set();
    }

    const currentUserRooms = this.userRooms[payload.userId];

    // 해당 채팅방에 같은 아이디로 이미 연결 되어 있는 경우
    if (currentUserRooms.has(payload.chattingRoomId)) {
      // 연결 내역 삭제 후 재 연결
      if (this.userRooms[payload.userId]) {
        this.userRooms[payload.userId].delete(payload.chattingRoomId);
        if (this.userRooms[payload.userId].size === 0) {
          delete this.userRooms[payload.userId];
        }
      }

      this.chattingRoomUserService
        .removeChattingRoomUser({
          requestUserId: payload.userId,
          chattingRoomId: payload.chattingRoomId,
        })
        .catch((e) => {
          return e;
        });
    }

    // Client 연결
    client.join(payload.chattingRoomId);
    currentUserRooms.add(payload.chattingRoomId);

    // this.server.emit("user-joined-all", {
    //   statusCode: HttpStatus.OK,
    //   message: ["success"],
    //   chattingRoomId: payload.chattingRoomId,
    //   numActiveUserCount: existChattingRoom.numActiveUserCount ?? 0,
    // });

    // DB에는 유저 접속 정보 생성 ( 비동기로 생성할 경우, 간혈적으로 정보가 누락되는 경우가 있음), Join은 Message에 비해 호출 빈도가 적음
    await this.chattingRoomUserService
      .createChattingRoomUser({
        requestUserId: payload.userId,
        chattingRoomId: payload.chattingRoomId,
      })
      .catch((e) => {
        return e;
      });

    const existChattingRoom =
      await this.chattingRoomService.findOneChattingRoom({
        id: payload.chattingRoomId,
      });

    // 로그인 한 전체 유저에게 chattingRoomId 별 chattingRoomCount emit
    this.server.emit("user-joined", {
      statusCode: HttpStatus.OK,
      message: ["success"],
      userId: payload.userId,
      username: payload.username,
      chattingRoomId: payload.chattingRoomId,
      numActiveUserCount: existChattingRoom.numActiveUserCount ?? 0,
    });
  }

  @SubscribeMessage("leave")
  leave(
    client: Socket,
    payload: { chattingRoomId: string; userId: string; username: string },
  ) {
    client.leave(payload.chattingRoomId);
    if (this.userRooms[payload.userId]) {
      this.userRooms[payload.userId].delete(payload.chattingRoomId);
      if (this.userRooms[payload.userId].size === 0) {
        delete this.userRooms[payload.userId];
      }
    }

    this.server.to(payload.chattingRoomId).emit("user-left", {
      userId: payload.userId,
      username: payload.username,
    });

    this.chattingRoomUserService
      .removeChattingRoomUser({
        requestUserId: payload.userId,
        chattingRoomId: payload.chattingRoomId,
      })
      .catch((e) => {
        return e;
      });
  }

  @SubscribeMessage("send-message")
  handleMessage(
    client: Socket,
    payload: {
      message: string;
      chattingRoomId: string;
      userId: string;
      username: string;
    },
  ) {
    // 전체 유저에게, 채팅방마다 마지막 메시지 변경 Emit
    this.server.emit("last-message", { ...payload, createdAt: new Date() });

    this.server.to(payload.chattingRoomId).emit("receive-message", payload);

    this.chattingMessageService
      .createChattingMessage({
        content: payload.message,
        userId: payload.userId,
        chattingRoomId: payload.chattingRoomId,
      })
      .catch((e) => {
        return e;
      });
  }

  handleConnection(client: any, ...args: any[]) {
    console.log("Connected: ", client.id);
  }

  handleDisconnect(client: any) {
    console.log("Disconnected: ", client.id);
  }

  afterInit() {
    console.log("[WS GATEWAY] Initialized");
  }
}
