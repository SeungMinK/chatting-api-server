import { IsOptional, IsString } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class FindChattingMessageRequestDto {
  @ApiPropertyOptional({
    example: 5,
  })
  @IsString()
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({
    example: 1,
  })
  @IsString()
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({
    example: "chatting_messages.createdAt",
  })
  @IsString()
  @IsOptional()
  order?: string;

  @ApiPropertyOptional({
    example: "1",
  })
  @IsString()
  @IsOptional()
  chattingRoomId: string;
}
