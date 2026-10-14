import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';
import { apiClient } from '../../api/client';

type Props = NativeStackScreenProps<RootStackParamList, 'BookingSummary'>;

export const BookingSummaryScreen: React.FC<Props> = ({ navigation, route }) => {
  const { lawyer, mode, scheduled_start } = route.params;
  const [caseBrief, setCaseBrief] = useState('');
  const [quote, setQuote] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  const formattedDate = new Date(scheduled_start).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const formattedTime = new Date(scheduled_start).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  useEffect(() => {
    fetchQuote();
  }, []);

  const fetchQuote = async () => {
    try {
      setLoading(true);
      const res = await apiClient.post('/bookings/calculate-quote', {
        lawyer_id: lawyer.user_id,
        consultation_mode: mode,
      });

      if (res.data.success) {
        setQuote(res.data.data);
      }
    } catch (err: any) {
      console.error(err);
      Alert.alert('Error', 'Failed to calculate quote');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmBooking = async () => {
    try {
      setBookingLoading(true);
      const res = await apiClient.post('/bookings/create', {
        lawyer_id: lawyer.user_id,
        consultation_mode: mode,
        scheduled_start,
        client_case_brief: caseBrief.trim() || 'General legal consultation',
      });

      if (res.data.success) {
        const appt = res.data.data.appointment;
        navigation.replace('BookingConfirmation', {
          appointment_id: appt.id,
          booking_reference: appt.booking_reference,
          lawyer_name: lawyer.full_name,
          scheduled_start,
        });
      }
    } catch (err: any) {
      Alert.alert('Booking Error', err.response?.data?.message || 'Failed to complete booking');
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.stepTag}>STEP 3 OF 3</Text>
        <Text style={styles.title}>Booking & Payment Summary</Text>
        <Text style={styles.subtitle}>Review your appointment schedule and financial breakdown.</Text>

        {/* Lawyer & Schedule Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.cardHeaderTitle}>Consultation Schedule</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Advocate</Text>
            <Text style={styles.detailValue}>{lawyer.full_name}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Mode</Text>
            <Text style={styles.detailValue}>{mode} Consultation (20m)</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date</Text>
            <Text style={styles.detailValue}>{formattedDate}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Time</Text>
            <Text style={styles.detailValue}>{formattedTime} IST</Text>
          </View>
        </View>

        {/* Case Brief Input */}
        <View style={styles.briefSection}>
          <Text style={styles.sectionTitle}>Case Brief (Optional)</Text>
          <Text style={styles.sectionSubtitle}>
            Help {lawyer.full_name} prepare by describing your query in advance.
          </Text>
          <TextInput
            style={styles.briefInput}
            placeholder="e.g. Discussing lease agreement breach and security deposit return..."
            placeholderTextColor={colors.textLight}
            multiline
            numberOfLines={4}
            value={caseBrief}
            onChangeText={setCaseBrief}
          />
        </View>

        {/* Cost Breakdown */}
        {loading ? (
          <ActivityIndicator color={colors.primary} style={{ marginVertical: 20 }} />
        ) : quote ? (
          <View style={styles.costCard}>
            <Text style={styles.costTitle}>Payment Breakdown</Text>
            <View style={styles.costRow}>
              <Text style={styles.costLabel}>Advocate Consultation Fee</Text>
              <Text style={styles.costValue}>₹{quote.base_fee.toFixed(2)}</Text>
            </View>
            <View style={styles.costRow}>
              <Text style={styles.costLabel}>Platform Technology Fee</Text>
              <Text style={styles.costValue}>₹{quote.platform_fee.toFixed(2)}</Text>
            </View>
            <View style={styles.costRow}>
              <Text style={styles.costLabel}>GST (18%)</Text>
              <Text style={styles.costValue}>₹{quote.tax_amount.toFixed(2)}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.costRow}>
              <Text style={styles.totalLabel}>Total Payable</Text>
              <Text style={styles.totalValue}>₹{quote.total_amount.toFixed(2)}</Text>
            </View>

            <View style={styles.escrowBadge}>
              <Text style={styles.escrowBadgeText}>
                🛡️ 100% Escrow Protection: Funds held securely until your consultation concludes.
              </Text>
            </View>
          </View>
        ) : null}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.payBtn}
          onPress={handleConfirmBooking}
          disabled={bookingLoading || loading}
          activeOpacity={0.8}
        >
          {bookingLoading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.payBtnText}>
              Pay ₹{quote?.total_amount?.toFixed(2) || '...'} & Confirm Booking
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 54,
    paddingBottom: 110,
  },
  backBtn: {
    marginBottom: 16,
  },
  backBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primaryLight,
  },
  stepTag: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.secondary,
    letterSpacing: 1,
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: 20,
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
    gap: 10,
  },
  cardHeaderTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  briefSection: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 12,
  },
  briefInput: {
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.borderDark,
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    color: colors.text,
    textAlignVertical: 'top',
    height: 90,
  },
  costCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 10,
  },
  costTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  costLabel: {
    fontSize: 13,
    color: colors.textMuted,
  },
  costValue: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 4,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primary,
  },
  escrowBadge: {
    backgroundColor: '#ECFDF5',
    padding: 12,
    borderRadius: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  escrowBadgeText: {
    fontSize: 11,
    color: '#065F46',
    fontWeight: '600',
    lineHeight: 16,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderColor: colors.border,
  },
  payBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  payBtnText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
});
