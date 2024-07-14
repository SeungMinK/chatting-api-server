import { IsNotEmpty, IsString, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateChattingMessageRequestDto {
  @ApiProperty({
    example: "채팅 메시지 예시",
  })
  @Length(1, 1024)
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    example: "1",
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    type: String,
    example: "testUser1",
  })
  @IsString()
  @IsNotEmpty()
  chattingRoomId: string;
}
