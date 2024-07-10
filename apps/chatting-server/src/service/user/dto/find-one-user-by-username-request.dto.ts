import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class FindOneUserByUsernameRequestDto {
  @IsNotEmpty()
  @ApiProperty({
    example: "testuser1",
  })
  @IsString()
  username: string;
}
