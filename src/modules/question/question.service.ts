import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from './entities/question.entity';
import { CreateQuestionDto } from './question.dto';

const allowedDifficulties = ['easy', 'medium', 'hard'] as const;

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private questionRepo: Repository<Question>,
  ) {}

  async createQuestion(dto: CreateQuestionDto): Promise<Question> {
    const question = this.questionRepo.create({
      ...dto,
      isCustom: dto.isCustom ?? false,
    });
    return this.questionRepo.save(question);
  }

  async getAllQuestions(): Promise<Question[]> {
    return this.questionRepo.find({ order: { createdAt: 'DESC' } });
  }

  async bulkCreateQuestions(rawData: any[]): Promise<Question[]> {
    const validatedData: CreateQuestionDto[] = rawData
      .filter(q => allowedDifficulties.includes(q.difficulty))
      .map(q => ({
        title: q.title,
        description: q.description,
        difficulty: q.difficulty as 'easy' | 'medium' | 'hard',
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
