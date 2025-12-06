# Type System Documentation - Partner Service

This document describes all TypeScript types used in the Partner Service, following MangoJS standards.

## Entity Types

Types are organized per entity in `src/types/entities/`. Each entity has:
- Base type (full database entity)
- Post type (for creating new records)
- Put type (for updating existing records)

---

### business_types

| Entity       | Type Name         | Description                             | File                                        |
| ------------ | ----------------- | --------------------------------------- | ------------------------------------------- |
| BusinessType | BusinessType      | Full business type entity from database | `packages/types/src/partner/entities/`      |
| BusinessType | BusinessTypeShort | Short version for API responses         | `packages/types/src/partner/entities/`      |

---

### partner

| Entity  | Type Name   | Description                       | File                                     |
| ------- | ----------- | --------------------------------- | ---------------------------------------- |
| Partner | Partner     | Full partner entity from database | `packages/types/src/partner/entities/`   |
| Partner | PartnerPost | DTO for creating new partners     | `packages/types/src/partner/entities/`   |
| Partner | PartnerPut  | DTO for updating partners         | `packages/types/src/partner/entities/`   |

---

### shops

| Entity | Type Name | Description                    | File                                   |
| ------ | --------- | ------------------------------ | -------------------------------------- |
| Shop   | Shop      | Full shop entity from database | `packages/types/src/partner/entities/` |
| Shop   | ShopPost  | DTO for creating new shops     | `packages/types/src/partner/entities/` |
| Shop   | ShopPut   | DTO for updating shops         | `packages/types/src/partner/entities/` |

---

### shop_working_hours

| Entity            | Type Name              | Description                                   | File                                   |
| ----------------- | ---------------------- | --------------------------------------------- | -------------------------------------- |
| ShopWorkingHours  | ShopWorkingHours       | Full shop working hours entity from database  | `src/db/models/ShopWorkingHours.ts`    |
| ShopWorkingHours  | ShopWorkingHoursPost   | DTO for creating shop working hours           | `src/db/models/ShopWorkingHours.ts`    |

---

### shop_special_hours

| Entity           | Type Name             | Description                                  | File                                   |
| ---------------- | --------------------- | -------------------------------------------- | -------------------------------------- |
| ShopSpecialHours | ShopSpecialHours      | Full shop special hours entity from database | `src/db/models/ShopSpecialHours.ts`    |
| ShopSpecialHours | ShopSpecialHoursPost  | DTO for creating shop special hours          | `src/db/models/ShopSpecialHours.ts`    |

---

### team

| Entity | Type Name | Description                    | File                                 |
| ------ | --------- | ------------------------------ | ------------------------------------ |
| Team   | Team      | Full team entity from database | `src/types/entities/team.type.ts`    |
| Team   | TeamPost  | DTO for creating new teams     | `src/types/entities/team.type.ts`    |
| Team   | TeamPut   | DTO for updating teams         | `src/types/entities/team.type.ts`    |

---

### team_member

| Entity     | Type Name       | Description                           | File                                        |
| ---------- | --------------- | ------------------------------------- | ------------------------------------------- |
| TeamMember | TeamMember      | Full team member entity from database | `src/types/entities/team-member.type.ts`    |
| TeamMember | TeamMemberPost  | DTO for creating new team members     | `src/types/entities/team-member.type.ts`    |
| TeamMember | TeamMemberPut   | DTO for updating team members         | `src/types/entities/team-member.type.ts`    |

---

### offerings

| Entity   | Type Name    | Description                        | File                                       |
| -------- | ------------ | ---------------------------------- | ------------------------------------------ |
| Offering | Offering     | Full offering entity from database | `packages/types/src/partner/entities/`     |
| Offering | OfferingPost | DTO for creating new offerings     | `packages/types/src/partner/entities/`     |
| Offering | OfferingPut  | DTO for updating offerings         | `packages/types/src/partner/entities/`     |

---

### company_media

| Entity       | Type Name         | Description                             | File                                        |
| ------------ | ----------------- | --------------------------------------- | ------------------------------------------- |
| CompanyMedia | CompanyMedia      | Full company media entity from database | `src/types/entities/company-media.type.ts`  |
| CompanyMedia | CompanyMediaPost  | DTO for creating company media          | `src/types/entities/company-media.type.ts`  |
| CompanyMedia | CompanyMediaPut   | DTO for updating company media          | `src/types/entities/company-media.type.ts`  |

---

### appointment

| Entity      | Type Name        | Description                            | File                                       |
| ----------- | ---------------- | -------------------------------------- | ------------------------------------------ |
| Appointment | Appointment      | Full appointment entity from database  | `src/types/entities/appointment.type.ts`   |
| Appointment | AppointmentPost  | DTO for creating new appointments      | `src/types/entities/appointment.type.ts`   |
| Appointment | AppointmentPut   | DTO for updating appointments          | `src/types/entities/appointment.type.ts`   |

---

### team_member_availability

| Entity       | Type Name         | Description                             | File                                       |
| ------------ | ----------------- | --------------------------------------- | ------------------------------------------ |
| Availability | Availability      | Full availability entity from database  | `src/types/entities/availability.type.ts`  |
| Availability | AvailabilityPost  | DTO for creating availability           | `src/types/entities/availability.type.ts`  |
| Availability | AvailabilityPut   | DTO for updating availability           | `src/types/entities/availability.type.ts`  |

---

## Additional API Types

Legacy types defined in `src/types/types.ts` for backward compatibility. New code should use entity types above.

---

## Enum Values

| Enum Name             | Values                                                      | Usage                  |
| --------------------- | ----------------------------------------------------------- | ---------------------- |
| BusinessTypeStatus    | `ACTIVE`, `INACTIVE`                                        | Business type status   |
| PartnerStatus         | `ACTIVE`, `INACTIVE`, `SUSPENDED`                           | Partner account status |
| ShopStatus            | `ONLINE`, `OFFLINE`, `MAINTENANCE`                          | Shop status            |
| TeamStatus            | `ACTIVE`, `INACTIVE`                                        | Team status            |
| OfferingStatus        | `ACTIVE`, `INACTIVE`                                        | Offering status        |
| BookingAlgorithm      | `DIRECT_TO_TEAM_MEMBER`, `ROUND_ROBIN`, `LOAD_BALANCING`   | Booking assignment     |
| MediaType             | `LOGO`, `COVER`, `GALLERY`                                  | Company media type     |
| AppointmentStatus     | `PENDING`, `CONFIRMED`, `CANCELLED`, `COMPLETED`, `NO_SHOW` | Appointment status     |
| DayOfWeek             | `0-6` (Sunday-Saturday)                                     | Shop recurring hours   |
