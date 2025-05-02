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
    const invitedUsers = await Promise.allSettled(
      createRoomDto.invitedUsers.map(async uuid =>
        this.userRepository.findOne({ where: { id: uuid } }),
      ),
    );

    const validUsers = invitedUsers.filter(user => user.status === 'fulfilled');

    const room = this.roomRepository.create({
      ...createRoomDto,
      invitedUsers: validUsers.map(user => user.value),
    });

    return this.roomRepository.save(room);
  }

  findAll(_query: GetRoomsDto): Promise<Room[]> {
    return this.roomRepository.find();
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

    const invitedUsers = updateRoomDtoWithoutId.invitedUsers
      ? await Promise.all(
          updateRoomDtoWithoutId.invitedUsers.map(async uuid =>
            this.userRepository.findOne({ where: { id: uuid } }),
          ),
        )
      : undefined;

    return this.roomRepository.update(id, {
      ...updateRoomDtoWithoutId,
      invitedUsers: invitedUsers
        ? invitedUsers.filter(user => user !== undefined)
        : undefined,
    });
  }

  remove(id: string): Promise<DeleteResult> {
    return this.roomRepository.softDelete(id);
  }
}
