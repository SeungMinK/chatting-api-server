import { IsOptional, IsString } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class FindChattingRoomRequestDto {
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
}
