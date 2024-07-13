import { ApiProperty } from "@nestjs/swagger";

export class CreateChattingRoomResponseDto {
  @ApiProperty({
    example: " 1",
  })
  id: string;
}
