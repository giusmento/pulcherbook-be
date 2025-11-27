import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1763901554740 implements MigrationInterface {
    name = 'Migration1763901554740'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "partner"."team_members" DROP CONSTRAINT "FK_fdad7d5768277e60c40e01cdcea"`);
        await queryRunner.query(`ALTER TABLE "partner"."appointments" DROP CONSTRAINT "FK_a266a9419146968ef411f0fedb5"`);
        await queryRunner.query(`ALTER TABLE "partner"."team_member_availability" DROP CONSTRAINT "FK_7d14fea718d12f302b8e9c6fb20"`);
        await queryRunner.query(`DROP INDEX "partner"."IDX_fdad7d5768277e60c40e01cdce"`);
        await queryRunner.query(`DROP INDEX "partner"."IDX_c2bf4967c8c2a6b845dadfbf3d"`);
        await queryRunner.query(`ALTER TABLE "partner"."team_members" DROP CONSTRAINT "UQ_1d3c06a8217a8785e2af0ec4ab8"`);
        await queryRunner.query(`CREATE TABLE "partner"."team_members_teams" ("teamMembersUid" uuid NOT NULL, "teamsUid" uuid NOT NULL, CONSTRAINT "PK_5dfaccc56c8d83e5ebf8f20c2c0" PRIMARY KEY ("teamMembersUid", "teamsUid"))`);
        await queryRunner.query(`CREATE INDEX "IDX_92ab1dc653219e5a877a470b63" ON "partner"."team_members_teams" ("teamMembersUid") `);
        await queryRunner.query(`CREATE INDEX "IDX_687ece723c3b690ae4657e4ab0" ON "partner"."team_members_teams" ("teamsUid") `);
        await queryRunner.query(`ALTER TABLE "partner"."team_members" DROP COLUMN "team_id"`);
        await queryRunner.query(`ALTER TABLE "partner"."team_members" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "partner"."team_members" DROP COLUMN "role"`);
        await queryRunner.query(`ALTER TABLE "partner"."team_members" ADD "external_uid" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "partner"."team_members" ADD "partner_uid" uuid`);
        await queryRunner.query(`ALTER TABLE "partner"."teams" ALTER COLUMN "tags" SET DEFAULT ARRAY[]::text[]`);
        await queryRunner.query(`CREATE INDEX "IDX_4e4101aaa883cca8b9c552051a" ON "partner"."team_members" ("external_uid") `);
        await queryRunner.query(`ALTER TABLE "partner"."team_members" ADD CONSTRAINT "FK_eab8da331215ef47afe5078d25a" FOREIGN KEY ("partner_uid") REFERENCES "partner"."partners"("uid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "partner"."team_members_teams" ADD CONSTRAINT "FK_92ab1dc653219e5a877a470b633" FOREIGN KEY ("teamMembersUid") REFERENCES "partner"."team_members"("uid") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "partner"."team_members_teams" ADD CONSTRAINT "FK_687ece723c3b690ae4657e4ab02" FOREIGN KEY ("teamsUid") REFERENCES "partner"."teams"("uid") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "partner"."team_members_teams" DROP CONSTRAINT "FK_687ece723c3b690ae4657e4ab02"`);
        await queryRunner.query(`ALTER TABLE "partner"."team_members_teams" DROP CONSTRAINT "FK_92ab1dc653219e5a877a470b633"`);
        await queryRunner.query(`ALTER TABLE "partner"."team_members" DROP CONSTRAINT "FK_eab8da331215ef47afe5078d25a"`);
        await queryRunner.query(`DROP INDEX "partner"."IDX_4e4101aaa883cca8b9c552051a"`);
        await queryRunner.query(`ALTER TABLE "partner"."teams" ALTER COLUMN "tags" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "partner"."team_members" DROP COLUMN "partner_uid"`);
        await queryRunner.query(`ALTER TABLE "partner"."team_members" DROP COLUMN "external_uid"`);
        await queryRunner.query(`ALTER TABLE "partner"."team_members" ADD "role" character varying(50) NOT NULL DEFAULT 'member'`);
        await queryRunner.query(`ALTER TABLE "partner"."team_members" ADD "user_id" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "partner"."team_members" ADD "team_id" uuid NOT NULL`);
        await queryRunner.query(`DROP INDEX "partner"."IDX_687ece723c3b690ae4657e4ab0"`);
        await queryRunner.query(`DROP INDEX "partner"."IDX_92ab1dc653219e5a877a470b63"`);
        await queryRunner.query(`DROP TABLE "partner"."team_members_teams"`);
        await queryRunner.query(`ALTER TABLE "partner"."team_members" ADD CONSTRAINT "UQ_1d3c06a8217a8785e2af0ec4ab8" UNIQUE ("team_id", "user_id")`);
        await queryRunner.query(`CREATE INDEX "IDX_c2bf4967c8c2a6b845dadfbf3d" ON "partner"."team_members" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_fdad7d5768277e60c40e01cdce" ON "partner"."team_members" ("team_id") `);
        await queryRunner.query(`ALTER TABLE "partner"."team_member_availability" ADD CONSTRAINT "FK_7d14fea718d12f302b8e9c6fb20" FOREIGN KEY ("team_member_id") REFERENCES "partner"."team_members"("uid") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "partner"."appointments" ADD CONSTRAINT "FK_a266a9419146968ef411f0fedb5" FOREIGN KEY ("team_member_id") REFERENCES "partner"."team_members"("uid") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "partner"."team_members" ADD CONSTRAINT "FK_fdad7d5768277e60c40e01cdcea" FOREIGN KEY ("team_id") REFERENCES "partner"."teams"("uid") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
