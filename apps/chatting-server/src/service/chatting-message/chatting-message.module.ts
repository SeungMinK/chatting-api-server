import { Module } from "@nestjs/common";
import { ChattingMessageService } from "./chatting-message.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChattingMessageController } from "./chatting-message.controller";
import { ChattingMessageEntity } from "../../entity/chatting-message.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ChattingMessageEntity])],
  controllers: [ChattingMessageController],
  providers: [ChattingMessageService],
  exports: [ChattingMessageService],
})
export class ChattingMessageModule {}
