import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1742644863218 implements MigrationInterface {
  name = 'Migrations1742644863218';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."users_gender_enum" AS ENUM('male', 'female', 'other', '')`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "github_username" text NOT NULL, "github_id" bigint NOT NULL, "email" character varying, "github_link" character varying NOT NULL, "name" character varying, "bio" text, "gender" "public"."users_gender_enum" DEFAULT '', "avatar_url" character varying, "followers" integer NOT NULL DEFAULT '0', "following" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_69fceff61639c5014e2c6b7306e" UNIQUE ("github_username"), CONSTRAINT "UQ_09a2296ade1053a0cc4080bda4a" UNIQUE ("github_id"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_a355382bb3c677f13ff7849d87e" UNIQUE ("github_link"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_gender_enum"`);
  }
}
