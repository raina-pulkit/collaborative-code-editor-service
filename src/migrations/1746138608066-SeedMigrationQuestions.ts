import { Question } from 'modules/question/entities/question.entity';
import { seed_questions } from 'seeds/fake-questions/questions';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedMigrationQuestions1746138608066 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const questionsEntities: Partial<Question>[] = seed_questions.map(
      question => ({
        ...question,
        isCustom: false,
      }),
    );

    await queryRunner.manager.save(Question, questionsEntities);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.delete('question', {
      isCustom: false,
    });
  }
}
