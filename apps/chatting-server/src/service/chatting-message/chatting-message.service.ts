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
    let existChattingMessage = await this.chattingMessageRepository.find({
      where: { chattingRoom: { id: request.chattingRoomId } },
      relations: { user: true },
    });

    return plainToInstance(
      FindChattingMessageResponseDto,
      existChattingMessage,
    );
  }
}
