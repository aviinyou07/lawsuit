import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';
import { apiClient } from '../../api/client';
import {
  ArrowLeft,
  ShieldCheck,
  CreditCard,
  QrCode,
  Building,
  Tag,
  CheckCircle2,
} from 'lucide-react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'Payment'>;

export const PaymentScreen: React.FC<Props> = ({ navigation, route }) => {
  const { lawyer, mode, scheduled_start, fee } = route.params;

  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'NETBANKING'>('UPI');
  const [couponCode, setCouponCode] = useState('LAWSUIT100');
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [loading, setLoading] = useState(false);

  const platformFee = 99;
  const subtotal = fee + platformFee;
  const gstAmount = Math.round(subtotal * 0.18);
  const grossTotal = subtotal + gstAmount;
  const finalPayable = Math.max(0, grossTotal - discount);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;

    try {
      setApplyingCoupon(true);
      const res = await apiClient.post('/payments/apply-coupon', {
        coupon_code: couponCode,
        total_amount: grossTotal,
      });

      if (res.data.success) {
        setDiscount(res.data.data.discount_amount);
        setCouponApplied(true);
        Alert.alert('Coupon Applied', res.data.message);
      }
    } catch (err: any) {
      Alert.alert('Coupon Error', err.response?.data?.message || 'Invalid coupon code');
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleConfirmPayment = async () => {
    try {
      setLoading(true);
      const res = await apiClient.post('/bookings/create', {
        lawyer_id: lawyer.user_id || (lawyer as any).id,
        consultation_mode: mode,
        scheduled_start,
        client_case_brief: 'Booked via mobile checkout',
      });

      if (res.data.success) {
        const apt = res.data.data.appointment;
        navigation.navigate('BookingConfirmation', {
          appointment_id: apt.id,
          booking_reference: apt.booking_reference,
          lawyer_name: lawyer.full_name,
          scheduled_start,
        });
      }
    } catch (err: any) {
      Alert.alert('Payment Failed', err.response?.data?.message || 'Could not complete booking transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Secure Checkout</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Booking Summary Mini Card */}
        <View style={styles.miniCard}>
          <Text style={styles.miniLabel}>CONSULTATION WITH</Text>
          <Text style={styles.miniName}>{lawyer.full_name}</Text>
          <Text style={styles.miniDetails}>
            {mode} Mode • {new Date(scheduled_start).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
          </Text>
        </View>

        {/* Payment Methods */}
        <Text style={styles.sectionTitle}>Select Payment Method</Text>

        <TouchableOpacity
          style={[styles.methodCard, paymentMethod === 'UPI' && styles.selectedMethod]}
          onPress={() => setPaymentMethod('UPI')}
        >
          <View style={styles.methodLeft}>
            <QrCode size={22} color={paymentMethod === 'UPI' ? colors.primary : colors.textMuted} />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.methodTitle}>UPI (Instant & Zero Fee)</Text>
              <Text style={styles.methodSubtitle}>Google Pay, PhonePe, Paytm, BHIM</Text>
            </View>
          </View>
          {paymentMethod === 'UPI' && <CheckCircle2 size={20} color={colors.primary} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.methodCard, paymentMethod === 'CARD' && styles.selectedMethod]}
          onPress={() => setPaymentMethod('CARD')}
        >
          <View style={styles.methodLeft}>
            <CreditCard size={22} color={paymentMethod === 'CARD' ? colors.primary : colors.textMuted} />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.methodTitle}>Credit / Debit Card</Text>
              <Text style={styles.methodSubtitle}>Visa, MasterCard, RuPay, Amex</Text>
            </View>
          </View>
          {paymentMethod === 'CARD' && <CheckCircle2 size={20} color={colors.primary} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.methodCard, paymentMethod === 'NETBANKING' && styles.selectedMethod]}
          onPress={() => setPaymentMethod('NETBANKING')}
        >
          <View style={styles.methodLeft}>
            <Building size={22} color={paymentMethod === 'NETBANKING' ? colors.primary : colors.textMuted} />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.methodTitle}>Net Banking</Text>
              <Text style={styles.methodSubtitle}>HDFC, ICICI, SBI, Axis & 50+ banks</Text>
            </View>
          </View>
          {paymentMethod === 'NETBANKING' && <CheckCircle2 size={20} color={colors.primary} />}
        </TouchableOpacity>

        {/* Coupon Code Section */}
        <Text style={styles.sectionTitle}>Offers & Promo Code</Text>
        <View style={styles.couponRow}>
          <View style={styles.couponInputWrapper}>
            <Tag size={18} color={colors.textMuted} style={{ marginRight: 8 }} />
            <TextInput
              style={styles.couponInput}
              placeholder="Enter coupon (e.g. LAW100)"
              placeholderTextColor={colors.textLight}
              autoCapitalize="characters"
              value={couponCode}
              onChangeText={setCouponCode}
            />
          </View>
          <TouchableOpacity
            style={styles.applyBtn}
            onPress={handleApplyCoupon}
            disabled={applyingCoupon}
          >
            {applyingCoupon ? (
              <ActivityIndicator color={colors.white} size="small" />
            ) : (
              <Text style={styles.applyBtnText}>{couponApplied ? 'Applied' : 'Apply'}</Text>
            )}
          </TouchableOpacity>
        </View>

        {couponApplied && (
          <Text style={styles.couponSuccess}>✓ Discount of ₹{discount} successfully applied!</Text>
        )}

        {/* Price Breakdown */}
        <View style={styles.billBox}>
          <Text style={styles.billTitle}>Tax Invoice Breakdown (SAC 998211)</Text>

          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Consultation Fee</Text>
            <Text style={styles.billVal}>₹{fee.toFixed(2)}</Text>
          </View>

          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Platform Convenience Fee</Text>
            <Text style={styles.billVal}>₹{platformFee.toFixed(2)}</Text>
          </View>

          <View style={styles.billRow}>
            <Text style={styles.billLabel}>GST (18% Integrated)</Text>
            <Text style={styles.billVal}>₹{gstAmount.toFixed(2)}</Text>
          </View>

          {discount > 0 && (
            <View style={styles.billRow}>
              <Text style={[styles.billLabel, { color: colors.secondary }]}>Promo Discount</Text>
              <Text style={[styles.billVal, { color: colors.secondary }]}>-₹{discount.toFixed(2)}</Text>
            </View>
          )}

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Payable</Text>
            <Text style={styles.totalVal}>₹{finalPayable.toFixed(2)}</Text>
          </View>
        </View>

        {/* Security badge */}
        <View style={styles.trustBadge}>
          <ShieldCheck size={18} color={colors.secondary} style={{ marginRight: 8 }} />
          <Text style={styles.trustText}>
            256-Bit Encrypted Escrow. Payment held securely until consultation concludes.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.payBtn}
          onPress={handleConfirmPayment}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.payBtnText}>
              Pay ₹{finalPayable.toFixed(2)} & Confirm Appointment
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderDark,
  },
  backBtn: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  container: {
    padding: 20,
  },
  miniCard: {
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderDark,
    marginBottom: 24,
  },
  miniLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 0.8,
  },
  miniName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginVertical: 4,
  },
  miniDetails: {
    fontSize: 13,
    color: colors.textMuted,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderDark,
    marginBottom: 10,
  },
  selectedMethod: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(37, 99, 235, 0.08)',
  },
  methodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  methodTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  methodSubtitle: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  couponRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 6,
  },
  couponInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderDark,
    paddingHorizontal: 12,
  },
  couponInput: {
    flex: 1,
    paddingVertical: 12,
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  applyBtn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyBtnText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  couponSuccess: {
    fontSize: 12,
    color: colors.secondary,
    fontWeight: '600',
    marginBottom: 16,
  },
  billBox: {
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.borderDark,
    marginTop: 14,
    marginBottom: 16,
  },
  billTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMuted,
    marginBottom: 14,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  billLabel: {
    fontSize: 14,
    color: colors.textMuted,
  },
  billVal: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderDark,
    marginVertical: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  totalVal: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primary,
  },
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
  },
  trustText: {
    flex: 1,
    fontSize: 12,
    color: colors.secondary,
    lineHeight: 16,
  },
  payBtn: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 30,
  },
  payBtnText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
});
