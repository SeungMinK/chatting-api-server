import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { plainToInstance } from "class-transformer";
import { ChattingRoomUserEntity } from "../../entity/chatting-room-user.entity";
import { FindOneChattingRoomUserRequestDto } from "./dto/find-one-chatting-room-user-request.dto";
import { FindOneChattingRoomUserResponseDto } from "./dto/find-one-chatting-room-user-response.dto";
import { CreateChattingRoomUserRequestDto } from "./dto/create-chatting-room-user-request.dto";
import { CreateChattingRoomUserResponseDto } from "./dto/create-chatting-room-user-response.dto";
import { RemoveChattingRoomUserRequestDto } from "./dto/remove-chatting-room-user-request.dto";
import { ChattingRoomService } from "../chatting-room/chatting-room.service";

@Injectable()
export class ChattingRoomUserService {
  constructor(
    @InjectRepository(ChattingRoomUserEntity)
    private readonly chattingRoomUserRepository: Repository<ChattingRoomUserEntity>,
    private readonly chattingRoomService: ChattingRoomService,
  ) {}

  async findChattingRoomUser(
    request: FindOneChattingRoomUserRequestDto,
  ): Promise<FindOneChattingRoomUserResponseDto[]> {
    console.log(request, "findChattingRoomUser");
    let existChattingRoomUser = await this.chattingRoomUserRepository.find({
      where: { chattingRoom: { id: request.chattingRoomId } },
      relations: { user: true, chattingRoom: true },
    });
    console.log(
      existChattingRoomUser,
      "findChattingRoomUser",
      "existChattingRoomUser",
    );
    if (!existChattingRoomUser) {
      throw new HttpException(
        {
          code: "NOT_EXIST_CHATTING_ROOM_USER",
          status: HttpStatus.NOT_FOUND,
          message: `생성 되지 않은 채팅방(id : ${request.chattingRoomId})`,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return plainToInstance(
      FindOneChattingRoomUserResponseDto,
      existChattingRoomUser,
    );
  }

  async createChattingRoomUser(
    request: CreateChattingRoomUserRequestDto,
  ): Promise<CreateChattingRoomUserResponseDto> {
    console.log(request, "createChattingRoomUser");

    // 채팅방이 이미 있는지 먼저 체크
    await this.chattingRoomService.findOneChattingRoom({
      id: request.chattingRoomId,
    });

    const existChattingRoomUser = await this.chattingRoomUserRepository.findOne(
      {
        where: {
          chattingRoom: { id: request.chattingRoomId },
          user: { id: request.requestUserId },
        },
        relations: { chattingRoom: true, user: true },
      },
    );
    console.log(
      existChattingRoomUser,
      "createChattingRoomUser",
      "existChattingRoomUser",
    );

    if (existChattingRoomUser) {
      throw new HttpException(
        {
          code: "ALREADY_EXIST_CHATTING_ROOM_USER",
          status: HttpStatus.CONFLICT,
          message: `이미 입장한 유저 (id : ${request.requestUserId})`,
        },
        HttpStatus.CONFLICT,
      );
    }

    const creatableChattingRoomUser =
      await this.chattingRoomUserRepository.create({
        chattingRoom: { id: request.chattingRoomId },
        user: { id: request.requestUserId },
      });

    console.log(
      creatableChattingRoomUser,
      "createChattingRoomUser",
      "creatableChattingRoomUser",
    );

    const createdChattingRoomUser = await this.chattingRoomUserRepository.save(
      creatableChattingRoomUser,
    );

    console.log(
      createdChattingRoomUser,
      "createChattingRoomUser",
      "createdChattingRoomUser",
    );

    return { id: createdChattingRoomUser.id };
  }

  async removeChattingRoomUser(
    request: RemoveChattingRoomUserRequestDto,
  ): Promise<void> {
    console.log(request, "removeChattingRoomUser", "request");

    const existChattingRoomUser = await this.chattingRoomUserRepository.findOne(
      {
        where: {
          chattingRoom: { id: request.chattingRoomId },
          user: { id: request.requestUserId },
        },
        relations: { chattingRoom: true, user: true },
      },
    );

    console.log(
      existChattingRoomUser,
      "removeChattingRoomUser",
      "existChattingRoomUser",
    );

    if (!existChattingRoomUser) {
      throw new HttpException(
        {
          code: "NOT_EXIST_CHATTING_ROOM_USER",
          status: HttpStatus.NOT_FOUND,
          message: `입장 하지 않은 유저 (id : ${request.requestUserId})`,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    await this.chattingRoomUserRepository.softRemove(existChattingRoomUser);

    return;
  }
}
