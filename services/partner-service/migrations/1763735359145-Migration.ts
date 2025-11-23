import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1763735359145 implements MigrationInterface {
    name = 'Migration1763735359145'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "partner"."shop_working_hours" ("uid" uuid NOT NULL DEFAULT uuid_generate_v4(), "day_of_week" smallint NOT NULL, "start_time" TIME NOT NULL, "end_time" TIME NOT NULL, "slot_order" smallint NOT NULL DEFAULT '0', "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "shop_uid" uuid, CONSTRAINT "PK_2d1475696e1d3d4615545b8e55c" PRIMARY KEY ("uid"))`);
        await queryRunner.query(`CREATE INDEX "IDX_7a6be35cba832215e1bcb61b53" ON "partner"."shop_working_hours" ("shop_uid") `);
        await queryRunner.query(`CREATE INDEX "IDX_c7a72b932070b0a25df50b0a48" ON "partner"."shop_working_hours" ("day_of_week") `);
        await queryRunner.query(`CREATE TABLE "partner"."shop_special_hours" ("uid" uuid NOT NULL DEFAULT uuid_generate_v4(), "special_date" date NOT NULL, "is_recurring_annual" boolean NOT NULL DEFAULT false, "start_time" TIME, "end_time" TIME, "slot_order" smallint NOT NULL DEFAULT '0', "is_closed" boolean NOT NULL DEFAULT false, "description" character varying(255), "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "shop_uid" uuid, CONSTRAINT "PK_37a2df8bbf0cc240ad4017e49db" PRIMARY KEY ("uid"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a823d218bac85ae60108761b96" ON "partner"."shop_special_hours" ("shop_uid") `);
        await queryRunner.query(`CREATE INDEX "IDX_57a30cc421a6f008a677b1f6bf" ON "partner"."shop_special_hours" ("special_date") `);
        await queryRunner.query(`ALTER TABLE "partner"."shop_working_hours" ADD CONSTRAINT "FK_7a6be35cba832215e1bcb61b537" FOREIGN KEY ("shop_uid") REFERENCES "partner"."shops"("uid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "partner"."shop_special_hours" ADD CONSTRAINT "FK_a823d218bac85ae60108761b96e" FOREIGN KEY ("shop_uid") REFERENCES "partner"."shops"("uid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "partner"."shop_special_hours" DROP CONSTRAINT "FK_a823d218bac85ae60108761b96e"`);
        await queryRunner.query(`ALTER TABLE "partner"."shop_working_hours" DROP CONSTRAINT "FK_7a6be35cba832215e1bcb61b537"`);
        await queryRunner.query(`DROP INDEX "partner"."IDX_57a30cc421a6f008a677b1f6bf"`);
        await queryRunner.query(`DROP INDEX "partner"."IDX_a823d218bac85ae60108761b96"`);
        await queryRunner.query(`DROP TABLE "partner"."shop_special_hours"`);
        await queryRunner.query(`DROP INDEX "partner"."IDX_c7a72b932070b0a25df50b0a48"`);
        await queryRunner.query(`DROP INDEX "partner"."IDX_7a6be35cba832215e1bcb61b53"`);
        await queryRunner.query(`DROP TABLE "partner"."shop_working_hours"`);
    }

}
