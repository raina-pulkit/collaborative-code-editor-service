import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
  NULL = '',
}

@Entity({ schema: 'public', name: 'user' })
export class User {
  constructor(notes?: Partial<User>) {
    Object.assign(this, notes || {});
  }

  @IsUUID()
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'The unique identifier of the user' })
  id: string;

  @IsString()
  @Column({ type: 'text', nullable: false, unique: true })
  @ApiProperty({ description: 'The GitHub username of the user' })
  githubUsername: string;

  @IsNumber()
  @Column({ type: 'bigint', nullable: false, unique: true })
  @ApiProperty({ description: 'The github ID of the user' })
  githubId: number;

  @IsEmail()
  @IsOptional()
  @Column({ type: 'varchar', nullable: true, unique: true })
  @ApiProperty({ description: 'The email of the user' })
  email?: string;

  @IsString()
  @Column({ type: 'varchar', nullable: false, unique: true })
  @ApiProperty({ description: 'The GitHub link of the user' })
  githubLink: string;

  @IsString()
  @Column({ type: 'varchar', nullable: true })
  @ApiPropertyOptional({ description: 'The name of the user' })
  name?: string;

  @IsString()
  @IsOptional()
  @Column({ nullable: true, type: 'text' })
  @ApiProperty({ description: 'The bio of the user' })
  bio?: string;

  @IsEnum(Gender)
  @Column({ type: 'enum', enum: Gender, nullable: true, default: Gender.NULL })
  @ApiProperty({ description: 'The gender of the user' })
  gender?: Gender;

  @IsString()
  @IsOptional()
  @Column({ nullable: true, type: 'varchar' })
  @ApiProperty({ description: 'The avatar URL of the user' })
  avatarUrl?: string;

  @IsNumber()
  @Column({ type: 'integer', nullable: false, default: 0 })
  @ApiProperty({ description: 'The number of followers of the user' })
  followers: number;

  @IsNumber()
  @Column({ type: 'integer', nullable: false, default: 0 })
  @ApiProperty({ description: 'The number of following of the user' })
  following: number;

  @IsDate()
  @CreateDateColumn({ type: 'timestamptz', nullable: false })
  @ApiProperty({ description: 'The date and time the user was created' })
  createdAt: Date;

  @IsDate()
  @UpdateDateColumn({ type: 'timestamptz', nullable: false })
  @ApiProperty({ description: 'The date and time the user was updated' })
  updatedAt: Date;

  @IsDate()
  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  @ApiProperty({ description: 'The date and time the user was deleted' })
  deletedAt?: Date;
}
