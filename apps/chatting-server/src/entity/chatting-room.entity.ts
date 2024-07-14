import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Transform } from "class-transformer";
import { ChattingMessageEntity } from "./chatting-message.entity";
import { ChattingRoomUserEntity } from "./chatting-room-user.entity";

@Entity("chatting_rooms")
export class ChattingRoomEntity {
  @PrimaryGeneratedColumn("increment", { type: "bigint", unsigned: true })
  id: string;

  @Column({ type: "varchar", length: 32, comment: "채팅방 제목" })
  title: string;

  @Column({ length: 255, default: "", comment: "채팅방 설명" })
  description: string;

  @OneToMany(
    () => ChattingRoomUserEntity,
    (chattingRoomUser) => chattingRoomUser.chattingRoom,
  )
  chattingRoomUsers: ChattingRoomUserEntity[];

  @OneToMany(
    () => ChattingMessageEntity,
    (chattingMessage) => chattingMessage.chattingRoom,
  )
  chattingMessages: ChattingMessageEntity[];

  // 실시간 갱신 데이터, DB에 저장 X
  numActiveUsersHalfHour: number; // "최근 30분간 접속자 수"

  // 실시간 갱신 데이터, DB에 저장 X
  lastChattingMessage: ChattingMessageEntity;

  @CreateDateColumn()
  @Transform(({ value }) =>
    typeof value !== "string" ? value?.toISOString() : value,
  )
  createdAt: Date;

  @Column({ length: 255, default: "", comment: "채팅방 생성자" })
  createdBy: string;

  @UpdateDateColumn()
  @Transform(({ value }) =>
    typeof value !== "string" ? value?.toISOString() : value,
  )
  updatedAt: Date;

  @DeleteDateColumn()
  @Transform(({ value }) =>
    typeof value !== "string" ? value?.toISOString() : value,
  )
  deletedAt: Date;
}
