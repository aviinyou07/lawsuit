export type UserRole = 'CLIENT' | 'LAWYER' | 'ADMIN' | 'SUPPORT';
export type ConsultationMode = 'CHAT' | 'AUDIO' | 'VIDEO' | 'OFFLINE';
export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW' | 'RESCHEDULED';

export interface User {
  id: string;
  phone_country_code: string;
  phone_number: string;
  email?: string;
  role: UserRole;
  is_phone_verified: boolean;
}

export interface ClientProfile {
  user_id: string;
  full_name: string;
  avatar_url?: string;
  city?: string;
  state?: string;
  pincode?: string;
  preferred_language: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon_url?: string;
  display_order: number;
  lawyer_count?: number;
  specializations?: Specialization[];
}

export interface Specialization {
  id: string;
  category_id: string;
  name: string;
  description?: string;
}

export interface Lawyer {
  user_id: string;
  full_name: string;
  avatar_url?: string;
  bar_council_number: string;
  state_bar_council: string;
  experience_years: number;
  bio?: string;
  qualification_summary?: string;
  city: string;
  state: string;
  languages?: string[];
  courts_of_practice?: string[];
  verification_status: 'UNSUBMITTED' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
  is_online_for_instant: boolean;
  rating_average: number;
  rating_count: number;
  consultation_fee_chat: number;
  consultation_fee_audio: number;
  consultation_fee_video: number;
  consultation_fee_offline: number;
  categories?: Array<{ id: string; name: string; slug: string }>;
}

export interface Appointment {
  id: string;
  booking_reference: string;
  client_id: string;
  lawyer_id: string;
  lawyer_name?: string;
  lawyer_avatar?: string;
  lawyer_city?: string;
  client_name?: string;
  consultation_mode: ConsultationMode;
  status: AppointmentStatus;
  scheduled_start: string;
  scheduled_end: string;
  client_case_brief?: string;
  consultation_fee: number;
  platform_fee: number;
  total_amount: number;
  agora_channel_name?: string;
  actual_duration_seconds?: number;
}

export interface DocumentService {
  id: string;
  slug: string;
  name: string;
  category_id?: string;
  category_name?: string;
  description: string;
  standard_price: number;
  delivery_sla_days: number;
  revisions_included: number;
}
