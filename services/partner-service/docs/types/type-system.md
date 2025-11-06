# Type System Documentation - Partner Service

This document describes all TypeScript types used in the Partner Service.

## Entity Types

| Entity                 | Type Name              | Description                      | File                                      |
| ---------------------- | ---------------------- | -------------------------------- | ----------------------------------------- |
| Partner                | Partner                | Partner/company entity           | `src/db/models/Partner.ts`                |
| Team                   | Team                   | Team entity                      | `src/db/models/Team.ts`                   |
| TeamMember             | TeamMember             | Team member entity               | `src/db/models/TeamMember.ts`             |
| Service                | Service                | Service entity                   | `src/db/models/Service.ts`                |
| TeamService            | TeamService            | Team-service assignment entity   | `src/db/models/TeamService.ts`            |
| CompanyMedia           | CompanyMedia           | Company media entity             | `src/db/models/CompanyMedia.ts`           |
| Appointment            | Appointment            | Appointment booking entity       | `src/db/models/Appointment.ts`            |
| TeamMemberAvailability | TeamMemberAvailability | Team member availability entity  | `src/db/models/TeamMemberAvailability.ts` |

## Request/Response DTOs

| Category     | Type Name                      | Description                         | File                 |
| ------------ | ------------------------------ | ----------------------------------- | -------------------- |
| Partner      | CreatePartnerRequest           | DTO for creating partners           | `src/types/types.ts` |
| Partner      | UpdatePartnerRequest           | DTO for updating partners           | `src/types/types.ts` |
| Partner      | SearchPartnersRequest          | DTO for searching partners          | `src/types/types.ts` |
| Team         | CreateTeamRequest              | DTO for creating teams              | `src/types/types.ts` |
| Team         | UpdateTeamRequest              | DTO for updating teams              | `src/types/types.ts` |
| TeamMember   | CreateTeamMemberRequest        | DTO for adding team members         | `src/types/types.ts` |
| Service      | CreateServiceRequest           | DTO for creating services           | `src/types/types.ts` |
| Service      | UpdateServiceRequest           | DTO for updating services           | `src/types/types.ts` |
| TeamService  | CreateTeamServiceRequest       | DTO for assigning services to teams | `src/types/types.ts` |
| CompanyMedia | CreateCompanyMediaRequest      | DTO for adding company media        | `src/types/types.ts` |
| CompanyMedia | UpdateCompanyMediaRequest      | DTO for updating media metadata     | `src/types/types.ts` |
| Appointment  | CreateAppointmentRequest       | DTO for booking appointments        | `src/types/types.ts` |
| Appointment  | UpdateAppointmentRequest       | DTO for updating appointments       | `src/types/types.ts` |
| Appointment  | UpdateAppointmentStatusRequest | DTO for updating appointment status | `src/types/types.ts` |
| Appointment  | CheckAvailabilityRequest       | DTO for checking availability       | `src/types/types.ts` |
| Availability | CreateAvailabilityRequest      | DTO for creating availability       | `src/types/types.ts` |
| Availability | UpdateAvailabilityRequest      | DTO for updating availability       | `src/types/types.ts` |
| Availability | GetAvailableSlotsRequest       | DTO for getting available slots     | `src/types/types.ts` |
| Availability | TimeSlot                       | Response type for time slots        | `src/types/types.ts` |

## Enum Values

| Enum Name         | Values                                                      | Usage                  |
| ----------------- | ----------------------------------------------------------- | ---------------------- |
| PartnerStatus     | `ACTIVE`, `INACTIVE`, `SUSPENDED`                           | Partner account status |
| TeamStatus        | `ACTIVE`, `INACTIVE`                                        | Team status            |
| ServiceStatus     | `ACTIVE`, `INACTIVE`                                        | Service status         |
| MediaType         | `LOGO`, `COVER`, `GALLERY`                                  | Company media type     |
| AppointmentStatus | `PENDING`, `CONFIRMED`, `CANCELLED`, `COMPLETED`, `NO_SHOW` | Appointment status     |
| DayOfWeek         | `0-6` (Sunday-Saturday)                                     | Recurring availability |
