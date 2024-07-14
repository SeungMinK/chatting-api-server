import { IsDateString, IsString } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { UserDto } from "../../user/dto/user.dto";
import { ChattingRoomDto } from "../../chatting-room/dto/chatting-room.dto";

export class ChattingRoomUserDto {
  @ApiProperty({
    example: " 1",
  })
  @IsString()
  id: string;

  @ApiProperty({
    type: UserDto,
  })
  users: UserDto;

  @ApiProperty({
    type: ChattingRoomDto,
  })
  chattingRoom: ChattingRoomDto;

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
