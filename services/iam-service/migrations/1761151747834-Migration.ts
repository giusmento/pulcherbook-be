import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1761151747834 implements MigrationInterface {
    name = 'Migration1761151747834'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "iam"."users" ("id" SERIAL NOT NULL, "uid" uuid NOT NULL, "firstName" character varying(255) NOT NULL, "lastName" character varying(255), "username" character varying(255), "email" character varying(255) NOT NULL, "phoneNumber" character varying(50), "status" character varying(50) NOT NULL DEFAULT 'PENDING', "password" character varying(255), "age" integer NOT NULL DEFAULT '0', "isActive" boolean NOT NULL DEFAULT true, "isVerified" boolean NOT NULL DEFAULT false, "magicLink" character varying(500), "magicLinkExpireDate" TIMESTAMP WITH TIME ZONE, "verifiedAt" TIMESTAMP WITH TIME ZONE, "disabledAt" TIMESTAMP WITH TIME ZONE, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "groups" text, CONSTRAINT "UQ_6e20ce1edf0678a09f1963f9587" UNIQUE ("uid"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "iam"."users"`);
    }

}
