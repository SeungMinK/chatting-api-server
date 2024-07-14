import { IsNotEmpty, IsOptional, IsString, Length } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateChattingRoomRequestDto {
  @ApiProperty({
    example: "채팅방 제목",
  })
  @Length(1, 32)
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({
    example: "채팅방 설명",
  })
  @Length(1, 255)
  @IsString()
  @IsOptional()
  description?: string;

  requestUserId: string; // 요청자 Id, Token 에 포함
}
