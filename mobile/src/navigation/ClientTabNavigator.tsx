import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ClientTabParamList } from './types';
import { HomeScreen } from '../screens/client/HomeScreen';
import { SearchScreen } from '../screens/client/SearchScreen';
import { MyConsultationsScreen } from '../screens/client/MyConsultationsScreen';
import { DocumentServicesScreen } from '../screens/client/DocumentServicesScreen';
import { SettingsScreen } from '../screens/client/SettingsScreen';
import { colors } from '../theme/colors';

const Tab = createBottomTabNavigator<ClientTabParamList>();

export const ClientTabNavigator: React.FC = () => {
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
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>🏛️</Text>,
        }}
      />
      <Tab.Screen
        name="SearchTab"
        component={SearchScreen}
        options={{
          tabBarLabel: 'Advocates',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>🔍</Text>,
        }}
      />
      <Tab.Screen
        name="ConsultationsTab"
        component={MyConsultationsScreen}
        options={{
          tabBarLabel: 'Bookings',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>📅</Text>,
        }}
      />
      <Tab.Screen
        name="ServicesTab"
        component={DocumentServicesScreen}
        options={{
          tabBarLabel: 'Drafting',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>📄</Text>,
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Account',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>👤</Text>,
        }}
      />
    </Tab.Navigator>
  );
};
