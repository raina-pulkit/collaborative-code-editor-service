import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1746134895987 implements MigrationInterface {
  name = 'Migrations1746134895987';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."user_gender_enum" AS ENUM('male', 'female', 'other', '')`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "github_username" text NOT NULL, "github_id" bigint NOT NULL, "email" character varying, "github_link" character varying NOT NULL, "name" character varying, "bio" text, "gender" "public"."user_gender_enum" DEFAULT '', "avatar_url" character varying, "followers" integer NOT NULL DEFAULT '0', "following" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_07eccd596501ea0b6b1805a2f13" UNIQUE ("github_username"), CONSTRAINT "UQ_45bb0502759f0dd73c4fd8b13bd" UNIQUE ("github_id"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_069358ce809a17a656ed9104bf9" UNIQUE ("github_link"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "room" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "owner_uuid" uuid NOT NULL, "is_private" boolean NOT NULL DEFAULT false, "last_language" text DEFAULT 'typescript', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "ownerId" uuid, CONSTRAINT "PK_c6d46db005d623e691b2fbcba23" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."question_difficulty_enum" AS ENUM('easy', 'medium', 'hard')`,
    );
    await queryRunner.query(
      `CREATE TABLE "question" ("id" SERIAL NOT NULL, "title" text NOT NULL, "description" text NOT NULL, "difficulty" "public"."question_difficulty_enum" NOT NULL, "is_custom" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_21e5786aa0ea704ae185a79b2d5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "room_invited_user" ("roomId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_1de4ace7739557623bab523a6c5" PRIMARY KEY ("roomId", "userId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6c2a8ddc7113e403d90eb23dde" ON "room_invited_user" ("roomId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_dfe34bc49913fed2aa1473b831" ON "room_invited_user" ("userId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "room" ADD CONSTRAINT "FK_65283be59094a73fed31ffeee4e" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "room_invited_user" ADD CONSTRAINT "FK_6c2a8ddc7113e403d90eb23ddec" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "room_invited_user" ADD CONSTRAINT "FK_dfe34bc49913fed2aa1473b8315" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "room_invited_user" DROP CONSTRAINT "FK_dfe34bc49913fed2aa1473b8315"`,
    );
    await queryRunner.query(
      `ALTER TABLE "room_invited_user" DROP CONSTRAINT "FK_6c2a8ddc7113e403d90eb23ddec"`,
    );
    await queryRunner.query(
      `ALTER TABLE "room" DROP CONSTRAINT "FK_65283be59094a73fed31ffeee4e"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_dfe34bc49913fed2aa1473b831"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6c2a8ddc7113e403d90eb23dde"`,
    );
    await queryRunner.query(`DROP TABLE "room_invited_user"`);
    await queryRunner.query(`DROP TABLE "question"`);
    await queryRunner.query(`DROP TYPE "public"."question_difficulty_enum"`);
    await queryRunner.query(`DROP TABLE "room"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TYPE "public"."user_gender_enum"`);
  }
}
