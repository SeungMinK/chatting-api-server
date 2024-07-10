import {
  Body,
  Controller,
  Get,
  Header,
  Param,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import { CreateUserResponseDto } from "./dto/create-user-response.dto";
import { CreateUserRequestDto } from "./dto/create-user-request.dto.st";
import { FindOneUserResponseDto } from "./dto/find-one-user-response.dto";
import { UserService } from "./user.service";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guard/jwt-auth.guard";

export type User = any;

@ApiTags("users")
@ApiBearerAuth()
@Controller()
export class UserController {
  constructor(private userService: UserService) {}

  @Get("users/:userId")
  @ApiOperation({
    summary: "유저 정보 조회",
  })
  @ApiCreatedResponse({
    type: CreateUserResponseDto,
    description: "application/json.",
  })
  @Header("Content-Type", "application/json")
  async findOneUser(
    @Param("userId") userId: string,
  ): Promise<FindOneUserResponseDto> {
    return this.userService.findOneUser({ id: userId });
  }

  @Post("users")
  @ApiOperation({
    summary: "회원 가입",
  })
  @ApiCreatedResponse({
    type: CreateUserResponseDto,
    description: "application/json.",
  })
  async createUser(
    @Body() request: CreateUserRequestDto,
  ): Promise<CreateUserResponseDto> {
    console.log(request, "createUser");
    return this.userService.createUser(request);
  }

  @UseGuards(JwtAuthGuard)
  @Get("my/profile")
  @ApiOperation({
    summary: "유저 정보 상세 조회",
    description: "JWT 토큰 안에 들어 있는 유저 정보",
  })
  @ApiOkResponse({ type: FindOneUserResponseDto })
  async getProfile(@Request() request): Promise<FindOneUserResponseDto> {
    console.log(request, "getProfile");
    return request.user as FindOneUserResponseDto;
  }
}
