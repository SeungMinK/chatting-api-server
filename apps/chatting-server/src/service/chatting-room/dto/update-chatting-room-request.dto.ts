import { IsOptional, IsString, Length } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateChattingRoomRequestDto {
  id: string;

  @ApiPropertyOptional({
    type: String,
    example: "testUser1",
  })
  @Length(1, 32)
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    type: String,
    example: "testUser1",
  })
  @Length(1, 32)
  @IsString()
  @IsOptional()
  description?: string;
}
