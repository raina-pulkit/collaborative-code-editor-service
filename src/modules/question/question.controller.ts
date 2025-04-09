import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import questionsData from './data/questions.json';
import { Question } from './entities/question.entity';
import { CreateQuestionDto } from './question.dto';
import { QuestionService } from './question.service';

@Controller('questions')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post()
  @ApiOkResponse({
    description: 'Successfully created question',
    type: Question,
  })
  @ApiOperation({ summary: 'Create a new question' })
  async create(@Body() dto: CreateQuestionDto): Promise<Question> {
    dto.isCustom = true;
    return this.questionService.createQuestion(dto);
  }

  @Get()
  @ApiOkResponse({
    description: 'Successfully fetched all questions',
    type: [Question],
  })
  @ApiOperation({ summary: 'Get all questions' })
  async getAll(): Promise<Question[]> {
    return this.questionService.getAllQuestions();
  }

  @Post('import-defaults')
  @ApiOkResponse({
    description: 'Successfully imported default questions',
    type: [Question],
  })
  @ApiOperation({ summary: 'Import default questions' })
  async importDefaults(): Promise<Question[]> {
    try {
      const validDifficulties = ['easy', 'medium', 'hard'] as const;

      const formattedData: CreateQuestionDto[] = questionsData.map(q => {
        if (!validDifficulties.includes(q.difficulty as any)) {
          throw new Error(`Invalid difficulty: ${q.difficulty}`);
        }

        return {
          title: q.title,
          description: q.description,
          difficulty: q.difficulty as 'easy' | 'medium' | 'hard',
          isCustom: false,
        };
      });

      return await this.questionService.bulkCreateQuestions(formattedData);
    } catch (error) {
      // throw new InternalServerErrorException(error.message || 'Unexpected error occurred');
      console.error('Error importing default questions:', error);
    }
  }
}
