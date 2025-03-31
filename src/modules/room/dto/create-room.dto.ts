import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsUUID } from 'class-validator';

export class CreateRoomDto {
  @IsUUID()
  @ApiProperty({ description: `Room owner uuid`, nullable: false })
  ownerUuid: string;

  @IsBoolean()
  @ApiProperty({ description: `Room's privacy`, nullable: false })
  isPrivate: boolean;

  @IsArray()
  @ApiProperty({
    description: 'Array of users invited to the room',
    nullable: false,
  })
  @IsUUID(undefined, { each: true })
  invitedUsers: string[];
}
