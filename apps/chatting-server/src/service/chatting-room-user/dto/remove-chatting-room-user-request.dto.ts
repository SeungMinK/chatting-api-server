import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class RemoveChattingRoomUserRequestDto {
  @ApiProperty({
    example: "1",
  })
  @IsString()
  @IsNotEmpty()
  chattingRoomId: string;

  requestUserId: string;
}
