import { IsNotEmpty, IsOptional, IsString, Length } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateChattingMessageRequestDto {
  @ApiProperty({
    type: String,
    example: "testUser1",
  })
  @Length(1, 32)
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({
    type: String,
    example: "testUser1",
  })
  @Length(1, 32)
  @IsString()
  @IsOptional()
  userId?: string;

  @ApiPropertyOptional({
    type: String,
    example: "testUser1",
  })
  @Length(1, 32)
  @IsString()
  @IsOptional()
  chattingRoomId?: string;
}
