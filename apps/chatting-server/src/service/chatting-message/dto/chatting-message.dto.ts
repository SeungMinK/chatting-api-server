import { IsDateString, IsObject, IsString } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { UserDto } from "../../user/dto/user.dto";

export class ChattingMessageDto {
  @ApiProperty({
    example: " 1",
  })
  @IsString()
  id: string;

  @ApiProperty({
    example: "채팅 메시지 예시입니다.",
  })
  @IsString()
  content: string;

  @ApiProperty({
    type: UserDto,
  })
  @IsObject()
  user: UserDto;

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
