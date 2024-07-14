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
import { WsGatewayService } from "./ws-gateway.service";

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
    private wsGatewayService: WsGatewayService,
    private chattingMessageService: ChattingMessageService,
  ) {}

  @SubscribeMessage("login")
  login(client: Socket, payload: { userId: string; username: string }) {
    client.join(payload.userId);

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
    await this.wsGatewayService.handleUserRejoin(this.userRooms, payload);
    await this.wsGatewayService.addUserToRoom(
      this.server,
      client,
      this.userRooms,
      payload,
    );
  }

  @SubscribeMessage("leave")
  async leave(
    client: Socket,
    payload: { chattingRoomId: string; userId: string; username: string },
  ) {
    await this.wsGatewayService.removeUserFromRoom(
      this.server,
      client,
      this.userRooms,
      payload,
    );
  }

  @SubscribeMessage("send-message")
  async handleMessage(
    client: Socket,
    payload: {
      message: string;
      chattingRoomId: string;
      userId: string;
      username: string;
    },
  ) {
    await this.chattingMessageService
      .createChattingMessage({
        content: payload.message,
        userId: payload.userId,
        chattingRoomId: payload.chattingRoomId,
      })
      .catch((e) => e);

    this.server.emit("last-message", { ...payload, createdAt: new Date() });
    this.server.to(payload.chattingRoomId).emit("receive-message", payload);
  }

  handleConnection(client: any, ...args: any[]) {
    console.log("Connected: ", client.id);
  }

  handleDisconnect(client: any) {
    console.log("Disconnected: ", client.id);
  }

  afterInit() {
    console.log("ws-gateway Initialized");
  }
}
