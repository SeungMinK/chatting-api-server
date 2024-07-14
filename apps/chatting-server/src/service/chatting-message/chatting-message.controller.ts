import {
  Body,
  Controller,
  Get,
  Header,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from "@nestjs/common";
import { CreateChattingMessageResponseDto } from "./dto/create-chatting-message-response.dto";

import { ChattingMessageService } from "./chatting-message.service";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guard/jwt-auth.guard";
import { CreateChattingMessageRequestDto } from "./dto/create-chatting-message-request.dto";
import { FindChattingMessageRequestDto } from "./dto/find-chatting-message-request.dto";
import { AuthUser } from "../../libs/auth-user.decorator";
import { User } from "../user/user.controller";
import { FindChattingMessageResponseDto } from "./dto/find-chatting-message-response.dto";

@ApiTags("chatting-messages")
@ApiBearerAuth()
@Controller()
@UseGuards(JwtAuthGuard)
export class ChattingMessageController {
  constructor(private chattingMessageService: ChattingMessageService) {}

  @Post("chatting-messages")
  @ApiOperation({
    summary: "채팅 메시지 생성",
  })
  @ApiCreatedResponse({
    type: CreateChattingMessageResponseDto,
    description: "application/json.",
  })
  async createChattingMessage(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    request: CreateChattingMessageRequestDto,
    @AuthUser() user: User,
  ): Promise<CreateChattingMessageResponseDto> {
    console.log(request, "createUser");
    return this.chattingMessageService.createChattingMessage({
      ...request,
    });
  }

  @Get("chatting-messages")
  @ApiOperation({
    summary: "채팅방에 대한 채팅 메시지 전체 조회",
  })
  @ApiOkResponse({
    isArray: true,
    type: FindChattingMessageResponseDto,
    description: "application/json.",
  })
  @Header("Content-Type", "application/json")
  async findChattingMessage(
    @Query(
      new ValidationPipe({
        transform: true,
        whitelist: true,
      }),
    )
    query: FindChattingMessageRequestDto,
  ): Promise<FindChattingMessageResponseDto[]> {
    return this.chattingMessageService.findChattingMessage(query);
  }
}
