# Type System Documentation - Partner Service

This document describes all TypeScript types used in the Partner Service, following MangoJS standards.

## Entity Types

Types are organized per entity in `src/types/entities/`. Each entity has:
- Base type (full database entity)
- Post type (for creating new records)
- Put type (for updating existing records)

---

### partner

| Entity  | Type Name   | Description                       | File                                     |
| ------- | ----------- | --------------------------------- | ---------------------------------------- |
| Partner | Partner     | Full partner entity from database | `src/types/entities/partner.type.ts`     |
| Partner | PartnerPost | DTO for creating new partners     | `src/types/entities/partner.type.ts`     |
| Partner | PartnerPut  | DTO for updating partners         | `src/types/entities/partner.type.ts`     |

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

### service

| Entity  | Type Name   | Description                       | File                                    |
| ------- | ----------- | --------------------------------- | --------------------------------------- |
| Service | Service     | Full service entity from database | `src/types/entities/service.type.ts`    |
| Service | ServicePost | DTO for creating new services     | `src/types/entities/service.type.ts`    |
| Service | ServicePut  | DTO for updating services         | `src/types/entities/service.type.ts`    |

---

### team_service

| Entity      | Type Name        | Description                            | File                                       |
| ----------- | ---------------- | -------------------------------------- | ------------------------------------------ |
| TeamService | TeamService      | Full team service entity from database | `src/types/entities/team-service.type.ts`  |
| TeamService | TeamServicePost  | DTO for creating team-service links    | `src/types/entities/team-service.type.ts`  |
| TeamService | TeamServicePut   | DTO for updating team-service links    | `src/types/entities/team-service.type.ts`  |

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

| Enum Name         | Values                                                      | Usage                  |
| ----------------- | ----------------------------------------------------------- | ---------------------- |
| PartnerStatus     | `ACTIVE`, `INACTIVE`, `SUSPENDED`                           | Partner account status |
| TeamStatus        | `ACTIVE`, `INACTIVE`                                        | Team status            |
| ServiceStatus     | `ACTIVE`, `INACTIVE`                                        | Service status         |
| MediaType         | `LOGO`, `COVER`, `GALLERY`                                  | Company media type     |
| AppointmentStatus | `PENDING`, `CONFIRMED`, `CANCELLED`, `COMPLETED`, `NO_SHOW` | Appointment status     |
| DayOfWeek         | `0-6` (Sunday-Saturday)                                     | Recurring availability |
