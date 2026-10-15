export interface AdminMetrics {
  total_clients: number;
  verified_lawyers: number;
  pending_kyc_applications: number;
  total_consultations: number;
  gross_merchandise_value: string;
  platform_net_revenue: string;
}

export interface LawyerVerification {
  id: string;
  lawyer_id: string;
  full_name: string;
  bar_council_number: string;
  state_bar_council: string;
  city: string;
  experience_years: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  submitted_at: string;
  bar_council_id_front_url?: string;
  bar_council_id_back_url?: string;
  degree_certificate_url?: string;
  rejection_reason?: string;
}

export interface AdminUser {
  id: string;
  phone_number: string;
  email?: string;
  role: 'CLIENT' | 'LAWYER' | 'ADMIN' | 'SUPPORT';
  is_active: boolean;
  created_at: string;
  full_name: string;
  city: string;
}

export interface AdminBooking {
  id: string;
  booking_reference: string;
  client_id: string;
  lawyer_id: string;
  client_name: string;
  lawyer_name: string;
  consultation_mode: 'VIDEO' | 'AUDIO' | 'CHAT' | 'OFFLINE';
  status: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  scheduled_start: string;
  total_amount: string;
  consultation_fee: string;
  platform_fee: string;
  created_at: string;
}

export interface AdminPayout {
  id: string;
  lawyer_id: string;
  lawyer_name: string;
  bar_council_number: string;
  lawyer_phone: string;
  amount: string;
  bank_account_number: string;
  bank_ifsc_code: string;
  status: 'REQUESTED' | 'PROCESSING' | 'PAID' | 'REJECTED';
  bank_reference_utr?: string;
  processed_at?: string;
  created_at: string;
}

export interface AdvocateScore {
  user_id: string;
  full_name: string;
  bar_council_number: string;
  city: string;
  experience_years: number;
  rating_average: string;
  rating_count: number;
  verification_status: string;
  total_bookings: number;
  completed_bookings: number;
  cancelled_bookings: number;
}

export interface FinanceLedger {
  gmv: string;
  platform_commission: string;
  convenience_fees: string;
  net_platform_revenue: string;
  gst_collected: string;
  escrow_locked: string;
  total_withdrawn_by_advocates: string;
}

export interface AdminDispute {
  id: string;
  appointment_id?: string;
  client_name: string;
  lawyer_name?: string;
  issue_type: string;
  description: string;
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED_REFUNDED' | 'RESOLVED_REJECTED' | 'CLOSED';
  created_at: string;
}

export interface PlatformSettings {
  platform_commission_rate: number;
  convenience_fee: number;
  gst_rate: number;
  consultation_buffer_minutes: number;
  instant_call_max_radius_km: number;
  emergency_sos_enabled: boolean;
  maintenance_mode: boolean;
  bar_council_compliance_mode: string;
}

export interface AuditLog {
  id: string;
  actor_id: string;
  actor_phone?: string;
  actor_role: string;
  action: string;
  target_entity: string;
  target_entity_id?: string;
  after_state?: any;
  created_at: string;
}
