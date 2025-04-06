import { Injectable } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { ACTIONS } from 'constants/socket-events';
import { UpdateRoomDto } from 'modules/room/dto/update-room.dto';
import { RoomService } from 'modules/room/room.service';
import { Server, Socket } from 'socket.io';

interface UserSocketMap {
  [key: string]: {
    userName: string;
    userId: string;
    avatarUrl: string;
  };
}

interface CodeMap {
  [key: string]: {
    code: string;
    language: string;
    lastUpdated: Date;
  };
}

@Injectable()
@WebSocketGateway()
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  private userSocketMap: UserSocketMap = {};
  private codeMap: CodeMap = {};

  constructor(private readonly roomService: RoomService) {}

  handleConnection(socket: Socket): void {
    console.log('socket connected: ', socket.id);
  }

  async handleDisconnect(socket: Socket): Promise<void> {
    console.log('socket disconnected: ', socket.id);
    // Save code state if user disconnects
    await this.saveCodeStateForUserRooms(socket);

    const user = this.userSocketMap[socket.id];

    if (!user) return;

    this.server.emit(ACTIONS.DISCONNECTED, {
      userName: user.userName,
      userId: user.userId,
    });

    // Remove user from userSocketMap
    delete this.userSocketMap[socket.id];
  }

  private async saveCodeStateForUserRooms(socket: Socket): Promise<void> {
    // Get all rooms the socket is in
    const socketRooms = Array.from(socket.rooms).filter(
      room => room !== socket.id,
    );

    // Save code state for each room
    for (const roomId of socketRooms) {
      if (this.codeMap[roomId]) {
        try {
          // Get room from database
          const room = await this.roomService.findOne(roomId);
          if (room) {
            // Update room with latest code
            const updateDto: UpdateRoomDto = {
              lastLanguage: this.codeMap[roomId].language,
              // Additional code-related properties could be added to Room entity
            };
            await this.roomService.update(roomId, updateDto);
          }
        } catch (error) {
          console.error(`Failed to save code state for room ${roomId}:`, error);
        }
      }
    }
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

  private async isUserAuthorized(
    roomId: string,
    userId: string,
  ): Promise<boolean> {
    try {
      const room = await this.roomService.findOne(roomId);
      if (!room) return false;

      // Check if user is the owner
      if (room.ownerUuid === userId) return true;

      // Check if user is invited
      const isInvited = room.invitedUsers?.some(user => user.id === userId);

      // Allow if room is not private or user is invited
      return !room.isPrivate || isInvited;
    } catch (error) {
      console.error('Authorization check failed:', error);
      return false;
    }
  }

  @SubscribeMessage(ACTIONS.JOIN)
  async handleJoin(
    @ConnectedSocket() socket: Socket,
    @MessageBody()
    payload: {
      id: string;
      userName: string;
      userId: string;
      avatarUrl?: string;
    },
  ): Promise<void> {
    const { id, userName, userId, avatarUrl = '' } = payload;

    // Check if user is authorized to join the room
    const isAuthorized = await this.isUserAuthorized(id, userId);
    if (!isAuthorized) {
      socket.emit(ACTIONS.ERROR, {
        message: 'You are not authorized to join this room',
      });
      return;
    }

    // Store user info before joining
    this.userSocketMap[socket.id] = { userName, userId, avatarUrl };

    // Join the room
    await socket.join(id);

    // Load code from database if not in memory
    if (!this.codeMap[id]) {
      try {
        const room = await this.roomService.findOne(id);
        if (room) {
          this.codeMap[id] = {
            code: '', // Add a code field to Room entity to store this
            language: room.lastLanguage || 'typescript',
            lastUpdated: new Date(),
          };
        }
      } catch (error) {
        console.error(`Failed to load code for room ${id}:`, error);
      }
    }

    // Get updated list of all clients in the room
    const clients = this.getAllConnectedClients(id);

    // Broadcast to all clients in the room (including sender)
    this.server.to(id).emit(ACTIONS.JOINED, {
      clients,
      userName,
      userId,
      socketId: socket.id,
      code: this.codeMap[id]?.code || '',
      language: this.codeMap[id]?.language || 'typescript',
    });
  }

  @SubscribeMessage(ACTIONS.LEAVE)
  async handleLeave(
    @ConnectedSocket() socket: Socket,
    @MessageBody()
    payload: {
      id: string;
      userName: string;
      userId: string;
      avatarUrl?: string;
    },
  ): Promise<void> {
    const { id } = payload;
    console.log('od: ', id);
    // Save code state before leaving
    await this.saveCodeStateForRoom(id);

    // Leave the room
    await socket.leave(id);
  }

  private async saveCodeStateForRoom(roomId: string): Promise<void> {
    if (this.codeMap[roomId]) {
      try {
        const room = await this.roomService.findOne(roomId);
        if (room) {
          const updateDto: UpdateRoomDto = {
            lastLanguage: this.codeMap[roomId].language,
            // Add code field to your Room entity and UpdateRoomDto
          };
          await this.roomService.update(roomId, updateDto);
        }
      } catch (error) {
        console.error(`Failed to save code state for room ${roomId}:`, error);
      }
    }
  }

  @SubscribeMessage(ACTIONS.TYPING)
  handleTyping(
    @ConnectedSocket() socket: Socket,
    @MessageBody()
    payload: {
      id: string;
      userId: string;
    },
  ): void {
    const { id, userId } = payload;
    const socketUser = this.userSocketMap[socket.id];

    if (!socketUser) return;

    // Broadcast to all clients in the room (including sender)
    this.server.to(id).emit(ACTIONS.SOMEONE_TYPING, {
      userName: socketUser.userName,
      userId: userId,
    });
  }

  @SubscribeMessage(ACTIONS.CODE_CHANGE)
  handleCodeChange(
    @ConnectedSocket() socket: Socket,
    @MessageBody()
    payload: { id: string; code: string; language?: string },
  ): void {
    const { id, code, language } = payload;

    if (!this.codeMap[id]) {
      this.codeMap[id] = {
        code: '',
        language: 'typescript',
        lastUpdated: new Date(),
      };
    }

    if (code === undefined) {
      socket.to(id).emit(ACTIONS.SYNC_CODE, {
        code: this.codeMap[id].code,
        language: this.codeMap[id].language,
      });
    } else {
      this.codeMap[id] = {
        code,
        language: language || this.codeMap[id].language,
        lastUpdated: new Date(),
      };

      socket.to(id).emit(ACTIONS.SYNC_CODE, {
        code,
        language: this.codeMap[id].language,
      });

      // Periodically save code (every 30 seconds of inactivity)
      this.debounceCodeSave(id);
    }
  }

  @SubscribeMessage(ACTIONS.LANGUAGE_CHANGE)
  handleLanguageChange(
    @ConnectedSocket() socket: Socket,
    @MessageBody() payload: { id: string; language: string },
  ): void {
    const { id, language } = payload;

    if (!this.codeMap[id]) {
      this.codeMap[id] = {
        code: '',
        language: 'typescript',
        lastUpdated: new Date(),
      };
    }

    this.codeMap[id].language = language;

    socket.to(id).emit(ACTIONS.LANGUAGE_CHANGE_HANDLE, {
      language,
    });
  }

  private debounceTimers: { [roomId: string]: NodeJS.Timeout } = {};

  private debounceCodeSave(roomId: string): void {
    // Clear existing timer
    if (this.debounceTimers[roomId]) {
      clearTimeout(this.debounceTimers[roomId]);
    }

    // Set new timer
    this.debounceTimers[roomId] = setTimeout(async () => {
      await this.saveCodeStateForRoom(roomId);
    }, 30000); // 30 seconds
  }
}
