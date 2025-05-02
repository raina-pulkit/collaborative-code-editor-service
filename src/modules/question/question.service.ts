import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateQuestionDto } from './dto/question.dto';
import { Question } from './entities/question.entity';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private questionRepo: Repository<Question>,
  ) {}

  async createQuestion(dto: CreateQuestionDto): Promise<{ data: Question }> {
    if (!dto.title) {
      throw new BadRequestException('Title is required');
    }
    if (!dto.description) {
      throw new BadRequestException('Description is required');
    }
    if (!dto.difficulty) {
      throw new BadRequestException('Difficulty is required');
    }

    const question = this.questionRepo.create({
      ...dto,
      isCustom: dto.isCustom ?? false,
    });

    const savedQuestion = await this.questionRepo.save(question);
    return { data: savedQuestion };
  }

  async getAllQuestions(): Promise<{ data: Question[] }> {
    const questions = await this.questionRepo.find({
      order: { createdAt: 'DESC' },
    });

    return { data: questions };
  }
}
