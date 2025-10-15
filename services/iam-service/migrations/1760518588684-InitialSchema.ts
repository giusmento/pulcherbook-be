import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1760518588684 implements MigrationInterface {
    name = 'InitialSchema1760518588684'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "iam"."admin_users" ("id" SERIAL NOT NULL, "uid" uuid NOT NULL, "firstName" character varying(255) NOT NULL, "lastName" character varying(255), "username" character varying(255), "email" character varying(255) NOT NULL, "phoneNumber" character varying(50), "status" character varying(50) NOT NULL DEFAULT 'PENDING', "password" character varying(255), "age" integer NOT NULL DEFAULT '0', "isActive" boolean NOT NULL DEFAULT true, "isVerified" boolean NOT NULL DEFAULT false, "magicLink" character varying(500), "magicLinkExpireDate" TIMESTAMP WITH TIME ZONE, "verifiedAt" TIMESTAMP WITH TIME ZONE, "disabledAt" TIMESTAMP WITH TIME ZONE, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_c5776feed636bf4de648f76b6ac" UNIQUE ("uid"), CONSTRAINT "UQ_dcd0c8a4b10af9c986e510b9ecc" UNIQUE ("email"), CONSTRAINT "PK_06744d221bb6145dc61e5dc441d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "iam"."groups_usertype_enum" AS ENUM('admin', 'partner', 'user')`);
        await queryRunner.query(`CREATE TABLE "iam"."groups" ("id" SERIAL NOT NULL, "userType" "iam"."groups_usertype_enum" NOT NULL, "uid" uuid NOT NULL, "name" character varying(255) NOT NULL, "description" text NOT NULL, "permissions" text NOT NULL, CONSTRAINT "UQ_4163ae2a10a069a5f983e40a3f1" UNIQUE ("uid"), CONSTRAINT "PK_659d1483316afb28afd3a90646e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "iam"."partner_users" ("id" SERIAL NOT NULL, "uid" uuid NOT NULL, "firstName" character varying(255) NOT NULL, "lastName" character varying(255), "username" character varying(255), "email" character varying(255) NOT NULL, "phoneNumber" character varying(50), "status" character varying(50) NOT NULL DEFAULT 'PENDING', "password" character varying(255), "age" integer NOT NULL DEFAULT '0', "isActive" boolean NOT NULL DEFAULT true, "isVerified" boolean NOT NULL DEFAULT false, "magicLink" character varying(500), "magicLinkExpireDate" TIMESTAMP WITH TIME ZONE, "verifiedAt" TIMESTAMP WITH TIME ZONE, "disabledAt" TIMESTAMP WITH TIME ZONE, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "groups" text, CONSTRAINT "UQ_460ef9551fda426a8e00e51448f" UNIQUE ("uid"), CONSTRAINT "UQ_bf20e5cbf1f006765b23020e871" UNIQUE ("email"), CONSTRAINT "PK_01e1d1692cba17ceecf86942a8e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "iam"."admin_user_groups" ("admin_user_id" integer NOT NULL, "group_id" integer NOT NULL, CONSTRAINT "PK_3f688bc3d527831198d4f52231f" PRIMARY KEY ("admin_user_id", "group_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_d68c1a0cc888fad39450692b0d" ON "iam"."admin_user_groups" ("admin_user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_ce2d6eff2ec8600752dc71426b" ON "iam"."admin_user_groups" ("group_id") `);
        await queryRunner.query(`ALTER TABLE "iam"."admin_user_groups" ADD CONSTRAINT "FK_d68c1a0cc888fad39450692b0d2" FOREIGN KEY ("admin_user_id") REFERENCES "iam"."admin_users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "iam"."admin_user_groups" ADD CONSTRAINT "FK_ce2d6eff2ec8600752dc71426b8" FOREIGN KEY ("group_id") REFERENCES "iam"."groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "iam"."admin_user_groups" DROP CONSTRAINT "FK_ce2d6eff2ec8600752dc71426b8"`);
        await queryRunner.query(`ALTER TABLE "iam"."admin_user_groups" DROP CONSTRAINT "FK_d68c1a0cc888fad39450692b0d2"`);
        await queryRunner.query(`DROP INDEX "iam"."IDX_ce2d6eff2ec8600752dc71426b"`);
        await queryRunner.query(`DROP INDEX "iam"."IDX_d68c1a0cc888fad39450692b0d"`);
        await queryRunner.query(`DROP TABLE "iam"."admin_user_groups"`);
        await queryRunner.query(`DROP TABLE "iam"."partner_users"`);
        await queryRunner.query(`DROP TABLE "iam"."groups"`);
        await queryRunner.query(`DROP TYPE "iam"."groups_usertype_enum"`);
        await queryRunner.query(`DROP TABLE "iam"."admin_users"`);
    }

}
