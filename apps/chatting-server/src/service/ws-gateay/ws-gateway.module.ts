import { Module } from "@nestjs/common";
import { WsGateway } from "./ws-gateway";
import { WsGatewayService } from "./ws-gateway.service";
import { WsGatewayController } from "./ws-gateway.controller";
import { ChattingMessageModule } from "../chatting-message/chatting-message.module";
import { ChattingRoomUserModule } from "../chatting-room-user/chatting-room-user.module";
import { ChattingRoomModule } from "../chatting-room/chatting-room.module";

@Module({
  imports: [ChattingMessageModule, ChattingRoomUserModule, ChattingRoomModule],
  controllers: [WsGatewayController],
  providers: [WsGateway, WsGatewayService],
})
export class WsGatewayModule {}
