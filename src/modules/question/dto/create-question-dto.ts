import { IsEnum, IsOptional, IsString } from 'class-validator';
import { DifficultyEnum } from '../entities/question.entity';

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
