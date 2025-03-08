import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Gender } from '../entities/user.entity';

export class CreateUserDto {
  @IsString()
  @ApiProperty({ description: 'The GitHub username of the user' })
  githubUsername: string;

  @IsEmail()
  @IsOptional()
  @ApiProperty({ description: 'The email of the user' })
  email?: string;

  @IsNumber()
  @ApiProperty({ description: 'The github ID of the user' })
  githubId: number;

  @IsString()
  @ApiProperty({ description: 'The GitHub link of the user' })
  githubLink: string;

  @IsString()
  @ApiProperty({ description: 'The name of the user' })
  name: string;

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
  @ApiProperty({
    description: 'The number of followers of the user',
    default: 0,
  })
  followers: number = 0;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'The number of following of the user',
    default: 0,
  })
  following: number = 0;

  @IsEnum(Gender)
  @IsOptional()
  @ApiPropertyOptional({ description: 'The gender of the user' })
  gender?: Gender;
}
