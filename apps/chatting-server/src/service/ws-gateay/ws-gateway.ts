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
  ) {}

  @SubscribeMessage("join")
  join(
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

    this.server.to(payload.chattingRoomId).emit("user-joined", {
      statusCode: HttpStatus.OK,
      message: ["success"],
      userId: payload.userId,
      username: payload.username,
    });

    // DB에는 비동기로 생성
    this.chattingRoomUserService
      .createChattingRoomUser({
        requestUserId: payload.userId,
        chattingRoomId: payload.chattingRoomId,
      })
      .catch((e) => {
        return e;
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
