import { IsDateString, IsNumber, IsObject, IsString } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { ChattingMessageDto } from "../../chatting-message/dto/chatting-message.dto";

export class ChattingRoomDto {
  @ApiProperty({
    example: " 1",
  })
  @IsString()
  id: string;

  @ApiProperty({
    example: "채팅방 제목",
  })
  @IsString()
  title: string;

  @ApiProperty({
    example: "채팅방 설명",
  })
  description: string;

  @ApiPropertyOptional({
    type: ChattingMessageDto,
  })
  @IsObject()
  lastChattingMessage?: ChattingMessageDto; // 채팅방 마지막 메시지

  @ApiPropertyOptional({
    example: 1,
  })
  @IsNumber()
  numActiveUsersHalfHour?: number; // "최근 30분간 접속자 수"

  @ApiProperty({
    example: "USER",
  })
  @IsString()
  createdBy: string; // 채팅방 생성자

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
