import { Module } from "@nestjs/common";
import { ChattingRoomService } from "./chatting-room.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChattingRoomController } from "./chatting-room.controller";
import { ChattingRoomEntity } from "../../entity/chatting-room.entity";
import { LoggerModule } from "nestjs-pino";

@Module({
  imports: [
    TypeOrmModule.forFeature([ChattingRoomEntity]),
    LoggerModule.forRoot(),
  ],
  controllers: [ChattingRoomController],
  providers: [ChattingRoomService],
  exports: [ChattingRoomService],
})
export class ChattingRoomModule {}
