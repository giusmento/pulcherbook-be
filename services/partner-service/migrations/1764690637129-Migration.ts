import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1764690637129 implements MigrationInterface {
    name = 'Migration1764690637129'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "partner"."offerings_shops" ("offeringsUid" uuid NOT NULL, "shopsUid" uuid NOT NULL, CONSTRAINT "PK_08db05731ca1d684647c7ab5e38" PRIMARY KEY ("offeringsUid", "shopsUid"))`);
        await queryRunner.query(`CREATE INDEX "IDX_4d7b69d2bebe3a3d5ee0961fb7" ON "partner"."offerings_shops" ("offeringsUid") `);
        await queryRunner.query(`CREATE INDEX "IDX_db7359a3ebdf01fdbc38ebb3f3" ON "partner"."offerings_shops" ("shopsUid") `);
        await queryRunner.query(`CREATE TABLE "partner"."offerings_teams" ("offeringsUid" uuid NOT NULL, "teamsUid" uuid NOT NULL, CONSTRAINT "PK_49f5514fb91f0ff87e84419d45b" PRIMARY KEY ("offeringsUid", "teamsUid"))`);
        await queryRunner.query(`CREATE INDEX "IDX_7b735c811111c21434c6b04a70" ON "partner"."offerings_teams" ("offeringsUid") `);
        await queryRunner.query(`CREATE INDEX "IDX_0a610b3d39f7659d75b5b62cf1" ON "partner"."offerings_teams" ("teamsUid") `);
        await queryRunner.query(`ALTER TABLE "partner"."teams" ALTER COLUMN "tags" SET DEFAULT ARRAY[]::text[]`);
        await queryRunner.query(`ALTER TABLE "partner"."offerings_shops" ADD CONSTRAINT "FK_4d7b69d2bebe3a3d5ee0961fb7e" FOREIGN KEY ("offeringsUid") REFERENCES "partner"."offerings"("uid") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "partner"."offerings_shops" ADD CONSTRAINT "FK_db7359a3ebdf01fdbc38ebb3f3d" FOREIGN KEY ("shopsUid") REFERENCES "partner"."shops"("uid") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "partner"."offerings_teams" ADD CONSTRAINT "FK_7b735c811111c21434c6b04a70f" FOREIGN KEY ("offeringsUid") REFERENCES "partner"."offerings"("uid") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "partner"."offerings_teams" ADD CONSTRAINT "FK_0a610b3d39f7659d75b5b62cf10" FOREIGN KEY ("teamsUid") REFERENCES "partner"."teams"("uid") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "partner"."offerings_teams" DROP CONSTRAINT "FK_0a610b3d39f7659d75b5b62cf10"`);
        await queryRunner.query(`ALTER TABLE "partner"."offerings_teams" DROP CONSTRAINT "FK_7b735c811111c21434c6b04a70f"`);
        await queryRunner.query(`ALTER TABLE "partner"."offerings_shops" DROP CONSTRAINT "FK_db7359a3ebdf01fdbc38ebb3f3d"`);
        await queryRunner.query(`ALTER TABLE "partner"."offerings_shops" DROP CONSTRAINT "FK_4d7b69d2bebe3a3d5ee0961fb7e"`);
        await queryRunner.query(`ALTER TABLE "partner"."teams" ALTER COLUMN "tags" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`DROP INDEX "partner"."IDX_0a610b3d39f7659d75b5b62cf1"`);
        await queryRunner.query(`DROP INDEX "partner"."IDX_7b735c811111c21434c6b04a70"`);
        await queryRunner.query(`DROP TABLE "partner"."offerings_teams"`);
        await queryRunner.query(`DROP INDEX "partner"."IDX_db7359a3ebdf01fdbc38ebb3f3"`);
        await queryRunner.query(`DROP INDEX "partner"."IDX_4d7b69d2bebe3a3d5ee0961fb7"`);
        await queryRunner.query(`DROP TABLE "partner"."offerings_shops"`);
    }

}
