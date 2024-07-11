import { ApiProperty } from "@nestjs/swagger";

export class UpdateChattingRoomResponseDto {
  @ApiProperty({
    example: " 1",
  })
  id: string;
}
