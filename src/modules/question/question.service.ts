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

  async bulkCreateQuestions(rawData: any[]): Promise<Question[]> {
    const validatedData: CreateQuestionDto[] = rawData.map(q => ({
      title: q.title,
      description: q.description,
      difficulty: q.difficulty,
      isCustom: q.isCustom ?? false,
    }));

    // Get all existing question titles
    const existing = await this.questionRepo.find();
    const existingTitles = new Set(existing.map(q => q.title));

    // Filter out duplicates
    const newQuestions = validatedData.filter(
      q => !existingTitles.has(q.title),
    );

    if (newQuestions.length === 0) {
      console.log('No new questions to insert. Skipping seed.');
    } else {
      await this.questionRepo.save(newQuestions);
      console.log(`Seeded ${newQuestions.length} new questions.`);
    }

    return this.questionRepo.save(newQuestions);
  }
}
