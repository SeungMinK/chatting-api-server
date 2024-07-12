import { ApiProperty } from "@nestjs/swagger";

export class CreateChattingRoomUserResponseDto {
  @ApiProperty({
    example: " 1",
  })
  id: string;
}
