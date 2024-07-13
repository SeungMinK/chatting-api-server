import { Module } from "@nestjs/common";
import { ChattingRoomUserService } from "./chatting-room-user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChattingRoomUserController } from "./chatting-room-user.controller";
import { ChattingRoomUserEntity } from "../../entity/chatting-room-user.entity";
import { ChattingRoomModule } from "../chatting-room/chatting-room.module";

@Module({
  imports: [
    ChattingRoomModule,
    TypeOrmModule.forFeature([ChattingRoomUserEntity]),
  ],
  controllers: [ChattingRoomUserController],
  providers: [ChattingRoomUserService],
  exports: [ChattingRoomUserService],
})
export class ChattingRoomUserModule {}
