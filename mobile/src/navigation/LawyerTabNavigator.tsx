import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LawyerDashboardScreen } from '../screens/lawyer/LawyerDashboardScreen';
import { LawyerRequestsScreen } from '../screens/lawyer/LawyerRequestsScreen';
import { LawyerCasesScreen } from '../screens/lawyer/LawyerCasesScreen';
import { LawyerCalendarScreen } from '../screens/lawyer/LawyerCalendarScreen';
import { LawyerProfileEditScreen } from '../screens/lawyer/LawyerProfileEditScreen';
import { colors } from '../theme/colors';

export type LawyerTabParamList = {
  LawyerHomeTab: undefined;
  LawyerRequestsTab: undefined;
  LawyerCasesTab: undefined;
  LawyerCalendarTab: undefined;
  LawyerProfileTab: undefined;
};

const Tab = createBottomTabNavigator<LawyerTabParamList>();

export const LawyerTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderColor: colors.border,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
        },
      }}
    >
      <Tab.Screen
        name="LawyerHomeTab"
        component={LawyerDashboardScreen}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>📊</Text>,
        }}
      />
      <Tab.Screen
        name="LawyerRequestsTab"
        component={LawyerRequestsScreen}
        options={{
          tabBarLabel: 'Requests',
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>📥</Text>,
        }}
      />
      <Tab.Screen
        name="LawyerCasesTab"
        component={LawyerCasesScreen}
        options={{
          tabBarLabel: 'Court Diary',
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>⚖️</Text>,
        }}
      />
      <Tab.Screen
        name="LawyerCalendarTab"
        component={LawyerCalendarScreen}
        options={{
          tabBarLabel: 'Schedule',
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>📅</Text>,
        }}
      />
      <Tab.Screen
        name="LawyerProfileTab"
        component={LawyerProfileEditScreen}
        options={{
          tabBarLabel: 'Practice',
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>👨‍⚖️</Text>,
        }}
      />
    </Tab.Navigator>
  );
};
