import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1743416042005 implements MigrationInterface {
  name = 'Migrations1743416042005';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."users_gender_enum" AS ENUM('male', 'female', 'other', '')`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "github_username" text NOT NULL, "github_id" bigint NOT NULL, "email" character varying, "github_link" character varying NOT NULL, "name" character varying, "bio" text, "gender" "public"."users_gender_enum" DEFAULT '', "avatar_url" character varying, "followers" integer NOT NULL DEFAULT '0', "following" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_69fceff61639c5014e2c6b7306e" UNIQUE ("github_username"), CONSTRAINT "UQ_09a2296ade1053a0cc4080bda4a" UNIQUE ("github_id"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_a355382bb3c677f13ff7849d87e" UNIQUE ("github_link"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "rooms" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "owner_id" uuid NOT NULL, "is_private" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "ownerId" uuid, CONSTRAINT "PK_0368a2d7c215f2d0458a54933f2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "room_invited_users" ("roomId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_76ddf63b5565bae1844aadc987d" PRIMARY KEY ("roomId", "userId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_dbd4b18252514912cefb0d3784" ON "room_invited_users" ("roomId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7304efcca25ddd103ebd48dbe9" ON "room_invited_users" ("userId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "rooms" ADD CONSTRAINT "FK_383ac461c63dd52c22ba73a6624" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "room_invited_users" ADD CONSTRAINT "FK_dbd4b18252514912cefb0d37840" FOREIGN KEY ("roomId") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "room_invited_users" ADD CONSTRAINT "FK_7304efcca25ddd103ebd48dbe97" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "room_invited_users" DROP CONSTRAINT "FK_7304efcca25ddd103ebd48dbe97"`,
    );
    await queryRunner.query(
      `ALTER TABLE "room_invited_users" DROP CONSTRAINT "FK_dbd4b18252514912cefb0d37840"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rooms" DROP CONSTRAINT "FK_383ac461c63dd52c22ba73a6624"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7304efcca25ddd103ebd48dbe9"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_dbd4b18252514912cefb0d3784"`,
    );
    await queryRunner.query(`DROP TABLE "room_invited_users"`);
    await queryRunner.query(`DROP TABLE "rooms"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_gender_enum"`);
  }
}
