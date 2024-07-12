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

@Entity("users")
export class UserEntity {
  @PrimaryGeneratedColumn("increment", { type: "bigint", unsigned: true })
  id: string;

  @Column({ type: "varchar", unique: true, length: 16 })
  username: string;

  @Column({ length: 255, default: "" })
  description: string;

  @Column({ type: "text", nullable: true })
  profileUrl: string;

  @Column({ type: "varchar", unique: true, length: 255, nullable: true })
  email: string;

  @Column({ type: "varchar", length: 16, nullable: false, default: "USER" })
  role: string;

  @OneToMany(
    () => ChattingRoomUserEntity,
    (chattingRoomUser) => chattingRoomUser.user,
  )
  chattingRoomUsers: ChattingRoomUserEntity[];

  @OneToMany(() => ChattingMessageEntity, (message) => message.user)
  chattingMessages: ChattingMessageEntity[];

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
