import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1760518588684 implements MigrationInterface {
  name = "Migration1760518588684";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "iam"."groups" ("uid" uuid NOT NULL DEFAULT uuid_generate_v4(), "userType" "iam"."groups_usertype_enum" NOT NULL, "name" character varying(255) NOT NULL, "default" boolean NOT NULL DEFAULT false, "description" character varying(255) NOT NULL, "permissions" character varying(255) NOT NULL, CONSTRAINT "PK_4163ae2a10a069a5f983e40a3f1" PRIMARY KEY ("uid"))`
    );
    await queryRunner.query(
      `CREATE TABLE "iam"."admin_users" ("id" SERIAL NOT NULL, "uid" uuid NOT NULL, "firstName" character varying(255) NOT NULL, "lastName" character varying(255), "username" character varying(255), "email" character varying(255) NOT NULL, "phoneNumber" character varying(50), "status" character varying(50) NOT NULL DEFAULT 'PENDING', "password" character varying(255), "age" integer NOT NULL DEFAULT '0', "isActive" boolean NOT NULL DEFAULT true, "isVerified" boolean NOT NULL DEFAULT false, "magicLink" character varying(500), "magicLinkExpireDate" TIMESTAMP WITH TIME ZONE, "verifiedAt" TIMESTAMP WITH TIME ZONE, "disabledAt" TIMESTAMP WITH TIME ZONE, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_c5776feed636bf4de648f76b6ac" UNIQUE ("uid"), CONSTRAINT "UQ_dcd0c8a4b10af9c986e510b9ecc" UNIQUE ("email"), CONSTRAINT "PK_06744d221bb6145dc61e5dc441d" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "iam"."partner_users" ("uid" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying(255) NOT NULL, "lastName" character varying(255), "username" character varying(255), "email" character varying(255) NOT NULL, "phoneNumber" character varying(50), "status" character varying(50) NOT NULL DEFAULT 'PENDING', "password" character varying(255), "age" integer NOT NULL DEFAULT '0', "isActive" boolean NOT NULL DEFAULT true, "isVerified" boolean NOT NULL DEFAULT false, "magicLink" character varying(500), "magicLinkExpireDate" TIMESTAMP WITH TIME ZONE, "verifiedAt" TIMESTAMP WITH TIME ZONE, "disabledAt" TIMESTAMP WITH TIME ZONE, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_bf20e5cbf1f006765b23020e871" UNIQUE ("email"), CONSTRAINT "PK_460ef9551fda426a8e00e51448f" PRIMARY KEY ("uid"))`
    );
    await queryRunner.query(
      `CREATE TABLE "iam"."users" ("uid" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying(255) NOT NULL, "lastName" character varying(255), "email" character varying(255) NOT NULL, "phoneNumber" character varying(50), "status" character varying(50) NOT NULL DEFAULT 'PENDING', "password" character varying(255), "age" integer NOT NULL DEFAULT '0', "isActive" boolean NOT NULL DEFAULT true, "isVerified" boolean NOT NULL DEFAULT false, "magicLink" character varying(500), "magicLinkExpireDate" TIMESTAMP WITH TIME ZONE, "verifiedAt" TIMESTAMP WITH TIME ZONE, "disabledAt" TIMESTAMP WITH TIME ZONE, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_6e20ce1edf0678a09f1963f9587" PRIMARY KEY ("uid"))`
    );
    await queryRunner.query(
      `CREATE TABLE "iam"."adminuser_groups" ("adminUsersId" integer NOT NULL, "groupsUid" uuid NOT NULL, CONSTRAINT "PK_c5db7fa4f719d9193a18b179482" PRIMARY KEY ("adminUsersId", "groupsUid"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_fc3351fe704a5704c699d6da0d" ON "iam"."adminuser_groups" ("adminUsersId") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ce03dad33a34587727b4b2e5b7" ON "iam"."adminuser_groups" ("groupsUid") `
    );
    await queryRunner.query(
      `CREATE TABLE "iam"."partneruser_groups" ("partnerUsersUid" uuid NOT NULL, "groupsUid" uuid NOT NULL, CONSTRAINT "PK_931239784ce4a77bf7bea55c611" PRIMARY KEY ("partnerUsersUid", "groupsUid"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_87a06d932c170bae25f49b0a8e" ON "iam"."partneruser_groups" ("partnerUsersUid") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_05effa3659425542e852d919de" ON "iam"."partneruser_groups" ("groupsUid") `
    );
    await queryRunner.query(
      `CREATE TABLE "iam"."user_groups" ("usersUid" uuid NOT NULL, "groupsUid" uuid NOT NULL, CONSTRAINT "PK_b2be4cb3db16e654c2a1268d376" PRIMARY KEY ("usersUid", "groupsUid"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2a112337a963ee76382ab73a0c" ON "iam"."user_groups" ("usersUid") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_cefc80206b7d64fdf87bfcb0c3" ON "iam"."user_groups" ("groupsUid") `
    );
    await queryRunner.query(
      `ALTER TABLE "iam"."adminuser_groups" ADD CONSTRAINT "FK_fc3351fe704a5704c699d6da0d0" FOREIGN KEY ("adminUsersId") REFERENCES "iam"."admin_users"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "iam"."adminuser_groups" ADD CONSTRAINT "FK_ce03dad33a34587727b4b2e5b76" FOREIGN KEY ("groupsUid") REFERENCES "iam"."groups"("uid") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "iam"."partneruser_groups" ADD CONSTRAINT "FK_87a06d932c170bae25f49b0a8ee" FOREIGN KEY ("partnerUsersUid") REFERENCES "iam"."partner_users"("uid") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "iam"."partneruser_groups" ADD CONSTRAINT "FK_05effa3659425542e852d919dea" FOREIGN KEY ("groupsUid") REFERENCES "iam"."groups"("uid") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "iam"."user_groups" ADD CONSTRAINT "FK_2a112337a963ee76382ab73a0c7" FOREIGN KEY ("usersUid") REFERENCES "iam"."users"("uid") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "iam"."user_groups" ADD CONSTRAINT "FK_cefc80206b7d64fdf87bfcb0c3d" FOREIGN KEY ("groupsUid") REFERENCES "iam"."groups"("uid") ON DELETE CASCADE ON UPDATE CASCADE`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "iam"."user_groups" DROP CONSTRAINT "FK_cefc80206b7d64fdf87bfcb0c3d"`
    );
    await queryRunner.query(
      `ALTER TABLE "iam"."user_groups" DROP CONSTRAINT "FK_2a112337a963ee76382ab73a0c7"`
    );
    await queryRunner.query(
      `ALTER TABLE "iam"."partneruser_groups" DROP CONSTRAINT "FK_05effa3659425542e852d919dea"`
    );
    await queryRunner.query(
      `ALTER TABLE "iam"."partneruser_groups" DROP CONSTRAINT "FK_87a06d932c170bae25f49b0a8ee"`
    );
    await queryRunner.query(
      `ALTER TABLE "iam"."adminuser_groups" DROP CONSTRAINT "FK_ce03dad33a34587727b4b2e5b76"`
    );
    await queryRunner.query(
      `ALTER TABLE "iam"."adminuser_groups" DROP CONSTRAINT "FK_fc3351fe704a5704c699d6da0d0"`
    );
    await queryRunner.query(
      `DROP INDEX "iam"."IDX_cefc80206b7d64fdf87bfcb0c3"`
    );
    await queryRunner.query(
      `DROP INDEX "iam"."IDX_2a112337a963ee76382ab73a0c"`
    );
    await queryRunner.query(`DROP TABLE "iam"."user_groups"`);
    await queryRunner.query(
      `DROP INDEX "iam"."IDX_05effa3659425542e852d919de"`
    );
    await queryRunner.query(
      `DROP INDEX "iam"."IDX_87a06d932c170bae25f49b0a8e"`
    );
    await queryRunner.query(`DROP TABLE "iam"."partneruser_groups"`);
    await queryRunner.query(
      `DROP INDEX "iam"."IDX_ce03dad33a34587727b4b2e5b7"`
    );
    await queryRunner.query(
      `DROP INDEX "iam"."IDX_fc3351fe704a5704c699d6da0d"`
    );
    await queryRunner.query(`DROP TABLE "iam"."adminuser_groups"`);
    await queryRunner.query(`DROP TABLE "iam"."users"`);
    await queryRunner.query(`DROP TABLE "iam"."partner_users"`);
    await queryRunner.query(`DROP TABLE "iam"."admin_users"`);
    await queryRunner.query(`DROP TABLE "iam"."groups"`);
  }
}
