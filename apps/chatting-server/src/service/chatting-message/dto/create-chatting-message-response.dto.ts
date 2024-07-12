import { ApiProperty } from "@nestjs/swagger";

export class CreateChattingMessageResponseDto {
  @ApiProperty({
    example: " 1",
  })
  id: string;
}
