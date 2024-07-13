import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Transform } from "class-transformer";
import { ChattingRoomEntity } from "./chatting-room.entity";
import { UserEntity } from "./user.entity";

@Entity("chatting_messages")
export class ChattingMessageEntity {
  @PrimaryGeneratedColumn("increment", { type: "bigint", unsigned: true })
  id: string;

  @Column({ type: "varchar", length: 1024, comment: "메시지" })
  content: string;

  @ManyToOne(
    () => ChattingRoomEntity,
    (chattingRoom) => chattingRoom.chattingMessages,
  )
  chattingRoom: ChattingRoomEntity;

  @ManyToOne(() => UserEntity, (User) => User.chattingMessages)
  user: UserEntity;

  @CreateDateColumn()
  @Transform(({ value }) =>
    typeof value !== "string" ? value?.toISOString() : value,
  )
  createdAt: Date;

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
