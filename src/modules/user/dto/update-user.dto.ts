import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Gender } from '../entities/user.entity';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsUUID()
  @ApiProperty({ description: 'The unique identifier of the user' })
  id: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: 'The GitHub username of the user' })
  githubUsername?: string;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({ description: 'The GitHub ID of the user' })
  githubId?: number;

  @IsEmail()
  @IsOptional()
  @ApiPropertyOptional({ description: 'The email of the user' })
  email?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: 'The GitHub link of the user' })
  githubLink?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: 'The name of the user' })
  name?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: 'The bio of the user' })
  bio?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: 'The avatar URL of the user' })
  avatarUrl?: string;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({ description: 'The number of followers of the user' })
  followers?: number;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({ description: 'The number of following of the user' })
  following?: number;

  @IsEnum(Gender)
  @IsOptional()
  @ApiPropertyOptional({ description: 'The gender of the user' })
  gender?: Gender;
}
