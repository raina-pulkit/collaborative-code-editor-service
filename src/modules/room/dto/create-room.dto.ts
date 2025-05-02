import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEmail,
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

  @ApiProperty({
    description: 'Array of users invited to the room',
    nullable: false,
  })
  @IsArray()
  @IsEmail(null, { each: true })
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
