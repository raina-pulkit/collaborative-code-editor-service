import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsUUID } from 'class-validator';

export class GetRoomsDto {
  @IsOptional()
  @IsArray()
  @IsUUID(undefined, { each: true })
  @ApiProperty({
    description: 'Filter rooms by owner UUIDs',
    required: false,
    type: [String],
    isArray: true,
  })
  ownerUuids?: string[];

  @IsOptional()
  @IsUUID()
  @ApiProperty({
    description: 'Filter by specific room ID',
    required: false,
  })
  roomId?: string;

  @IsOptional()
  @IsArray()
  @IsUUID(undefined, { each: true })
  @ApiProperty({
    description: 'Filter rooms by invited user UUIDs',
    required: false,
    type: [String],
    isArray: true,
  })
  invitedUserUuids?: string[];
}
