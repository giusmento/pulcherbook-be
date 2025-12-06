import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedOfferingCategories1764841448657 implements MigrationInterface {
  name = "SeedOfferingCategories1764841448657";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Insert offering categories organized by type
    await queryRunner.query(`
      INSERT INTO "partner"."offering_categories" ("type", "name", "description", "is_active", "created_at", "updated_at") VALUES
        -- Hair Services (12 items)
        ('Hair', 'Haircut', 'Professional hair cutting and styling services', true, NOW(), NOW()),
        ('Hair', 'Hair Coloring', 'Full or partial hair coloring, highlights, and lowlights', true, NOW(), NOW()),
        ('Hair', 'Balayage', 'Hand-painted hair coloring technique for natural-looking highlights', true, NOW(), NOW()),
        ('Hair', 'Hair Treatment', 'Deep conditioning, keratin treatments, and hair repair services', true, NOW(), NOW()),
        ('Hair', 'Blowout', 'Professional hair washing, drying, and styling', true, NOW(), NOW()),
        ('Hair', 'Hair Extensions', 'Application and maintenance of hair extensions', true, NOW(), NOW()),
        ('Hair', 'Braiding', 'Various braiding styles and techniques', true, NOW(), NOW()),
        ('Hair', 'Updo & Styling', 'Special occasion hairstyling and updos', true, NOW(), NOW()),
        ('Hair', 'Perm', 'Chemical hair perming and wave services', true, NOW(), NOW()),
        ('Hair', 'Scalp Treatment', 'Scalp massage, exfoliation, and therapeutic treatments', true, NOW(), NOW()),
        ('Hair', 'Men''s Grooming', 'Specialized men''s haircuts, beard trims, and grooming', true, NOW(), NOW()),
        ('Hair', 'Kids Haircut', 'Haircuts and styling for children', true, NOW(), NOW()),

        -- Nails Services (12 items)
        ('Nails', 'Manicure', 'Hand care, nail shaping, and polish application', true, NOW(), NOW()),
        ('Nails', 'Pedicure', 'Foot care, nail shaping, and polish application', true, NOW(), NOW()),
        ('Nails', 'Gel Nails', 'Long-lasting gel polish application', true, NOW(), NOW()),
        ('Nails', 'Acrylic Nails', 'Acrylic nail extensions and sculpting', true, NOW(), NOW()),
        ('Nails', 'Nail Art', 'Creative nail designs and decorations', true, NOW(), NOW()),
        ('Nails', 'Dip Powder Nails', 'Dip powder manicure application', true, NOW(), NOW()),
        ('Nails', 'French Manicure', 'Classic French manicure style', true, NOW(), NOW()),
        ('Nails', 'Nail Extension', 'Natural or artificial nail lengthening', true, NOW(), NOW()),
        ('Nails', 'Nail Removal', 'Safe removal of gel, acrylic, or other nail enhancements', true, NOW(), NOW()),
        ('Nails', 'Paraffin Treatment', 'Moisturizing paraffin wax treatment for hands or feet', true, NOW(), NOW()),
        ('Nails', 'Nail Repair', 'Fixing broken or damaged nails', true, NOW(), NOW()),
        ('Nails', 'Express Manicure', 'Quick nail shaping and polish application', true, NOW(), NOW()),

        -- Skin Services (14 items)
        ('Skin', 'Facial', 'Deep cleansing and rejuvenating facial treatment', true, NOW(), NOW()),
        ('Skin', 'Anti-Aging Facial', 'Facial treatment focused on reducing signs of aging', true, NOW(), NOW()),
        ('Skin', 'Hydrating Facial', 'Intensive moisturizing facial treatment', true, NOW(), NOW()),
        ('Skin', 'Acne Treatment', 'Specialized facial for acne-prone skin', true, NOW(), NOW()),
        ('Skin', 'Chemical Peel', 'Exfoliating treatment to improve skin texture', true, NOW(), NOW()),
        ('Skin', 'Microdermabrasion', 'Mechanical exfoliation for skin renewal', true, NOW(), NOW()),
        ('Skin', 'LED Light Therapy', 'Light-based therapy for various skin concerns', true, NOW(), NOW()),
        ('Skin', 'Dermaplaning', 'Exfoliation technique removing dead skin and peach fuzz', true, NOW(), NOW()),
        ('Skin', 'Extraction Facial', 'Deep pore cleansing and blackhead removal', true, NOW(), NOW()),
        ('Skin', 'Eyebrow Shaping', 'Professional eyebrow waxing, threading, or tweezing', true, NOW(), NOW()),
        ('Skin', 'Lash Lift', 'Semi-permanent eyelash curling treatment', true, NOW(), NOW()),
        ('Skin', 'Lash Extensions', 'Application of individual eyelash extensions', true, NOW(), NOW()),
        ('Skin', 'Waxing', 'Hair removal using wax for various body areas', true, NOW(), NOW()),
        ('Skin', 'Tinting', 'Eyebrow or eyelash tinting services', true, NOW(), NOW()),

        -- Wellness Services (12 items)
        ('Wellness', 'Massage Therapy', 'Therapeutic full-body massage', true, NOW(), NOW()),
        ('Wellness', 'Deep Tissue Massage', 'Intense massage targeting deep muscle layers', true, NOW(), NOW()),
        ('Wellness', 'Swedish Massage', 'Relaxing massage with gentle techniques', true, NOW(), NOW()),
        ('Wellness', 'Hot Stone Massage', 'Massage using heated stones for relaxation', true, NOW(), NOW()),
        ('Wellness', 'Aromatherapy', 'Therapeutic use of essential oils and scents', true, NOW(), NOW()),
        ('Wellness', 'Reflexology', 'Pressure point massage on feet, hands, or ears', true, NOW(), NOW()),
        ('Wellness', 'Body Scrub', 'Full-body exfoliation treatment', true, NOW(), NOW()),
        ('Wellness', 'Body Wrap', 'Detoxifying or moisturizing body wrap treatment', true, NOW(), NOW()),
        ('Wellness', 'Sauna Session', 'Relaxation and detox through heat therapy', true, NOW(), NOW()),
        ('Wellness', 'Yoga Class', 'Guided yoga session for flexibility and relaxation', true, NOW(), NOW()),
        ('Wellness', 'Meditation Session', 'Guided meditation and mindfulness practice', true, NOW(), NOW()),
        ('Wellness', 'Reiki Healing', 'Energy healing and relaxation therapy', true, NOW(), NOW()),

        -- Makeup Services (8 items)
        ('Makeup', 'Makeup Application', 'Professional makeup for any occasion', true, NOW(), NOW()),
        ('Makeup', 'Bridal Makeup', 'Special occasion makeup for weddings', true, NOW(), NOW()),
        ('Makeup', 'Airbrush Makeup', 'Long-lasting airbrush makeup application', true, NOW(), NOW()),
        ('Makeup', 'Makeup Lesson', 'Personalized makeup tutorial and tips', true, NOW(), NOW()),
        ('Makeup', 'Evening Makeup', 'Glamorous makeup for special events', true, NOW(), NOW()),
        ('Makeup', 'Natural Makeup', 'Subtle, everyday makeup look', true, NOW(), NOW()),
        ('Makeup', 'False Lashes', 'Application of false eyelashes', true, NOW(), NOW()),
        ('Makeup', 'Makeup Consultation', 'Color analysis and product recommendations', true, NOW(), NOW()),

        -- Body Services (8 items)
        ('Body', 'Spray Tan', 'Sunless tanning application', true, NOW(), NOW()),
        ('Body', 'Body Contouring', 'Non-invasive body shaping treatments', true, NOW(), NOW()),
        ('Body', 'Cellulite Treatment', 'Treatment to reduce cellulite appearance', true, NOW(), NOW()),
        ('Body', 'Laser Hair Removal', 'Permanent hair reduction using laser technology', true, NOW(), NOW()),
        ('Body', 'Body Massage', 'Targeted massage for specific body areas', true, NOW(), NOW()),
        ('Body', 'Tattoo Service', 'Custom tattoo design and application', true, NOW(), NOW()),
        ('Body', 'Piercing', 'Professional body piercing services', true, NOW(), NOW()),
        ('Body', 'Slimming Treatment', 'Body treatments aimed at inch loss', true, NOW(), NOW())
      ON CONFLICT DO NOTHING;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove all seeded offering categories
    await queryRunner.query(`
      DELETE FROM "partner"."offering_categories" WHERE "type" IN (
        'Hair', 'Nails', 'Skin', 'Wellness', 'Makeup', 'Body'
      );
    `);
  }
}
