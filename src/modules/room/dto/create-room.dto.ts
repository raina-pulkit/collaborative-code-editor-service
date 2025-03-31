import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateRoomDto {
  @IsUUID()
  @IsOptional()
  @ApiProperty({ description: `Room uuid`, nullable: true })
  id?: string;

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

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Room last language',
    nullable: true,
    default: 'typescript',
  })
  lastLanguage = 'typescript';
}
