import {
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

@Entity("chatting_room_user")
export class ChattingRoomUserEntity {
  @PrimaryGeneratedColumn("increment", { type: "bigint", unsigned: true })
  id: string;

  @ManyToOne(
    () => ChattingRoomEntity,
    (chattingRoom) => chattingRoom.chattingRoomUsers,
  )
  chattingRoom: ChattingRoomEntity;

  @ManyToOne(() => UserEntity, (user) => user.chattingRoomUsers)
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
