import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class FindOneChattingRoomUserRequestDto {
  @ApiProperty({
    example: "1",
  })
  @IsString()
  @IsNotEmpty()
  chattingRoomId: string;
}
