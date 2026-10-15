import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { AuthNavigator } from './AuthNavigator';
import { ClientTabNavigator } from './ClientTabNavigator';

// Client Screens (06-35)
import { CategoriesScreen } from '../screens/client/CategoriesScreen';
import { LawyerListingScreen } from '../screens/client/LawyerListingScreen';
import { LawyerProfileScreen } from '../screens/client/LawyerProfileScreen';
import { ShortlistScreen } from '../screens/client/ShortlistScreen';
import { ConsultationTypeScreen } from '../screens/client/ConsultationTypeScreen';
import { SlotSelectionScreen } from '../screens/client/SlotSelectionScreen';
import { BookingSummaryScreen } from '../screens/client/BookingSummaryScreen';
import { PaymentScreen } from '../screens/client/PaymentScreen';
import { BookingConfirmationScreen } from '../screens/client/BookingConfirmationScreen';
import { ConsultationRoomScreen } from '../screens/client/ConsultationRoomScreen';
import { ReviewScreen } from '../screens/client/ReviewScreen';
import { DescribeProblemScreen } from '../screens/client/DescribeProblemScreen';
import { ProblemDetailsScreen } from '../screens/client/ProblemDetailsScreen';
import { SuggestedServiceScreen } from '../screens/client/SuggestedServiceScreen';
import { DocumentRequestScreen } from '../screens/client/DocumentRequestScreen';
import { DocumentQuoteScreen } from '../screens/client/DocumentQuoteScreen';
import { DocumentWorkspaceScreen } from '../screens/client/DocumentWorkspaceScreen';
import { LegalNoticeScreen } from '../screens/client/LegalNoticeScreen';
import { MyCasesScreen } from '../screens/client/MyCasesScreen';
import { CaseDetailsScreen } from '../screens/client/CaseDetailsScreen';
import { VaultScreen } from '../screens/client/VaultScreen';
import { NotificationsScreen } from '../screens/client/NotificationsScreen';
import { PaymentHistoryScreen } from '../screens/client/PaymentHistoryScreen';
import { HelpSupportScreen } from '../screens/client/HelpSupportScreen';

// Lawyer Screens (36-46)
import { LawyerDashboardScreen } from '../screens/lawyer/LawyerDashboardScreen';
import { LawyerOnboardingScreen } from '../screens/lawyer/LawyerOnboardingScreen';
import { LawyerProfileEditScreen } from '../screens/lawyer/LawyerProfileEditScreen';
import { LawyerCalendarScreen } from '../screens/lawyer/LawyerCalendarScreen';
import { LawyerRequestsScreen } from '../screens/lawyer/LawyerRequestsScreen';
import { LawyerClientsScreen } from '../screens/lawyer/LawyerClientsScreen';
import { LawyerCasesScreen } from '../screens/lawyer/LawyerCasesScreen';
import { LawyerWalletScreen } from '../screens/lawyer/LawyerWalletScreen';
import { LawyerAnalyticsScreen } from '../screens/lawyer/LawyerAnalyticsScreen';

// Admin Console (47-58)
import { AdminConsoleScreen } from '../screens/admin/AdminConsoleScreen';

import { useAuthStore } from '../store/authStore';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      {!isAuthenticated ? (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      ) : (
        <>
          {/* Main Tabs */}
          <Stack.Screen name="Main" component={ClientTabNavigator} />

          {/* Discovery & Booking */}
          <Stack.Screen name="Categories" component={CategoriesScreen} />
          <Stack.Screen name="LawyerListing" component={LawyerListingScreen} />
          <Stack.Screen name="LawyerProfile" component={LawyerProfileScreen} />
          <Stack.Screen name="Shortlist" component={ShortlistScreen} />
          <Stack.Screen name="ConsultationType" component={ConsultationTypeScreen} />
          <Stack.Screen name="SlotSelection" component={SlotSelectionScreen} />
          <Stack.Screen name="BookingSummary" component={BookingSummaryScreen} />
          <Stack.Screen name="Payment" component={PaymentScreen} />
          <Stack.Screen name="BookingConfirmation" component={BookingConfirmationScreen} />
          <Stack.Screen
            name="ConsultationRoom"
            component={ConsultationRoomScreen}
            options={{ gestureEnabled: false }}
          />
          <Stack.Screen name="Review" component={ReviewScreen} />

          {/* Problem & Document Services */}
          <Stack.Screen name="DescribeProblem" component={DescribeProblemScreen} />
          <Stack.Screen name="ProblemDetails" component={ProblemDetailsScreen} />
          <Stack.Screen name="SuggestedService" component={SuggestedServiceScreen} />
          <Stack.Screen name="DocumentRequest" component={DocumentRequestScreen} />
          <Stack.Screen name="DocumentQuote" component={DocumentQuoteScreen} />
          <Stack.Screen name="DocumentWorkspace" component={DocumentWorkspaceScreen} />
          <Stack.Screen name="LegalNotice" component={LegalNoticeScreen} />

          {/* Case & Account */}
          <Stack.Screen name="MyCases" component={MyCasesScreen} />
          <Stack.Screen name="CaseDetails" component={CaseDetailsScreen} />
          <Stack.Screen name="Vault" component={VaultScreen} />
          <Stack.Screen name="Notifications" component={NotificationsScreen} />
          <Stack.Screen name="PaymentHistory" component={PaymentHistoryScreen} />
          <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />

          {/* Lawyer App */}
          <Stack.Screen name="LawyerDashboard" component={LawyerDashboardScreen} />
          <Stack.Screen name="LawyerOnboarding" component={LawyerOnboardingScreen} />
          <Stack.Screen name="LawyerProfileEdit" component={LawyerProfileEditScreen} />
          <Stack.Screen name="LawyerCalendar" component={LawyerCalendarScreen} />
          <Stack.Screen name="LawyerRequests" component={LawyerRequestsScreen} />
          <Stack.Screen name="LawyerClients" component={LawyerClientsScreen} />
          <Stack.Screen name="LawyerCases" component={LawyerCasesScreen} />
          <Stack.Screen name="LawyerWallet" component={LawyerWalletScreen} />
          <Stack.Screen name="LawyerAnalytics" component={LawyerAnalyticsScreen} />

          {/* Admin Command Center (Screens 47-58) */}
          <Stack.Screen name="AdminConsole" component={AdminConsoleScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};
