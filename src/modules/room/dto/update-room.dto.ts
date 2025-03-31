import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsOptional, IsUUID } from 'class-validator';
import { CreateRoomDto } from './create-room.dto';

export class UpdateRoomDto extends PartialType(CreateRoomDto) {
  @IsUUID()
  @IsOptional()
  @ApiProperty({ description: `Room owner uuid`, nullable: true })
  ownerUuid?: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ description: `Room's privacy`, nullable: true })
  isPrivate?: boolean;

  @IsArray()
  @ApiProperty({
    description: 'Array of users invited to the room',
    nullable: true,
  })
  @IsUUID(undefined, { each: true })
  invitedUsers?: string[];
}
