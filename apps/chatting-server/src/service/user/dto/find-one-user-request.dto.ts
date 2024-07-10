import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class FindOneUserRequestDto {
  @IsNotEmpty()
  @ApiProperty({
    example: "1",
  })
  @IsString()
  id: string;
}
