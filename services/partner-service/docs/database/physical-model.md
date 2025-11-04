# Physical Data Model - Partner Service

This document describes the physical database schema for the Partner Service, including all tables, columns, data types, and constraints.

```mermaid
erDiagram
    partners ||--o{ teams : "partner_id"
    partners ||--o{ services : "partner_id"
    partners ||--o{ company_media : "partner_id"

    teams ||--o{ team_members : "team_id"
    teams ||--o{ team_services : "team_id"

    services ||--o{ team_services : "service_id"
    services ||--o{ appointments : "service_id"

    team_members ||--o{ appointments : "team_member_id"
    team_members ||--o{ team_member_availability : "team_member_id"

    partners {
        BIGINT id PK "Auto-increment"
        VARCHAR(255) owner_user_id "NOT NULL, Index"
        VARCHAR(255) company_name "NOT NULL"
        TEXT description "NULL"
        VARCHAR(500) address "NULL"
        VARCHAR(100) city "NULL"
        VARCHAR(100) state "NULL"
        VARCHAR(100) country "NULL"
        VARCHAR(20) postal_code "NULL"
        DECIMAL(10,8) latitude "NULL"
        DECIMAL(11,8) longitude "NULL"
        VARCHAR(50) phone "NULL"
        VARCHAR(255) email "NULL"
        VARCHAR(255) website "NULL"
        ENUM status "NOT NULL, DEFAULT 'active'"
        TIMESTAMP created_at "NOT NULL"
        TIMESTAMP updated_at "NOT NULL"
    }

    teams {
        BIGINT id PK "Auto-increment"
        BIGINT partner_id FK "NOT NULL, Index"
        VARCHAR(255) name "NOT NULL"
        TEXT description "NULL"
        ENUM status "NOT NULL, DEFAULT 'active'"
        TIMESTAMP created_at "NOT NULL"
        TIMESTAMP updated_at "NOT NULL"
    }

    team_members {
        BIGINT id PK "Auto-increment"
        BIGINT team_id FK "NOT NULL, Index"
        VARCHAR(255) user_id "NOT NULL, Index"
        VARCHAR(50) role "DEFAULT 'member'"
        TIMESTAMP joined_at "NOT NULL"
        TIMESTAMP created_at "NOT NULL"
        TIMESTAMP updated_at "NOT NULL"
        UNIQUE team_id_user_id "UNIQUE(team_id, user_id)"
    }

    services {
        BIGINT id PK "Auto-increment"
        BIGINT partner_id FK "NOT NULL, Index"
        VARCHAR(255) name "NOT NULL"
        TEXT description "NULL"
        INTEGER duration_minutes "NOT NULL"
        DECIMAL(10,2) price "NOT NULL"
        VARCHAR(3) currency "DEFAULT 'USD'"
        ENUM status "NOT NULL, DEFAULT 'active'"
        TIMESTAMP created_at "NOT NULL"
        TIMESTAMP updated_at "NOT NULL"
    }

    team_services {
        BIGINT id PK "Auto-increment"
        BIGINT team_id FK "NOT NULL, Index"
        BIGINT service_id FK "NOT NULL, Index"
        TIMESTAMP created_at "NOT NULL"
        UNIQUE team_id_service_id "UNIQUE(team_id, service_id)"
    }

    company_media {
        BIGINT id PK "Auto-increment"
        BIGINT partner_id FK "NOT NULL, Index"
        VARCHAR(500) url "NOT NULL"
        ENUM type "NOT NULL"
        INTEGER display_order "DEFAULT 0"
        VARCHAR(255) alt_text "NULL"
        TIMESTAMP created_at "NOT NULL"
        TIMESTAMP updated_at "NOT NULL"
    }

    appointments {
        BIGINT id PK "Auto-increment"
        VARCHAR(255) customer_user_id "NOT NULL, Index"
        BIGINT team_member_id FK "NOT NULL, Index"
        BIGINT service_id FK "NOT NULL, Index"
        DATE appointment_date "NOT NULL, Index"
        TIME start_time "NOT NULL"
        TIME end_time "NOT NULL"
        INTEGER duration_minutes "NOT NULL"
        ENUM status "NOT NULL, DEFAULT 'pending'"
        TEXT notes "NULL"
        TEXT customer_notes "NULL"
        TEXT cancellation_reason "NULL"
        TIMESTAMP created_at "NOT NULL"
        TIMESTAMP updated_at "NOT NULL"
        INDEX idx_member_date_time "INDEX(team_member_id, appointment_date, start_time)"
    }

    team_member_availability {
        BIGINT id PK "Auto-increment"
        BIGINT team_member_id FK "NOT NULL, Index"
        INTEGER day_of_week "NULL, Range: 0-6"
        DATE specific_date "NULL, Index"
        TIME start_time "NOT NULL"
        TIME end_time "NOT NULL"
        BOOLEAN is_recurring "NOT NULL, DEFAULT true"
        TIMESTAMP created_at "NOT NULL"
        TIMESTAMP updated_at "NOT NULL"
    }
```

