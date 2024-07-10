import { IsDateString, IsString } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class JwtPayloadDto {
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

  @ApiPropertyOptional({
    example: "https://chattingServer.png",
  })
  @IsString()
  profileUrl?: string;

  @ApiProperty({
    example: "testUser1@chatting.com",
  })
  @IsString()
  email?: string;

  @ApiProperty({
    example: "USER",
  })
  @IsString()
  role: string;

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
