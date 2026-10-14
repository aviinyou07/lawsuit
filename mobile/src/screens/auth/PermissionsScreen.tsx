import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';

type Props = NativeStackScreenProps<AuthStackParamList, 'Permissions'>;

export const PermissionsScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.stepTag}>FINAL STEP</Text>
        <Text style={styles.title}>Enable Seamless Legal Assistance</Text>
        <Text style={styles.subtitle}>
          Grant permissions to discover lawyers in your local court jurisdiction and receive consultation alerts.
        </Text>
      </View>

      <View style={styles.cardsList}>
        <View style={styles.permCard}>
          <Text style={styles.cardIcon}>📍</Text>
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>Location Access</Text>
            <Text style={styles.cardDesc}>
              Matches you with advocates practicing in your local District, High Court, or consumer forum.
            </Text>
          </View>
        </View>

        <View style={styles.permCard}>
          <Text style={styles.cardIcon}>🔔</Text>
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>Appointment Notifications</Text>
            <Text style={styles.cardDesc}>
              Receive 15-minute consultation reminders, hearing alerts, and lawyer message updates.
            </Text>
          </View>
        </View>

        <View style={styles.permCard}>
          <Text style={styles.cardIcon}>🔒</Text>
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>Privacy Guarantee</Text>
            <Text style={styles.cardDesc}>
              All communications and case files are encrypted with strict attorney-client privilege.
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => {
            // The RootNavigator will automatically transition to Main when isAuthenticated is true
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryButtonText}>Enable & Enter App</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => {
            // Skip
          }}
        >
          <Text style={styles.skipButtonText}>Skip for Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  header: {
    marginBottom: 24,
  },
  stepTag: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.accent,
    letterSpacing: 1,
    marginBottom: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 20,
  },
  cardsList: {
    gap: 16,
  },
  permCard: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  cardIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 18,
  },
  footer: {
    gap: 12,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  skipButton: {
    alignSelf: 'center',
    paddingVertical: 8,
  },
  skipButtonText: {
    fontSize: 14,
    color: colors.textMuted,
    fontWeight: '600',
  },
});
