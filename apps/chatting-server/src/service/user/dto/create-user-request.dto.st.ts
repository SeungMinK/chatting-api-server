import { IsOptional, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserRequestDto {
  @IsOptional()
  @Length(6, 16)
  @ApiProperty({
    type: String,
    example: "testUser1",
  })
  username: string;
}
