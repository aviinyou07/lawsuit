import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { AuthNavigator } from './AuthNavigator';
import { ClientTabNavigator } from './ClientTabNavigator';
import { LawyerListingScreen } from '../screens/client/LawyerListingScreen';
import { LawyerProfileScreen } from '../screens/client/LawyerProfileScreen';
import { ConsultationTypeScreen } from '../screens/client/ConsultationTypeScreen';
import { SlotSelectionScreen } from '../screens/client/SlotSelectionScreen';
import { BookingSummaryScreen } from '../screens/client/BookingSummaryScreen';
import { BookingConfirmationScreen } from '../screens/client/BookingConfirmationScreen';
import { ConsultationRoomScreen } from '../screens/client/ConsultationRoomScreen';
import { ReviewScreen } from '../screens/client/ReviewScreen';
import { DescribeProblemScreen } from '../screens/client/DescribeProblemScreen';
import { DocumentWorkspaceScreen } from '../screens/client/DocumentWorkspaceScreen';
import { MyCasesScreen } from '../screens/client/MyCasesScreen';
import { CaseDetailsScreen } from '../screens/client/CaseDetailsScreen';
import { VaultScreen } from '../screens/client/VaultScreen';
import { LawyerDashboardScreen } from '../screens/lawyer/LawyerDashboardScreen';
import { LawyerOnboardingScreen } from '../screens/lawyer/LawyerOnboardingScreen';
import { LawyerCalendarScreen } from '../screens/lawyer/LawyerCalendarScreen';
import { LawyerWalletScreen } from '../screens/lawyer/LawyerWalletScreen';
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
          <Stack.Screen name="Main" component={ClientTabNavigator} />
          <Stack.Screen name="LawyerListing" component={LawyerListingScreen} />
          <Stack.Screen name="LawyerProfile" component={LawyerProfileScreen} />
          <Stack.Screen name="ConsultationType" component={ConsultationTypeScreen} />
          <Stack.Screen name="SlotSelection" component={SlotSelectionScreen} />
          <Stack.Screen name="BookingSummary" component={BookingSummaryScreen} />
          <Stack.Screen name="BookingConfirmation" component={BookingConfirmationScreen} />
          <Stack.Screen
            name="ConsultationRoom"
            component={ConsultationRoomScreen}
            options={{ gestureEnabled: false }}
          />
          <Stack.Screen name="Review" component={ReviewScreen} />
          <Stack.Screen name="DescribeProblem" component={DescribeProblemScreen} />
          <Stack.Screen name="DocumentWorkspace" component={DocumentWorkspaceScreen} />
          <Stack.Screen name="MyCases" component={MyCasesScreen} />
          <Stack.Screen name="CaseDetails" component={CaseDetailsScreen} />
          <Stack.Screen name="Vault" component={VaultScreen} />
          <Stack.Screen name="LawyerDashboard" component={LawyerDashboardScreen} />
          <Stack.Screen name="LawyerOnboarding" component={LawyerOnboardingScreen} />
          <Stack.Screen name="LawyerCalendar" component={LawyerCalendarScreen} />
          <Stack.Screen name="LawyerWallet" component={LawyerWalletScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};
