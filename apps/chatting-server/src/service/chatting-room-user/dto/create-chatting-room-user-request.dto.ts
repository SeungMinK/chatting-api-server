import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateChattingRoomUserRequestDto {
  @ApiProperty({
    type: String,
    example: "1",
  })
  @IsString()
  @IsNotEmpty()
  chattingRoomId: string;

  requestUserId: string;
}
