import { Module } from "@nestjs/common";
import { WsGateway } from "./ws-gateway";
import { WsGatewayService } from "./ws-gateway.service";
import { WsGatewayController } from "./ws-gateway.controller";

@Module({
  imports: [],
  controllers: [WsGatewayController],
  providers: [WsGateway, WsGatewayService],
})
export class WsGatewayModule {}
