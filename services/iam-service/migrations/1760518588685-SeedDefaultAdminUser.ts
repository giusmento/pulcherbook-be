import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedDefaultAdminUser11760518588685 implements MigrationInterface {
  name = "SeedDefaultAdminUser11760518588685";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            INSERT INTO "iam"."admin_users"
            ("id", "uid", "firstName", "lastName", "username", "email", "phoneNumber", "status", "password", "age", "isActive", "isVerified", "magicLink", "magicLinkExpireDate", "verifiedAt", "disabledAt", "createdAt", "updatedAt")
            VALUES
            ('1', 'a0000000-0000-0000-0000-000000000001', 'Admin', 'User', null, 'admin@pulkerbook.com', null, 'ACTIVE', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', '0', 'true', 'true', null, null, '2025-10-15 17:29:58.149202+00', null, '2025-10-15 17:29:58.149202+00', '2025-10-15 17:29:58.149202+00')
            ON CONFLICT ("email") DO NOTHING;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DELETE FROM "iam"."admin_users"
            WHERE "email" = 'admin@pulkerbook.com';
        `);
  }
}
