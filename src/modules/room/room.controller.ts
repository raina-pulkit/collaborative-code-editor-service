import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { JWTGuard } from 'modules/github-auth/auth.guard';
import { DeleteResult, UpdateResult } from 'typeorm';
import { CreateRoomDto } from './dto/create-room.dto';
import { GetRoomsDto } from './dto/get-rooms-dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Room } from './entities/room.entity';
import { RoomService } from './room.service';

@Controller('v1/room')
@UseGuards(JWTGuard)
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  @ApiOkResponse({ description: 'Successfully created a new room', type: Room })
  @ApiOperation({ summary: 'Create a new room' })
  create(@Body() createRoomDto: CreateRoomDto): Promise<Room> {
    return this.roomService.create(createRoomDto);
  }

  @Get()
  @ApiOkResponse({
    description: 'Successfully fetched all rooms',
    type: [Room],
  })
  @ApiOperation({ summary: 'Get all rooms' })
  findAll(@Query() query: GetRoomsDto): Promise<Room[]> {
    return this.roomService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Room> {
    return this.roomService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateRoomDto: UpdateRoomDto,
  ): Promise<UpdateResult> {
    return this.roomService.update(id, updateRoomDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<DeleteResult> {
    return this.roomService.remove(id);
  }
}
