// Request/Response types for Partner Service
// These types are used by the service layer and stay in the service package

// Partner types
export interface CreatePartnerRequest {
  externalUid: string;
  companyName: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  email?: string;
  website?: string;
}

export interface SearchPartnersRequest {
  latitude?: number;
  longitude?: number;
  radius?: number; // in kilometers
  serviceId?: string;
  city?: string;
  limit?: number;
  offset?: number;
}

// TeamMember types
export interface CreateTeamMemberRequest {
  teamId: string;
  userId: string;
  role?: string;
}

// Service types
export interface CreateServiceRequest {
  partnerId: string;
  name: string;
  description?: string;
  durationMinutes: number;
  price: number;
  currency?: string;
}

export interface UpdateServiceRequest {
  name?: string;
  description?: string;
  durationMinutes?: number;
  price?: number;
  currency?: string;
  status?: string;
}

// TeamService types
export interface CreateTeamServiceRequest {
  teamId: string;
  serviceId: string;
}

// CompanyMedia types
export interface CreateCompanyMediaRequest {
  partnerId: string;
  url: string;
  type: string;
  displayOrder?: number;
  altText?: string;
}

export interface UpdateCompanyMediaRequest {
  displayOrder?: number;
  altText?: string;
}

// Appointment types
export interface CreateAppointmentRequest {
  customerUserId: string;
  teamMemberId: string;
  serviceId: string;
  appointmentDate: Date;
  startTime: string; // HH:MM
  durationMinutes: number;
  customerNotes?: string | null;
}

export interface UpdateAppointmentRequest {
  appointmentDate?: Date;
  startTime?: string;
  durationMinutes?: number;
  customerNotes?: string | null;
}

export interface UpdateAppointmentStatusRequest {
  status: string;
  cancellationReason?: string;
}

export interface CheckAvailabilityRequest {
  teamMemberId: string;
  appointmentDate: string;
  durationMinutes: number;
}

// TeamMemberAvailability types
export interface CreateAvailabilityRequest {
  teamMemberId: string;
  isRecurring: boolean;
  dayOfWeek?: number | null; // 0-6 for recurring
  specificDate?: Date | null; // for one-time
  startTime: string; // HH:MM
  endTime: string; // HH:MM
}

export interface UpdateAvailabilityRequest {
  startTime?: string;
  endTime?: string;
  isRecurring?: boolean;
  dayOfWeek?: number | null;
  specificDate?: Date | null;
}

export interface GetAvailableSlotsRequest {
  teamMemberId: string;
  date: string; // YYYY-MM-DD
  serviceId: string;
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  available: boolean;
}

// Shop types - MIGRATED to packages/types/src/partner/requests/shop.requests.ts
// Use: import type * as PBTypes from "@giusmento/pulcherbook-types";
// Then: PBTypes.partner.requests.shop.CreateShopRequest

// Profile Completion types
export interface ProfileCompletionResponse {
  isCompleted: boolean;
  missingFields?: string[];
}
