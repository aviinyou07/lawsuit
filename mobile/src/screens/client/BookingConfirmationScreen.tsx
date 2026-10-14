import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'BookingConfirmation'>;

export const BookingConfirmationScreen: React.FC<Props> = ({ navigation, route }) => {
  const { appointment_id, booking_reference, lawyer_name, scheduled_start } = route.params;

  const formattedDate = new Date(scheduled_start).toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.topIconCircle}>
        <Text style={styles.checkIcon}>✓</Text>
      </View>

      <Text style={styles.title}>Consultation Confirmed!</Text>
      <Text style={styles.subtitle}>
        Your appointment with {lawyer_name} has been booked and synced to your schedule.
      </Text>

      {/* Booking Details Card */}
      <View style={styles.card}>
        <View style={styles.refRow}>
          <Text style={styles.refLabel}>Booking Reference</Text>
          <Text style={styles.refValue}>{booking_reference}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Advocate</Text>
          <Text style={styles.detailValue}>{lawyer_name}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Time & Date</Text>
          <Text style={styles.detailValue}>{formattedDate} IST</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Status</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>CONFIRMED</Text>
          </View>
        </View>
      </View>

      {/* Preparation Guidelines */}
      <View style={styles.guideCard}>
        <Text style={styles.guideTitle}>💡 Preparation Checklist</Text>
        <Text style={styles.guideItem}>• Keep relevant legal notices, contracts or receipts ready for screen sharing.</Text>
        <Text style={styles.guideItem}>• Ensure a quiet environment with stable internet connectivity.</Text>
        <Text style={styles.guideItem}>• The consultation room unlocks 10 minutes prior to scheduled start.</Text>
      </View>

      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={styles.roomBtn}
          onPress={() => navigation.navigate('ConsultationRoom', { appointment_id })}
        >
          <Text style={styles.roomBtnText}>Go to Consultation Room 📹</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.homeBtn}
          onPress={() => navigation.navigate('Main', { screen: 'HomeTab' })}
        >
          <Text style={styles.homeBtnText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.surface,
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
    alignItems: 'center',
  },
  topIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ECFDF5',
    borderWidth: 2,
    borderColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkIcon: {
    fontSize: 40,
    color: colors.accent,
    fontWeight: '800',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 28,
  },
  card: {
    width: '100%',
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 20,
    gap: 12,
  },
  refRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  refLabel: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '600',
  },
  refValue: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 13,
    color: colors.textMuted,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  statusBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.accent,
  },
  guideCard: {
    width: '100%',
    backgroundColor: '#FEF3C7',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginBottom: 32,
    gap: 6,
  },
  guideTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#92400E',
    marginBottom: 4,
  },
  guideItem: {
    fontSize: 12,
    color: '#78350F',
    lineHeight: 18,
  },
  actionContainer: {
    width: '100%',
    gap: 12,
  },
  roomBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  roomBtnText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  homeBtn: {
    backgroundColor: 'transparent',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderDark,
  },
  homeBtnText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
});
