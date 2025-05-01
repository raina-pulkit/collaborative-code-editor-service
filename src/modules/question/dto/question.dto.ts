import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum DifficultyEnum {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

export class CreateQuestionDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsEnum(DifficultyEnum, {
    message: 'difficulty must be one of: easy, medium, hard',
  })
  difficulty: DifficultyEnum;

  @IsOptional()
  isCustom?: boolean;
}
