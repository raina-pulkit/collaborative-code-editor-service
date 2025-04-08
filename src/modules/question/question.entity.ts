import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  difficulty: 'easy' | 'medium' | 'hard';

  @Column({ default: false })
  isCustom: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
