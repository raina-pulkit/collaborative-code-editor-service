import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum DifficultyEnum {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

@Entity({ schema: 'public', name: 'question' })
export class Question {
  constructor(question?: Partial<Question>) {
    Object.assign(this, question || {});
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'enum', enum: DifficultyEnum })
  difficulty: DifficultyEnum;

  @Column({ default: false })
  isCustom: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
