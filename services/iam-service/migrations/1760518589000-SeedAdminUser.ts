import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedAdminUser1760518589000 implements MigrationInterface {
  name = "SeedAdminUser1760518589000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    const crypto = require("crypto");
    const hashedPassword = crypto
      .createHash("sha256")
      .update("admin123")
      .digest("hex");
    const uid = "a0000000-0000-0000-0000-000000000001";

    await queryRunner.query(`
            INSERT INTO "iam"."admin_users" (
                "uid",
                "firstName",
                "lastName",
                "email",
                "password",
                "status",
                "isActive",
                "isVerified",
                "verifiedAt"
            ) VALUES (
                '${uid}',
                'Admin',
                'User',
                'admin@pulkerbook.com',
                '${hashedPassword}',
                'ACTIVE',
                true,
                true,
                NOW()
            )
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
