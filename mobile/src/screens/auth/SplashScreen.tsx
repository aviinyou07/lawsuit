import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';
import { useAuthStore } from '../../store/authStore';

type Props = NativeStackScreenProps<AuthStackParamList, 'Splash'>;

export const SplashScreen: React.FC<Props> = ({ navigation }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isAuthenticated) {
        navigation.replace('Welcome');
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [isAuthenticated, navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <View style={styles.iconCircle}>
          <Text style={styles.iconText}>⚖️</Text>
        </View>
        <Text style={styles.title}>LAWSUIT</Text>
        <Text style={styles.subtitle}>Trusted Legal Guidance, Anytime, Anywhere</Text>
      </View>
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={colors.secondary} />
        <Text style={styles.footerText}>Connecting to verified advocate network...</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryDark,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  logoContainer: {
    alignItems: 'center',
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: 'rgba(217, 119, 6, 0.15)',
    borderWidth: 2,
    borderColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconText: {
    fontSize: 42,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.white,
    letterSpacing: 4,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    maxWidth: 260,
  },
  footer: {
    position: 'absolute',
    bottom: 48,
    alignItems: 'center',
    gap: 8,
  },
  footerText: {
    fontSize: 12,
    color: colors.textMuted,
  },
});
