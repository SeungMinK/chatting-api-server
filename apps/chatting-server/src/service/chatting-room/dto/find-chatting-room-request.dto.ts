import { IsOptional, IsString } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class FindChattingRoomRequestDto {
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
    example: "chattingRoomUsers.createdAt",
  })
  @IsString()
  @IsOptional()
  order?: string;
}
