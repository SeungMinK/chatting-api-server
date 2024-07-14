import { IsDateString, IsNumber, IsString } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class ChattingRoomDto {
  @ApiProperty({
    example: " 1",
  })
  @IsString()
  id: string;

  @ApiProperty({
    example: "testUser1",
  })
  @IsString()
  title: string;

  @ApiPropertyOptional({
    example: "This is My Description",
  })
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: "https://chattingServer.png",
  })
  @IsString()
  users?: string;

  @ApiProperty({
    example: "testUser1@chatting.com",
  })
  @IsString()
  chattingMessages?: string;

  @ApiProperty({
    example: "USER",
  })
  @IsString()
  lastChattingMessage?: string;

  @ApiProperty({
    example: 1,
  })
  @IsNumber()
  numActiveUsersHalfHour: number; // "최근 30분간 접속자 수"

  @ApiProperty({
    example: "USER",
  })
  @IsString()
  createdBy: string;

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