## Table Details

### Indexes

1. **partners**
   - PRIMARY KEY: `id`
   - INDEX: `owner_user_id`

2. **teams**
   - PRIMARY KEY: `id`
   - INDEX: `partner_id`
   - FOREIGN KEY: `partner_id` REFERENCES `partners(id)` ON DELETE CASCADE

3. **team_members**
   - PRIMARY KEY: `id`
   - INDEX: `team_id`
   - INDEX: `user_id`
   - UNIQUE: `(team_id, user_id)`
   - FOREIGN KEY: `team_id` REFERENCES `teams(id)` ON DELETE CASCADE

4. **services**
   - PRIMARY KEY: `id`
   - INDEX: `partner_id`
   - FOREIGN KEY: `partner_id` REFERENCES `partners(id)` ON DELETE CASCADE

5. **team_services**
   - PRIMARY KEY: `id`
   - INDEX: `team_id`
   - INDEX: `service_id`
   - UNIQUE: `(team_id, service_id)`
   - FOREIGN KEY: `team_id` REFERENCES `teams(id)` ON DELETE CASCADE
   - FOREIGN KEY: `service_id` REFERENCES `services(id)` ON DELETE CASCADE

6. **company_media**
   - PRIMARY KEY: `id`
   - INDEX: `partner_id`
   - FOREIGN KEY: `partner_id` REFERENCES `partners(id)` ON DELETE CASCADE

7. **appointments**
   - PRIMARY KEY: `id`
   - INDEX: `customer_user_id`
   - INDEX: `team_member_id`
   - INDEX: `service_id`
   - INDEX: `appointment_date`
   - INDEX: `(team_member_id, appointment_date, start_time)`
   - FOREIGN KEY: `team_member_id` REFERENCES `team_members(id)` ON DELETE CASCADE
   - FOREIGN KEY: `service_id` REFERENCES `services(id)` ON DELETE CASCADE

8. **team_member_availability**
   - PRIMARY KEY: `id`
   - INDEX: `team_member_id`
   - INDEX: `specific_date`
   - FOREIGN KEY: `team_member_id` REFERENCES `team_members(id)` ON DELETE CASCADE

### Enumerations

1. **PartnerStatus**: `active`, `inactive`, `pending`
2. **TeamStatus**: `active`, `inactive`
3. **ServiceStatus**: `active`, `inactive`
4. **MediaType**: `logo`, `cover`, `gallery`
5. **AppointmentStatus**: `pending`, `confirmed`, `cancelled`, `completed`, `no_show`

### Constraints

1. **team_members**: A user cannot be added to the same team twice (UNIQUE constraint on team_id, user_id)
2. **team_services**: A service cannot be assigned to the same team twice (UNIQUE constraint on team_id, service_id)
3. **team_member_availability**: Either `day_of_week` (for recurring) OR `specific_date` (for one-time) must be set (application-level validation)

### Foreign Key Cascades

All foreign keys use `ON DELETE CASCADE` to ensure referential integrity:
- Deleting a partner deletes all associated teams, services, and media
- Deleting a team deletes all associated team members and team services
- Deleting a team member deletes all associated appointments and availability
- Deleting a service deletes all associated team services and appointments
