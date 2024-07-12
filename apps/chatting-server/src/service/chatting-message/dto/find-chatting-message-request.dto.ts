import { IsOptional, IsString } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class FindChattingMessageRequestDto {
  @ApiPropertyOptional({
    example: 25,
  })
  @IsString()
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({
    example: 25,
  })
  @IsString()
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({
    example: "createdAt",
  })
  @IsString()
  @IsOptional()
  order?: string;

  @ApiPropertyOptional({
    type: String,
    example: "1",
  })
  @IsString()
  @IsOptional()
  chattingRoomId: string;
}
