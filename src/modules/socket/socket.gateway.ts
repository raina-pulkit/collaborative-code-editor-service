import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { ACTIONS } from 'constants/socket-events';
import { Server, Socket } from 'socket.io';

interface UserSocketMap {
  [key: string]: {
    userName: string;
    userId: string;
    avatarUrl: string;
  };
}

interface CodeMap {
  [key: string]: string;
}

@WebSocketGateway()
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  private userSocketMap: UserSocketMap = {};
  private codeMap: CodeMap = {};

  handleConnection(_socket: Socket): void {
    console.log('socket connected');
  }

  handleDisconnect(_socket: Socket): void {
    console.log('socket disconnected');
  }

  private getAllConnectedClients(roomId: string): {
    socketId: string;
    userName: string;
    userId: string;
    avatarUrl: string;
  }[] {
    return Array.from(this.server.sockets.adapter.rooms.get(roomId) || []).map(
      socketId => ({
        socketId,
        ...this.userSocketMap[socketId],
      }),
    );
  }

  @SubscribeMessage(ACTIONS.JOIN)
  async handleJoin(
    socket: Socket,
    payload: {
      id: string;
      userName: string;
      userId: string;
      avatarUrl?: string;
    },
  ): Promise<void> {
    const { id, userName, userId, avatarUrl = '' } = payload;

    // Store user info before joining
    this.userSocketMap[socket.id] = { userName, userId, avatarUrl };

    // Join the room
    await socket.join(id);

    // Get updated list of all clients in the room
    const clients = this.getAllConnectedClients(id);

    // Broadcast to all clients in the room (including sender)
    this.server.to(id).emit(ACTIONS.JOINED, {
      clients,
      userName,
      userId,
      socketId: socket.id,
      code: this.codeMap[id],
    });
  }

  @SubscribeMessage(ACTIONS.LEAVE)
  async handleLeave(
    socket: Socket,
    payload: {
      id: string;
      userName: string;
      userId: string;
      avatarUrl?: string;
    },
  ): Promise<void> {
    const { id, userName, userId } = payload;

    // Leave the room first
    await socket.leave(id);

    // Remove user from the map
    delete this.userSocketMap[socket.id];

    // Get updated list of remaining clients
    const clients = this.getAllConnectedClients(id);

    // Broadcast to remaining clients in the room
    this.server.to(id).emit(ACTIONS.DISCONNECTED, {
      clients,
      userName,
      userId,
      socketId: socket.id,
    });
  }

  @SubscribeMessage(ACTIONS.TYPING)
  handleTyping(
    socket: Socket,
    payload: {
      id: string;
      userId: string;
    },
  ): void {
    const { id, userId } = payload;

    // Broadcast to all clients in the room (including sender)
    this.server.to(id).emit(ACTIONS.SOMEONE_TYPING, {
      userName: this.userSocketMap[socket.id].userName,
      userId: userId,
    });
  }

  @SubscribeMessage(ACTIONS.CODE_CHANGE)
  handleCodeChange(
    socket: Socket,
    payload: { id: string; code: string },
  ): void {
    const { id, code } = payload;
    if (code === undefined) {
      socket.to(id).emit(ACTIONS.SYNC_CODE, { code: this.codeMap[id] });
    } else {
      this.codeMap[id] = code;
      socket.to(id).emit(ACTIONS.SYNC_CODE, { code });
    }
  }
}
