import { NavigatorScreenParams } from '@react-navigation/native';
import { Lawyer, ConsultationMode } from '../types';

export type AuthStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  Login: { role?: 'CLIENT' | 'LAWYER' | 'ADMIN' };
  ProfileSetup: undefined;
  Permissions: undefined;
};

export type ClientTabParamList = {
  HomeTab: undefined;
  SearchTab: { category_id?: string; category_name?: string } | undefined;
  ConsultationsTab: undefined;
  ServicesTab: undefined;
  ProfileTab: undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<ClientTabParamList>;
  
  // Home & Discovery (Screens 06-12)
  Categories: undefined;
  LawyerListing: { category_id?: string; category_name?: string; search_query?: string };
  LawyerProfile: { lawyer_id: string; lawyer?: Lawyer };
  Shortlist: undefined;

  // Consultation Booking (Screens 13-20)
  ConsultationType: { lawyer: Lawyer };
  SlotSelection: { lawyer: Lawyer; mode: ConsultationMode; fee: number };
  BookingSummary: { lawyer: Lawyer; mode: ConsultationMode; scheduled_start: string; fee: number };
  Payment: { lawyer: Lawyer; mode: ConsultationMode; scheduled_start: string; fee: number; quote?: any };
  BookingConfirmation: { appointment_id: string; booking_reference: string; lawyer_name: string; scheduled_start: string };
  ConsultationRoom: { appointment_id: string };
  Review: { appointment_id: string; lawyer_name: string };

  // Legal Problem & Services (Screens 21-28)
  DescribeProblem: undefined;
  ProblemDetails: { initial_problem?: string };
  SuggestedService: { problem_text: string; category?: string; urgency?: string };
  DocumentRequest: { service_id?: string; service_title?: string; base_fee?: number };
  DocumentQuote: { service_id?: string; service_title?: string; base_fee?: number; requirements?: string };
  DocumentWorkspace: { order_id: string };
  LegalNotice: undefined;

  // Case & Account (Screens 29-35)
  MyCases: undefined;
  CaseDetails: { case_id: string };
  Vault: undefined;
  Notifications: undefined;
  PaymentHistory: undefined;
  HelpSupport: undefined;

  // Lawyer App / Panel (Screens 36-46)
  LawyerDashboard: undefined;
  LawyerOnboarding: undefined;
  LawyerProfileEdit: undefined;
  LawyerCalendar: undefined;
  LawyerRequests: undefined;
  LawyerAppointmentDetail: { appointment_id: string };
  LawyerClients: undefined;
  LawyerChat: { appointment_id: string; client_name: string };
  LawyerCases: undefined;
  LawyerWallet: undefined;
  LawyerAnalytics: undefined;

  // Admin Panel (Screens 47-58)
  AdminConsole: undefined;
};
