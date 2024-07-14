import { Body, Controller, Header, Post, ValidationPipe } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ApiCreatedResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthLoginRequestDto } from "./dto/auth-login-request.dto";
import { AuthLoginResponseDto } from "./dto/auth-login-response.dto";

@ApiTags("auth")
@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("auth/login")
  @ApiOperation({
    summary: "로그인",
    description: "회원 가입시 사용한 Username 입력, 비밀 번호 생략",
  })
  @ApiCreatedResponse({
    type: AuthLoginResponseDto,
    description: "application/json.",
  })
  @Header("Content-Type", "application/json")
  async login(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    request: AuthLoginRequestDto,
  ): Promise<AuthLoginResponseDto> {
    return this.authService.login(request);
  }
}
