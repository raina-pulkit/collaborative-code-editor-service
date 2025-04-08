import { Controller, Post, Body, Get } from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './question.dto';
import { Question } from './question.entity';
import questionsData from './data/questions.json';

@Controller('questions')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post()
  async create(@Body() dto: CreateQuestionDto): Promise<Question> {
    dto.isCustom = true;
    return this.questionService.createQuestion(dto);
  }

  @Get()
  async getAll(): Promise<Question[]> {
    return this.questionService.getAllQuestions();
  }

  @Post('import-defaults')
importDefaults() {
  const validDifficulties = ['easy', 'medium', 'hard'] as const;

  const formattedData: CreateQuestionDto[] = questionsData.map((q) => {
    if (!validDifficulties.includes(q.difficulty as any)) {
      throw new Error(`Invalid difficulty: ${q.difficulty}`);
    }

    return {
      title: q.title,
      description: q.description,
      difficulty: q.difficulty as 'easy' | 'medium' | 'hard',
      isCustom: false, // optional, but being explicit can help with filtering later
    };
  });

  return this.questionService.bulkCreateQuestions(formattedData);
}
}
  

