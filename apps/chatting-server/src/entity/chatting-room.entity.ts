import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
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

  @ManyToOne(() => ChattingMessageEntity)
  @JoinColumn({ name: "lastChattingMessageId" })
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
