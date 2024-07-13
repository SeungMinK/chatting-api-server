import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ChattingRoomEntity } from "../../entity/chatting-room.entity";
import { FindOneChattingRoomRequestDto } from "./dto/find-one-chatting-room-request.dto";
import { FindChattingRoomRequestDto } from "./dto/find-chatting-room-request.dto";
import { CreateChattingRoomRequestDto } from "./dto/create-chatting-room-request.dto";
import { UpdateChattingRoomRequestDto } from "./dto/update-chatting-room-request.dto";
import { RemoveChattingRoomRequestDto } from "./dto/remove-chatting-room-request.dto";
import { UpdateChattingRoomResponseDto } from "./dto/update-chatting-room-response.dto";
import { CreateChattingRoomResponseDto } from "./dto/create-chatting-room-response.dto";
import { FindChattingRoomResponseDto } from "./dto/find-chatting-room-response.dto";
import { FindOneChattingRoomResponseDto } from "./dto/find-one-chatting-room-response.dto";
import { plainToInstance } from "class-transformer";

@Injectable()
export class ChattingRoomService {
  constructor(
    @InjectRepository(ChattingRoomEntity)
    private readonly chattingRoomRepository: Repository<ChattingRoomEntity>,
  ) {}

  async findOneChattingRoom(
    request: FindOneChattingRoomRequestDto,
  ): Promise<FindOneChattingRoomResponseDto> {
    console.log(request, "findOneChattingRoom");

    let existChattingRoom = await this.chattingRoomRepository.findOne({
      where: { id: request.id },
      relations: { chattingRoomUsers: { user: true } },
    });

    console.log(existChattingRoom, "findOneChattingRoom", "existChattingRoom");
    if (!existChattingRoom) {
      throw new HttpException(
        {
          code: "NOT_EXIST_CHATTING_ROOM",
          status: HttpStatus.NOT_FOUND,
          message: `생성 되지 않은 채팅방(id : ${request.id})`,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return plainToInstance(FindOneChattingRoomResponseDto, existChattingRoom);
  }

  async findChattingRoom(
    request: FindChattingRoomRequestDto,
  ): Promise<FindChattingRoomResponseDto[]> {
    console.log(request, "findChattingRoom");
    const createdAtCondition = new Date(Date.now() - 30 * 60 * 1000); // 30분 전 시간

    const queryBuilder = this.chattingRoomRepository
      .createQueryBuilder("chatting_rooms")
      .leftJoinAndSelect(
        "chatting_rooms.chattingRoomUsers",
        "chattingRoomUsers",
        `chattingRoomUsers.createdAt >= :createdAtCondition`,
        { createdAtCondition: createdAtCondition },
      )
      .leftJoinAndSelect("chatting_rooms.chattingMessages", "chattingMessages");

    let existChattingRoom = await queryBuilder.getMany();

    // 조회 시점을 기준으로 30분간 활동 유저수 Count
    existChattingRoom.forEach((room) => {
      room.numActiveUserCount = room.chattingRoomUsers.length;
      room.lastChattingMessage =
        room.chattingMessages?.[room.chattingMessages.length - 1] || null;
    });

    // numActiveUserCount 가 높은 순서대로 정렬
    existChattingRoom = existChattingRoom.sort(
      (a, b) => b.numActiveUserCount - a.numActiveUserCount,
    );

    return plainToInstance(FindChattingRoomResponseDto, existChattingRoom);
  }

  async createChattingRoom(
    request: CreateChattingRoomRequestDto,
  ): Promise<CreateChattingRoomResponseDto> {
    console.log(request, "createChattingRoom");
    const creatableChattingRoom =
      await this.chattingRoomRepository.create(request);

    console.log(
      creatableChattingRoom,
      "createChattingRoom",
      "creatableChattingRoom",
    );

    creatableChattingRoom.createdBy = request.requestUserId;

    const createdChattingRoom = await this.chattingRoomRepository.save(
      creatableChattingRoom,
    );

    console.log(
      createdChattingRoom,
      "createChattingRoom",
      "createdChattingRoom",
    );

    return { id: createdChattingRoom.id };
  }

  async updateChattingRoom(
    request: UpdateChattingRoomRequestDto,
  ): Promise<UpdateChattingRoomResponseDto> {
    console.log(request, "updateChattingRoom", "request");

    const existChattingRoom = await this.chattingRoomRepository.findOne({
      where: { id: request.id },
    });

    console.log(existChattingRoom, "updateChattingRoom", "existChattingRoom");

    if (!existChattingRoom) {
      throw new HttpException(
        {
          code: "NOT_EXIST_CHATTING_ROOM",
          status: HttpStatus.NOT_FOUND,
          message: `생성 되지 않은 채팅방(id : ${request.id})`,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const mergedChattingRoom = await this.chattingRoomRepository.merge(
      existChattingRoom,
      request,
    );

    console.log(mergedChattingRoom, "updateChattingRoom", "mergedChattingRoom");

    const updatedChattingRoom =
      await this.chattingRoomRepository.save(mergedChattingRoom);

    console.log(
      updatedChattingRoom,
      "updateChattingRoom",
      "updatedChattingRoom",
    );

    return { id: updatedChattingRoom.id };
  }

  async removeChattingRoom(
    request: RemoveChattingRoomRequestDto,
  ): Promise<void> {
    console.log(request, "removeChattingRoom", "request");

    const existChattingRoom = await this.chattingRoomRepository.findOne({
      where: { id: request.id },
    });

    console.log(existChattingRoom, "removeChattingRoom", "existChattingRoom");

    if (!existChattingRoom) {
      throw new HttpException(
        {
          code: "NOT_EXIST_CHATTING_ROOM",
          status: HttpStatus.NOT_FOUND,
          message: `생성 되지 않은 채팅방(id : ${request.id})`,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    await this.chattingRoomRepository.softRemove(existChattingRoom);

    return;
  }
}
