import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class FindOneChattingRoomRequestDto {
  @ApiProperty({
    example: "1",
  })
  @IsString()
  @IsNotEmpty()
  id: string;
}
