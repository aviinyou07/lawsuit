import { NavigatorScreenParams } from '@react-navigation/native';
import { Lawyer, ConsultationMode } from '../types';

export type AuthStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  Login: { role?: 'CLIENT' | 'LAWYER' };
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
  LawyerListing: { category_id?: string; category_name?: string; search_query?: string };
  LawyerProfile: { lawyer_id: string; lawyer?: Lawyer };
  ConsultationType: { lawyer: Lawyer };
  SlotSelection: { lawyer: Lawyer; mode: ConsultationMode; fee: number };
  BookingSummary: { lawyer: Lawyer; mode: ConsultationMode; scheduled_start: string; fee: number };
  BookingConfirmation: { appointment_id: string; booking_reference: string; lawyer_name: string; scheduled_start: string };
  ConsultationRoom: { appointment_id: string };
  Review: { appointment_id: string; lawyer_name: string };
  DescribeProblem: undefined;
  SuggestedService: { problem_text: string };
  DocumentWorkspace: { order_id: string };
  MyCases: undefined;
  CaseDetails: { case_id: string };
  Vault: undefined;
  LawyerDashboard: undefined;
  LawyerOnboarding: undefined;
  LawyerCalendar: undefined;
  LawyerWallet: undefined;
};
