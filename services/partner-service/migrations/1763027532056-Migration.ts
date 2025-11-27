import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1763027532056 implements MigrationInterface {
  name = "Migration1763027532056";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "partner"."team_services" ("uid" uuid NOT NULL DEFAULT uuid_generate_v4(), "team_id" uuid NOT NULL, "service_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e0520fb8f98d8e57da0a5953a92" UNIQUE ("team_id", "service_id"), CONSTRAINT "PK_8671b76b43766c4376704267113" PRIMARY KEY ("uid"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_bad10c86fe1f86746015c89da8" ON "partner"."team_services" ("team_id") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_dd64c687d39dc6e938344c418f" ON "partner"."team_services" ("service_id") `
    );
    await queryRunner.query(
      `CREATE TABLE "partner"."services" ("uid" uuid NOT NULL DEFAULT uuid_generate_v4(), "partner_id" uuid NOT NULL, "name" character varying(255) NOT NULL, "description" text, "duration_minutes" integer NOT NULL, "price" numeric(10,2) NOT NULL, "currency" character varying(3) NOT NULL DEFAULT 'USD', "status" "partner"."services_status_enum" NOT NULL DEFAULT 'active', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_7ebb796ba1fc0fa48b39f34a27c" PRIMARY KEY ("uid"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_44c134d7d1f8f3b02da02160e9" ON "partner"."services" ("partner_id") `
    );
    await queryRunner.query(
      `CREATE TABLE "partner"."appointments" ("uid" uuid NOT NULL DEFAULT uuid_generate_v4(), "customer_user_id" character varying(255) NOT NULL, "team_member_id" uuid NOT NULL, "service_id" uuid NOT NULL, "appointment_date" date NOT NULL, "start_time" TIME NOT NULL, "end_time" TIME NOT NULL, "duration_minutes" integer NOT NULL, "status" "partner"."appointments_status_enum" NOT NULL DEFAULT 'pending', "notes" text, "customer_notes" text, "cancellation_reason" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_5481777fd214c802ecefe55174d" PRIMARY KEY ("uid"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4c36cf49cca8aa7ffd8f6e854d" ON "partner"."appointments" ("customer_user_id") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a266a9419146968ef411f0fedb" ON "partner"."appointments" ("team_member_id") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2a2088e8eaa8f28d8de2bdbb85" ON "partner"."appointments" ("service_id") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e44a44b3eec38bb354c8425945" ON "partner"."appointments" ("appointment_date") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_be56096a9ab7baef3b3d66266f" ON "partner"."appointments" ("team_member_id", "appointment_date", "start_time") `
    );
    await queryRunner.query(
      `CREATE TABLE "partner"."team_member_availability" ("uid" uuid NOT NULL DEFAULT uuid_generate_v4(), "team_member_id" uuid NOT NULL, "day_of_week" integer, "specific_date" date, "start_time" TIME NOT NULL, "end_time" TIME NOT NULL, "is_recurring" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_2d4170fbb12f504663f4cca4eb8" PRIMARY KEY ("uid"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7d14fea718d12f302b8e9c6fb2" ON "partner"."team_member_availability" ("team_member_id") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2a04a6555fb11961efb87d293f" ON "partner"."team_member_availability" ("specific_date") `
    );
    await queryRunner.query(
      `CREATE TABLE "partner"."team_members" ("uid" uuid NOT NULL DEFAULT uuid_generate_v4(), "team_id" uuid NOT NULL, "user_id" character varying(255) NOT NULL, "role" character varying(50) NOT NULL DEFAULT 'member', "joined_at" TIMESTAMP NOT NULL DEFAULT now(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_1d3c06a8217a8785e2af0ec4ab8" UNIQUE ("team_id", "user_id"), CONSTRAINT "PK_92049c40e8a7ecf6e0485994e59" PRIMARY KEY ("uid"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_fdad7d5768277e60c40e01cdce" ON "partner"."team_members" ("team_id") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c2bf4967c8c2a6b845dadfbf3d" ON "partner"."team_members" ("user_id") `
    );
    await queryRunner.query(
      `CREATE TABLE "partner"."teams" ("uid" uuid NOT NULL DEFAULT uuid_generate_v4(), "partner_id" uuid NOT NULL, "name" character varying(255) NOT NULL, "description" text, "status" "partner"."teams_status_enum" NOT NULL DEFAULT 'active', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b474a826025796be0dafa23aa54" PRIMARY KEY ("uid"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_fde44edfeb831a0f12733b0938" ON "partner"."teams" ("partner_id") `
    );
    await queryRunner.query(
      `CREATE TABLE "partner"."company_media" ("uid" uuid NOT NULL DEFAULT uuid_generate_v4(), "partner_id" uuid NOT NULL, "url" character varying(500) NOT NULL, "type" "partner"."company_media_type_enum" NOT NULL, "display_order" integer NOT NULL DEFAULT '0', "alt_text" character varying(255), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_54fd507d19bae16c6c42833daad" PRIMARY KEY ("uid"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_78f1ef3612b803bbd1c003c427" ON "partner"."company_media" ("partner_id") `
    );
    await queryRunner.query(
      `CREATE TYPE "partner"."business_types_status_enum" AS ENUM('active', 'inactive')`
    );
    await queryRunner.query(
      `CREATE TABLE "partner"."business_types" ("uid" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "description" text, "status" "partner"."business_types_status_enum" NOT NULL DEFAULT 'active', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "partnersUid" uuid, CONSTRAINT "UQ_3894005288e759379ee7b56622a" UNIQUE ("name"), CONSTRAINT "PK_6366247aea953d269a413fecc87" PRIMARY KEY ("uid"))`
    );
    await queryRunner.query(
      `CREATE TABLE "partner"."partners" ("uid" uuid NOT NULL DEFAULT uuid_generate_v4(), "external_uid" character varying(255) NOT NULL, "company_name" character varying(255) NOT NULL, "description" text, "address_street" character varying(500), "address_city" character varying(100), "address_state" character varying(100), "address_country" character varying(100), "address_postal_code" character varying(20),  "phone_number" character varying(50), "email" character varying(255), "website" character varying(255), "status" "partner"."partners_status_enum" NOT NULL DEFAULT 'active', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ec2641a1f489e8dce97ff87ab0b" PRIMARY KEY ("uid"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_acf7d7d1b75748f31d9ab70373" ON "partner"."partners" ("owner_user_id") `
    );
    await queryRunner.query(
      `ALTER TABLE "partner"."team_services" ADD CONSTRAINT "FK_bad10c86fe1f86746015c89da8b" FOREIGN KEY ("team_id") REFERENCES "partner"."teams"("uid") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "partner"."team_services" ADD CONSTRAINT "FK_dd64c687d39dc6e938344c418f7" FOREIGN KEY ("service_id") REFERENCES "partner"."services"("uid") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "partner"."services" ADD CONSTRAINT "FK_44c134d7d1f8f3b02da02160e98" FOREIGN KEY ("partner_id") REFERENCES "partner"."partners"("uid") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "partner"."appointments" ADD CONSTRAINT "FK_a266a9419146968ef411f0fedb5" FOREIGN KEY ("team_member_id") REFERENCES "partner"."team_members"("uid") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "partner"."appointments" ADD CONSTRAINT "FK_2a2088e8eaa8f28d8de2bdbb857" FOREIGN KEY ("service_id") REFERENCES "partner"."services"("uid") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "partner"."team_member_availability" ADD CONSTRAINT "FK_7d14fea718d12f302b8e9c6fb20" FOREIGN KEY ("team_member_id") REFERENCES "partner"."team_members"("uid") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "partner"."team_members" ADD CONSTRAINT "FK_fdad7d5768277e60c40e01cdcea" FOREIGN KEY ("team_id") REFERENCES "partner"."teams"("uid") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "partner"."teams" ADD CONSTRAINT "FK_fde44edfeb831a0f12733b09383" FOREIGN KEY ("partner_id") REFERENCES "partner"."partners"("uid") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "partner"."company_media" ADD CONSTRAINT "FK_78f1ef3612b803bbd1c003c4272" FOREIGN KEY ("partner_id") REFERENCES "partner"."partners"("uid") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "partner"."business_types" ADD CONSTRAINT "FK_bea7ec24b1f620560f3b51287b1" FOREIGN KEY ("partnersUid") REFERENCES "partner"."partners"("uid") ON DELETE SET NULL ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "partner"."business_types" DROP CONSTRAINT "FK_bea7ec24b1f620560f3b51287b1"`
    );
    await queryRunner.query(
      `ALTER TABLE "partner"."company_media" DROP CONSTRAINT "FK_78f1ef3612b803bbd1c003c4272"`
    );
    await queryRunner.query(
      `ALTER TABLE "partner"."teams" DROP CONSTRAINT "FK_fde44edfeb831a0f12733b09383"`
    );
    await queryRunner.query(
      `ALTER TABLE "partner"."team_members" DROP CONSTRAINT "FK_fdad7d5768277e60c40e01cdcea"`
    );
    await queryRunner.query(
      `ALTER TABLE "partner"."team_member_availability" DROP CONSTRAINT "FK_7d14fea718d12f302b8e9c6fb20"`
    );
    await queryRunner.query(
      `ALTER TABLE "partner"."appointments" DROP CONSTRAINT "FK_2a2088e8eaa8f28d8de2bdbb857"`
    );
    await queryRunner.query(
      `ALTER TABLE "partner"."appointments" DROP CONSTRAINT "FK_a266a9419146968ef411f0fedb5"`
    );
    await queryRunner.query(
      `ALTER TABLE "partner"."services" DROP CONSTRAINT "FK_44c134d7d1f8f3b02da02160e98"`
    );
    await queryRunner.query(
      `ALTER TABLE "partner"."team_services" DROP CONSTRAINT "FK_dd64c687d39dc6e938344c418f7"`
    );
    await queryRunner.query(
      `ALTER TABLE "partner"."team_services" DROP CONSTRAINT "FK_bad10c86fe1f86746015c89da8b"`
    );
    await queryRunner.query(
      `DROP INDEX "partner"."IDX_acf7d7d1b75748f31d9ab70373"`
    );
    await queryRunner.query(`DROP TABLE "partner"."partners"`);
    await queryRunner.query(`DROP TABLE "partner"."business_types"`);
    await queryRunner.query(`DROP TYPE "partner"."business_types_status_enum"`);
    await queryRunner.query(
      `DROP INDEX "partner"."IDX_78f1ef3612b803bbd1c003c427"`
    );
    await queryRunner.query(`DROP TABLE "partner"."company_media"`);
    await queryRunner.query(
      `DROP INDEX "partner"."IDX_fde44edfeb831a0f12733b0938"`
    );
    await queryRunner.query(`DROP TABLE "partner"."teams"`);
    await queryRunner.query(
      `DROP INDEX "partner"."IDX_c2bf4967c8c2a6b845dadfbf3d"`
    );
    await queryRunner.query(
      `DROP INDEX "partner"."IDX_fdad7d5768277e60c40e01cdce"`
    );
    await queryRunner.query(`DROP TABLE "partner"."team_members"`);
    await queryRunner.query(
      `DROP INDEX "partner"."IDX_2a04a6555fb11961efb87d293f"`
    );
    await queryRunner.query(
      `DROP INDEX "partner"."IDX_7d14fea718d12f302b8e9c6fb2"`
    );
    await queryRunner.query(`DROP TABLE "partner"."team_member_availability"`);
    await queryRunner.query(
      `DROP INDEX "partner"."IDX_be56096a9ab7baef3b3d66266f"`
    );
    await queryRunner.query(
      `DROP INDEX "partner"."IDX_e44a44b3eec38bb354c8425945"`
    );
    await queryRunner.query(
      `DROP INDEX "partner"."IDX_2a2088e8eaa8f28d8de2bdbb85"`
    );
    await queryRunner.query(
      `DROP INDEX "partner"."IDX_a266a9419146968ef411f0fedb"`
    );
    await queryRunner.query(
      `DROP INDEX "partner"."IDX_4c36cf49cca8aa7ffd8f6e854d"`
    );
    await queryRunner.query(`DROP TABLE "partner"."appointments"`);
    await queryRunner.query(
      `DROP INDEX "partner"."IDX_44c134d7d1f8f3b02da02160e9"`
    );
    await queryRunner.query(`DROP TABLE "partner"."services"`);
    await queryRunner.query(
      `DROP INDEX "partner"."IDX_dd64c687d39dc6e938344c418f"`
    );
    await queryRunner.query(
      `DROP INDEX "partner"."IDX_bad10c86fe1f86746015c89da8"`
    );
    await queryRunner.query(`DROP TABLE "partner"."team_services"`);
  }
}
