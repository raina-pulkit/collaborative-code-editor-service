import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from 'modules/room/entities/room.entity';
import { RoomModule } from 'modules/room/room.module';
import { RoomService } from 'modules/room/room.service';
import { User } from 'modules/user/entities/user.entity';
import { SocketGateway } from './socket.gateway';

@Module({
  providers: [SocketGateway, RoomService],
  exports: [SocketGateway],
  imports: [RoomModule, TypeOrmModule.forFeature([Room, User])],
})
export class SocketModule {}
