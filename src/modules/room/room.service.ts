import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'modules/user/entities/user.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateRoomDto } from './dto/create-room.dto';
import { GetRoomsDto } from './dto/get-rooms-dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Room } from './entities/room.entity';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createRoomDto: CreateRoomDto): Promise<Room> {
    const invitedUsers = await Promise.all(
      createRoomDto.invitedUsers.map(async uuid =>
        this.userRepository.findOne({ where: { id: uuid } }),
      ),
    );
    const room = this.roomRepository.create({
      ...createRoomDto,
      invitedUsers: invitedUsers.filter(user => user !== undefined),
    });

    return this.roomRepository.save(room);
  }

  findAll(query: GetRoomsDto): Promise<Room[]> {
    const queryBuilder = this.roomRepository.createQueryBuilder('room');
    if (query.ownerUuids) {
      queryBuilder.where('room.owner.id IN (:...ownerUuids)', {
        ownerUuids: query.ownerUuids,
      });
    }
    if (query.roomId) {
      queryBuilder.andWhere('room.id = :roomId', { roomId: query.roomId });
    }
    if (query.invitedUserUuids) {
      queryBuilder.andWhere('room.invitedUsers.id IN (:...invitedUserUuids)', {
        invitedUserUuids: query.invitedUserUuids,
      });
    }

    return queryBuilder.getMany();
  }

  findOne(id: string): Promise<Room> {
    return this.roomRepository.findOne({ where: { id } });
  }

  async update(
    id: string,
    updateRoomDto: UpdateRoomDto,
  ): Promise<UpdateResult> {
    const updateRoomDtoWithoutId = { ...updateRoomDto };
    delete updateRoomDtoWithoutId.id;

    const invitedUsers = await Promise.all(
      updateRoomDtoWithoutId.invitedUsers.map(async uuid =>
        this.userRepository.findOne({ where: { id: uuid } }),
      ),
    );

    return this.roomRepository.update(id, {
      ...updateRoomDtoWithoutId,
      invitedUsers: invitedUsers.filter(user => user !== undefined),
    });
  }

  remove(id: string): Promise<DeleteResult> {
    return this.roomRepository.softDelete(id);
  }
}
