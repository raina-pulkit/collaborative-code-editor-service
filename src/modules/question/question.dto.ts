import { IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateQuestionDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsEnum(['easy', 'medium', 'hard'], {
    message: 'difficulty must be one of: easy, medium, hard',
  })
  difficulty: 'easy' | 'medium' | 'hard';

  @IsOptional()
  isCustom?: boolean;
}
