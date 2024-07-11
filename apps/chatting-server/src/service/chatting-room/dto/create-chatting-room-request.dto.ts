import { IsNotEmpty, IsOptional, IsString, Length } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateChattingRoomRequestDto {
  @ApiProperty({
    type: String,
    example: "testUser1",
  })
  @Length(1, 32)
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({
    type: String,
    example: "testUser1",
  })
  @Length(1, 32)
  @IsString()
  @IsOptional()
  description?: string;

  requestUserId: string;
}
