import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsUUID } from 'class-validator';
import { User } from 'modules/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ schema: 'public', name: 'room' })
export class Room {
  constructor(room?: Partial<Room>) {
    Object.assign(this, room || {});
  }

  @IsUUID()
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: `Room's uuid` })
  id: string;

  @Column({ type: 'uuid', nullable: false })
  @ApiProperty({ description: `Room owner's uuid` })
  ownerUuid: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'ownerId' })
  @ApiProperty({ description: `Room owner` })
  owner: User;

  @IsBoolean()
  @Column({ type: 'boolean', nullable: false, default: false })
  @ApiProperty({ description: `Room's privacy` })
  isPrivate: boolean;

  @ManyToMany(() => User)
  @JoinTable({
    name: 'room_invited_user',
    joinColumn: { name: 'roomId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'userId', referencedColumnName: 'id' },
  })
  @ApiProperty({ description: 'Array of users invited to the room' })
  invitedUsers: User[];

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
