import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  ValidationPipe,
} from "@nestjs/common";
import { CreateChattingRoomResponseDto } from "./dto/create-chatting-room-response.dto";
import { FindOneChattingRoomResponseDto } from "./dto/find-one-chatting-room-response.dto";
import { ChattingRoomService } from "./chatting-room.service";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guard/jwt-auth.guard";
import { CreateChattingRoomRequestDto } from "./dto/create-chatting-room-request.dto";
import { FindChattingRoomRequestDto } from "./dto/find-chatting-room-request.dto";
import { UpdateChattingRoomResponseDto } from "./dto/update-chatting-room-response.dto";
import { UpdateChattingRoomRequestDto } from "./dto/update-chatting-room-request.dto";
import { AuthUser } from "../../libs/auth-user.decorator";
import { User } from "../user/user.controller";

@ApiTags("chatting-rooms")
@ApiBearerAuth()
@Controller()
@UseGuards(JwtAuthGuard)
export class ChattingRoomController {
  constructor(private chattingRoomService: ChattingRoomService) {}

  @Post("chatting-rooms")
  @ApiOperation({
    summary: "채팅방 생성",
  })
  @ApiCreatedResponse({
    type: CreateChattingRoomResponseDto,
    description: "application/json.",
  })
  async createChattingRoom(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    request: CreateChattingRoomRequestDto,
    @AuthUser() user: User,
  ): Promise<CreateChattingRoomResponseDto> {
    return this.chattingRoomService.createChattingRoom({
      ...request,
      requestUserId: user.id,
    });
  }

  @Get("chatting-rooms")
  @ApiOperation({
    summary: "채팅방 리스트 조회",
  })
  @ApiOkResponse({
    isArray: true,
    type: FindOneChattingRoomResponseDto,
    description: "application/json.",
  })
  @Header("Content-Type", "application/json")
  async findChattingRoom(
    @Query(
      new ValidationPipe({
        transform: true,
        whitelist: true,
      }),
    )
    query: FindChattingRoomRequestDto,
  ): Promise<FindOneChattingRoomResponseDto[]> {
    return this.chattingRoomService.findChattingRoom(query);
  }

  @Get("chatting-rooms/:chattingRoomId")
  @ApiOperation({
    summary: "채팅방 상세 조회",
  })
  @ApiOkResponse({
    type: FindOneChattingRoomResponseDto,
    description: "application/json.",
  })
  @Header("Content-Type", "application/json")
  async findOneChattingRoom(
    @Param("chattingRoomId") chattingRoomId: string,
    @AuthUser() user: User,
  ): Promise<FindOneChattingRoomResponseDto> {
    return this.chattingRoomService.findOneChattingRoom({ id: chattingRoomId });
  }

  @Put("chatting-rooms/:chattingRoomId")
  @ApiOperation({
    summary: "채팅방 수정",
  })
  @ApiOkResponse({
    type: UpdateChattingRoomResponseDto,
    description: "application/json.",
  })
  @Header("Content-Type", "application/json")
  async updateChattingRoom(
    @Param("chattingRoomId") chattingRoomId: string,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    request: UpdateChattingRoomRequestDto,
  ): Promise<UpdateChattingRoomResponseDto> {
    return this.chattingRoomService.updateChattingRoom(request);
  }

  @Delete("chatting-rooms/:chattingRoomId")
  @ApiOperation({
    summary: "채팅방 삭제",
  })
  @Header("Content-Type", "application/json")
  @HttpCode(HttpStatus.NO_CONTENT)
  removeChattingRoom(
    @Param("chattingRoomId") chattingRoomId: string,
  ): Promise<void> {
    return this.chattingRoomService.removeChattingRoom({ id: chattingRoomId });
  }
}
