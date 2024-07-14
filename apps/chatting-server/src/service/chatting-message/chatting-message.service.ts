import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { plainToInstance } from "class-transformer";
import { ChattingMessageEntity } from "../../entity/chatting-message.entity";
import { CreateChattingMessageRequestDto } from "./dto/create-chatting-message-request.dto";
import { CreateChattingMessageResponseDto } from "./dto/create-chatting-message-response.dto";
import { FindChattingMessageRequestDto } from "./dto/find-chatting-message-request.dto";
import { FindChattingMessageResponseDto } from "./dto/find-chatting-message-response.dto";

@Injectable()
export class ChattingMessageService {
  constructor(
    @InjectRepository(ChattingMessageEntity)
    private readonly chattingMessageRepository: Repository<ChattingMessageEntity>,
  ) {}

  async createChattingMessage(
    request: CreateChattingMessageRequestDto,
  ): Promise<CreateChattingMessageResponseDto> {
    console.log(request, "createChattingMessage");
    const creatableChattingMessage =
      await this.chattingMessageRepository.create({
        content: request.content,
        user: { id: request.userId },
        chattingRoom: { id: request.chattingRoomId },
      });

    console.log(
      creatableChattingMessage,
      "createChattingMessage",
      "creatableChattingMessage",
    );

    const createdChattingMessage = await this.chattingMessageRepository.save(
      creatableChattingMessage,
    );

    console.log(
      createdChattingMessage,
      "createChattingMessage",
      "createdChattingMessage",
    );

    return { id: createdChattingMessage.id };
  }

  async findChattingMessage(
    request: FindChattingMessageRequestDto,
  ): Promise<FindChattingMessageResponseDto[]> {
    console.log(request, "findChattingMessage");

    const queryBuilder = this.chattingMessageRepository
      .createQueryBuilder("chatting_messages")
      .leftJoinAndSelect("chatting_messages.chattingRoom", "chattingRoom")
      .leftJoinAndSelect("chatting_messages.user", "user");

    if (request.chattingRoomId) {
      queryBuilder.andWhere("chattingRoom.id = :chattingRoomId", {
        chattingRoomId: request.chattingRoomId,
      });
    }

    if (request.page && request.limit) {
      queryBuilder.skip((request.page - 1) * request.limit).take(request.limit);
    } else if (request.limit) {
      queryBuilder.take(request.limit);
    }

    if (request.order) {
      queryBuilder.orderBy(request.order);
    }

    const existChattingMessage = await queryBuilder.getMany();

    console.log(existChattingMessage, "findChattingMessage");
    return plainToInstance(
      FindChattingMessageResponseDto,
      existChattingMessage,
    );
  }
}
