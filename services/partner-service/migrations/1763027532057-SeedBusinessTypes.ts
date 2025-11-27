import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedBusinessTypes1763027532057 implements MigrationInterface {
  name = "SeedBusinessTypes1763027532057";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Insert common business types for beauty and wellness industry
    await queryRunner.query(`
      INSERT INTO "partner"."business_types" ("name", "description", "status", "created_at", "updated_at") VALUES
        ('Salon', 'Hair salon offering haircuts, styling, coloring, and treatments', 'active', NOW(), NOW()),
        ('Barbershop', 'Traditional or modern barbershop specializing in men''s grooming', 'active', NOW(), NOW()),
        ('Spa', 'Full-service spa offering massages, facials, and body treatments', 'active', NOW(), NOW()),
        ('Nail Salon', 'Nail care services including manicures, pedicures, and nail art', 'active', NOW(), NOW()),
        ('Beauty Clinic', 'Professional beauty treatments and aesthetic services', 'active', NOW(), NOW()),
        ('Medical Spa', 'Medical-grade aesthetic treatments and wellness services', 'active', NOW(), NOW()),
        ('Tattoo Studio', 'Professional tattoo and body art services', 'active', NOW(), NOW()),
        ('Massage Therapy', 'Therapeutic and relaxation massage services', 'active', NOW(), NOW()),
        ('Wellness Center', 'Holistic health and wellness services', 'active', NOW(), NOW()),
        ('Fitness Center', 'Gym and fitness training facilities', 'active', NOW(), NOW()),
        ('Yoga Studio', 'Yoga classes and meditation sessions', 'active', NOW(), NOW()),
        ('Makeup Studio', 'Professional makeup application and lessons', 'active', NOW(), NOW()),
        ('Waxing Salon', 'Hair removal and waxing services', 'active', NOW(), NOW()),
        ('Eyebrow & Lash Studio', 'Specialized eyebrow and eyelash services', 'active', NOW(), NOW()),
        ('Tanning Salon', 'Spray tanning and UV tanning services', 'active', NOW(), NOW()),
        ('Other', 'Other beauty, wellness, or personal care services', 'active', NOW(), NOW())
      ON CONFLICT ("name") DO NOTHING;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove seeded business types
    await queryRunner.query(`
      DELETE FROM "partner"."business_types" WHERE "name" IN (
        'Salon',
        'Barbershop',
        'Spa',
        'Nail Salon',
        'Beauty Clinic',
        'Medical Spa',
        'Tattoo Studio',
        'Massage Therapy',
        'Wellness Center',
        'Fitness Center',
        'Yoga Studio',
        'Makeup Studio',
        'Waxing Salon',
        'Eyebrow & Lash Studio',
        'Tanning Salon',
        'Other'
      );
    `);
  }
}
