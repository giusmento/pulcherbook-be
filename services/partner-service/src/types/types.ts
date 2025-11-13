// Request/Response types for Partner Service

// Partner types
export interface CreatePartnerRequest {
  external_uid: string;
  company_name: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  email?: string;
  website?: string;
}

export interface UpdatePartnerRequest {
  company_name?: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  email?: string;
  website?: string;
  status?: string;
}

export interface SearchPartnersRequest {
  latitude?: number;
  longitude?: number;
  radius?: number; // in kilometers
  service_id?: string;
  city?: string;
  limit?: number;
  offset?: number;
}

// Team types
export interface CreateTeamRequest {
  partner_id: string;
  name: string;
  description?: string;
}

export interface UpdateTeamRequest {
  name?: string;
  description?: string;
  status?: string;
}

// TeamMember types
export interface CreateTeamMemberRequest {
  team_id: string;
  user_id: string;
  role?: string;
}

// Service types
export interface CreateServiceRequest {
  partner_id: string;
  name: string;
  description?: string;
  duration_minutes: number;
  price: number;
  currency?: string;
}

export interface UpdateServiceRequest {
  name?: string;
  description?: string;
  duration_minutes?: number;
  price?: number;
  currency?: string;
  status?: string;
}

// TeamService types
export interface CreateTeamServiceRequest {
  team_id: string;
  service_id: string;
}

// CompanyMedia types
export interface CreateCompanyMediaRequest {
  partner_id: string;
  url: string;
  type: string;
  display_order?: number;
  alt_text?: string;
}

export interface UpdateCompanyMediaRequest {
  display_order?: number;
  alt_text?: string;
}

// Appointment types
export interface CreateAppointmentRequest {
  customer_user_id: string;
  team_member_id: string;
  service_id: string;
  appointment_date: string; // YYYY-MM-DD
  start_time: string; // HH:MM
  duration_minutes: number;
  customer_notes?: string;
}

export interface UpdateAppointmentRequest {
  appointment_date?: string;
  start_time?: string;
  duration_minutes?: number;
  customer_notes?: string;
}

export interface UpdateAppointmentStatusRequest {
  status: string;
  cancellation_reason?: string;
}

export interface CheckAvailabilityRequest {
  team_member_id: string;
  appointment_date: string;
  duration_minutes: number;
}

// TeamMemberAvailability types
export interface CreateAvailabilityRequest {
  team_member_id: string;
  is_recurring: boolean;
  day_of_week?: number; // 0-6 for recurring
  specific_date?: string; // YYYY-MM-DD for one-time
  start_time: string; // HH:MM
  end_time: string; // HH:MM
}

export interface UpdateAvailabilityRequest {
  start_time?: string;
  end_time?: string;
  is_recurring?: boolean;
  day_of_week?: number;
  specific_date?: string;
}

export interface GetAvailableSlotsRequest {
  team_member_id: string;
  date: string; // YYYY-MM-DD
  service_id: string;
}

export interface TimeSlot {
  start_time: string;
  end_time: string;
  available: boolean;
}

// Profile Completion types
export interface ProfileCompletionResponse {
  isCompleted: boolean;
  missingFields?: string[];
}
