import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { JWTGuard } from 'modules/github-auth/auth.guard';
import { CreateQuestionDto } from './dto/question.dto';
import { Question } from './entities/question.entity';
import { QuestionService } from './question.service';

@Controller('questions')
@UseGuards(JWTGuard)
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post()
  @ApiOkResponse({
    description: 'Successfully created question',
    type: Question,
  })
  @ApiOperation({ summary: 'Create a new question' })
  async create(@Body() dto: CreateQuestionDto): Promise<{ data: Question }> {
    dto.isCustom = true;
    return this.questionService.createQuestion(dto);
  }

  @Get()
  @ApiOkResponse({
    description: 'Successfully fetched all questions',
    type: [Question],
  })
  @ApiOperation({ summary: 'Get all questions' })
  async getAll(): Promise<{ data: Question[] }> {
    return this.questionService.getAllQuestions();
  }
}
