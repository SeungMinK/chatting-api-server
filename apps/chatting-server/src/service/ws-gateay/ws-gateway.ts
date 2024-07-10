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

@WebSocketGateway({
  cors: {
    origin: "*",
  },
  transports: ["websocket"],
})
export class WsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor() {}

  @SubscribeMessage("join")
  join(client: Socket | any) {
    client.join(client.user.id);
    this.server
      .to(client.user.id)
      .emit("join", { statusCode: HttpStatus.OK, message: ["success"] });
  }

  @SubscribeMessage("leave")
  leave(client: Socket | any) {
    client.leave(client.user.id);
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
