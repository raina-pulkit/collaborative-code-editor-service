import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ schema: 'public', name: 'question' })
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
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
