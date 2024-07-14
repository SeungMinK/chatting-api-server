import { HttpStatus, Injectable } from "@nestjs/common";
import { Server, Socket } from "socket.io";
import { ChattingRoomUserService } from "../chatting-room-user/chatting-room-user.service";
import { ChattingRoomService } from "../chatting-room/chatting-room.service";

interface UserRoomMap {
  [userId: string]: Set<string>;
}

interface JoinLeavePayload {
  userId: string;
  username: string;
  chattingRoomId: string;
}

@Injectable()
export class WsGatewayService {
  constructor(
    private chattingRoomUserService: ChattingRoomUserService,
    private chattingRoomService: ChattingRoomService,
  ) {}

  async handleUserRejoin(userRooms: UserRoomMap, payload: JoinLeavePayload) {
    if (userRooms[payload.userId]?.has(payload.chattingRoomId)) {
      await this.chattingRoomUserService
        .removeChattingRoomUser({
          requestUserId: payload.userId,
          chattingRoomId: payload.chattingRoomId,
        })
        .catch((e) => e);

      userRooms[payload.userId].delete(payload.chattingRoomId);
      if (userRooms[payload.userId].size === 0) {
        delete userRooms[payload.userId];
      }
    }
  }

  async addUserToRoom(
    server: Server,
    client: Socket,
    userRooms: UserRoomMap,
    payload: JoinLeavePayload,
  ) {
    client.join(payload.chattingRoomId);
    if (!userRooms[payload.userId]) {
      userRooms[payload.userId] = new Set();
    }
    userRooms[payload.userId].add(payload.chattingRoomId);

    await this.chattingRoomUserService
      .createChattingRoomUser({
        requestUserId: payload.userId,
        chattingRoomId: payload.chattingRoomId,
      })
      .catch((e) => e);

    const existChattingRoom =
      await this.chattingRoomService.findOneChattingRoom({
        id: payload.chattingRoomId,
      });

    server.emit("user-joined", {
      statusCode: HttpStatus.OK,
      message: ["success"],
      userId: payload.userId,
      username: payload.username,
      chattingRoomId: payload.chattingRoomId,
      numActiveUsersHalfHour: existChattingRoom.numActiveUsersHalfHour ?? 0,
    });
  }

  async removeUserFromRoom(
    server: Server,
    client: Socket,
    userRooms: UserRoomMap,
    payload: JoinLeavePayload,
  ) {
    client.leave(payload.chattingRoomId);
    if (userRooms[payload.userId]) {
      userRooms[payload.userId].delete(payload.chattingRoomId);
      if (userRooms[payload.userId].size === 0) {
        delete userRooms[payload.userId];
      }
    }

    server.to(payload.chattingRoomId).emit("user-left", {
      userId: payload.userId,
      username: payload.username,
    });

    await this.chattingRoomUserService
      .removeChattingRoomUser({
        requestUserId: payload.userId,
        chattingRoomId: payload.chattingRoomId,
      })
      .catch((e) => e);
  }
}
