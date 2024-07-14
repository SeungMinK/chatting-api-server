import { IsOptional, IsString, Length } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateChattingRoomRequestDto {
  id: string; // ChattingRoomId

  @ApiPropertyOptional({
    example: "채팅방 제목",
  })
  @Length(1, 32)
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    type: String,
    example: "채팅방 설명",
  })
  @Length(1, 255)
  @IsString()
  @IsOptional()
  description?: string;
}
