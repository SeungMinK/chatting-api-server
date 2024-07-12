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
  UseGuards,
} from "@nestjs/common";
import { CreateChattingRoomUserResponseDto } from "./dto/create-chatting-room-user-response.dto";
import { FindOneChattingRoomUserResponseDto } from "./dto/find-one-chatting-room-user-response.dto";
import { ChattingRoomUserService } from "./chatting-room-user.service";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guard/jwt-auth.guard";
import { CreateChattingRoomUserRequestDto } from "./dto/create-chatting-room-user-request.dto";
import { AuthUser } from "../../libs/auth-user.decorator";
import { User } from "../user/user.controller";

@ApiTags("chatting-room")
@ApiBearerAuth()
@Controller()
@UseGuards(JwtAuthGuard)
export class ChattingRoomUserController {
  constructor(private chattingRoomService: ChattingRoomUserService) {}

  @Post("chatting-room-users")
  @ApiOperation({
    summary: "채팅방 입장",
  })
  @ApiCreatedResponse({
    type: CreateChattingRoomUserResponseDto,
    description: "application/json.",
  })
  async createChattingRoomUser(
    @Body() request: CreateChattingRoomUserRequestDto,
    @AuthUser() user: User,
  ): Promise<CreateChattingRoomUserResponseDto> {
    return this.chattingRoomService.createChattingRoomUser({
      ...request,
      requestUserId: user.id,
    });
  }

  @Get("chatting-room-users")
  @ApiOperation({
    summary: "채팅방 입장 인원 조회",
  })
  @ApiOkResponse({
    isArray: true,
    type: FindOneChattingRoomUserResponseDto,
    description: "application/json.",
  })
  @Header("Content-Type", "application/json")
  async findChattingRoomUser(
    @Param("chattingRoomId") chattingRoomId: string,
    @AuthUser() user: User,
  ): Promise<FindOneChattingRoomUserResponseDto[]> {
    return this.chattingRoomService.findChattingRoomUser({
      chattingRoomId: chattingRoomId,
    });
  }

  @Delete("chatting-room/:chattingRoomId")
  @ApiOperation({
    summary: "채팅방 나가기",
  })
  @Header("Content-Type", "application/json")
  @HttpCode(HttpStatus.NO_CONTENT)
  removeChattingRoomUser(
    @Param("chattingRoomId") chattingRoomId: string,
    @AuthUser() user: User,
  ): Promise<void> {
    return this.chattingRoomService.removeChattingRoomUser({
      chattingRoomId: chattingRoomId,
      requestUserId: user.id,
    });
  }
}
