import { IsDateString, IsString } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class UserDto {
  @ApiProperty({
    example: " 1",
  })
  @IsString()
  id: string;

  @ApiProperty({
    example: "testUser1",
  })
  @IsString()
  username: string;

  @ApiPropertyOptional({
    example: "This is My Description",
  })
  @IsString()
  description?: string;

  @ApiProperty({ example: "2021-01-23T16:57:35.977Z" })
  @IsDateString()
  createdAt: string;

  @ApiProperty({ example: "2021-01-23T16:57:35.977Z" })
  @IsDateString()
  updatedAt: string;

  @ApiPropertyOptional({ example: "2021-01-23T16:57:35.977Z" })
  @IsDateString()
  deletedAt?: string | undefined;
}
