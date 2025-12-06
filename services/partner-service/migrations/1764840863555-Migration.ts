import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1764840863555 implements MigrationInterface {
    name = 'Migration1764840863555'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "partner"."offering_categories" ("uid" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "description" text, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_6dafe7e5f146a5654a6c639b8d4" PRIMARY KEY ("uid"))`);
        await queryRunner.query(`ALTER TABLE "partner"."offerings" ADD "category_uid" uuid`);
        await queryRunner.query(`ALTER TABLE "partner"."teams" ALTER COLUMN "tags" SET DEFAULT ARRAY[]::text[]`);
        await queryRunner.query(`CREATE INDEX "IDX_6e1f5fe25c8d14c77cae48d222" ON "partner"."offerings" ("category_uid") `);
        await queryRunner.query(`ALTER TABLE "partner"."offerings" ADD CONSTRAINT "FK_6e1f5fe25c8d14c77cae48d2221" FOREIGN KEY ("category_uid") REFERENCES "partner"."offering_categories"("uid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "partner"."offerings" DROP CONSTRAINT "FK_6e1f5fe25c8d14c77cae48d2221"`);
        await queryRunner.query(`DROP INDEX "partner"."IDX_6e1f5fe25c8d14c77cae48d222"`);
        await queryRunner.query(`ALTER TABLE "partner"."teams" ALTER COLUMN "tags" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "partner"."offerings" DROP COLUMN "category_uid"`);
        await queryRunner.query(`DROP TABLE "partner"."offering_categories"`);
    }

}
