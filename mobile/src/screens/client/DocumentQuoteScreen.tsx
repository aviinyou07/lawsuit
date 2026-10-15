import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
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
  Clock,
  ShieldCheck,
  Award,
  FileCheck2,
} from 'lucide-react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'DocumentQuote'>;

export const DocumentQuoteScreen: React.FC<Props> = ({ navigation, route }) => {
  const serviceTitle = route.params?.service_title || 'Residential Rental Agreement';
  const baseFee = route.params?.base_fee || 1499;
  const requirements = route.params?.requirements || 'Standard terms agreement';

  const [expressDelivery, setExpressDelivery] = useState(false);
  const [loading, setLoading] = useState(false);

  const stampDuty = 500;
  const expressFee = expressDelivery ? 499 : 0;
  const subtotal = baseFee + stampDuty + expressFee;
  const gst = Math.round(subtotal * 0.18);
  const total = subtotal + gst;

  const handleCreateOrder = async () => {
    try {
      setLoading(true);
      const res = await apiClient.post('/documents/orders', {
        service_id: 'd1',
        requirements,
      });

      if (res.data.success) {
        const orderId = res.data.data.id;
        navigation.navigate('DocumentWorkspace', { order_id: orderId });
      }
    } catch (err: any) {
      Alert.alert('Order Failed', err.response?.data?.message || 'Could not initiate drafting order');
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
        <Text style={styles.headerTitle}>Order Summary & Quote</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Document Header */}
        <View style={styles.docCard}>
          <FileCheck2 size={24} color={colors.primary} />
          <View style={{ marginLeft: 14, flex: 1 }}>
            <Text style={styles.docTitle}>{serviceTitle}</Text>
            <Text style={styles.docSub}>Includes 2 Revision Cycles & Lawyer Verification</Text>
          </View>
        </View>

        {/* Assigned Counsel */}
        <Text style={styles.sectionTitle}>Drafting Legal Counsel</Text>
        <View style={styles.counselCard}>
          <Award size={22} color={colors.secondary} />
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={styles.counselName}>Adv. Rajesh Sharma</Text>
            <Text style={styles.counselSub}>Enrolled Advocate • 14 Years Bar Experience</Text>
          </View>
        </View>

        {/* Delivery Timeline */}
        <Text style={styles.sectionTitle}>Delivery Speed</Text>
        <View style={styles.deliveryRow}>
          <TouchableOpacity
            style={[styles.deliveryCard, !expressDelivery && styles.deliverySelected]}
            onPress={() => setExpressDelivery(false)}
          >
            <Clock size={18} color={!expressDelivery ? colors.primary : colors.textMuted} />
            <Text style={styles.deliveryTitle}>Standard (48h)</Text>
            <Text style={styles.deliverySub}>Free SLA</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.deliveryCard, expressDelivery && styles.deliverySelected]}
            onPress={() => setExpressDelivery(true)}
          >
            <Clock size={18} color={expressDelivery ? colors.primary : colors.textMuted} />
            <Text style={styles.deliveryTitle}>Express (24h)</Text>
            <Text style={styles.deliverySub}>+₹499 Priority</Text>
          </TouchableOpacity>
        </View>

        {/* Quote Breakdown */}
        <View style={styles.quoteBox}>
          <Text style={styles.quoteTitle}>Tax Invoice Estimation</Text>

          <View style={styles.quoteRow}>
            <Text style={styles.quoteLabel}>Advocate Drafting Fee</Text>
            <Text style={styles.quoteVal}>₹{baseFee.toFixed(2)}</Text>
          </View>

          <View style={styles.quoteRow}>
            <Text style={styles.quoteLabel}>State e-Stamp Certificate</Text>
            <Text style={styles.quoteVal}>₹{stampDuty.toFixed(2)}</Text>
          </View>

          {expressDelivery && (
            <View style={styles.quoteRow}>
              <Text style={styles.quoteLabel}>Express 24h Turnaround</Text>
              <Text style={styles.quoteVal}>₹{expressFee.toFixed(2)}</Text>
            </View>
          )}

          <View style={styles.quoteRow}>
            <Text style={styles.quoteLabel}>GST (18% integrated)</Text>
            <Text style={styles.quoteVal}>₹{gst.toFixed(2)}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Payable</Text>
            <Text style={styles.totalVal}>₹{total.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.guaranteeBox}>
          <ShieldCheck size={18} color={colors.secondary} style={{ marginRight: 8 }} />
          <Text style={styles.guaranteeText}>
            100% Bar Council Compliant Drafting Guarantee. Full refund if not delivered on time.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.payBtn}
          onPress={handleCreateOrder}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.payBtnText}>
              Confirm & Start Drafting (₹{total.toFixed(2)})
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
  docCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderDark,
    marginBottom: 20,
  },
  docTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  docSub: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 10,
  },
  counselCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.borderDark,
    marginBottom: 20,
  },
  counselName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  counselSub: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  deliveryRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  deliveryCard: {
    flex: 1,
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderDark,
    padding: 14,
    alignItems: 'center',
    gap: 4,
  },
  deliverySelected: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(37, 99, 235, 0.08)',
  },
  deliveryTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  deliverySub: {
    fontSize: 12,
    color: colors.primaryLight,
  },
  quoteBox: {
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.borderDark,
    marginBottom: 16,
  },
  quoteTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMuted,
    marginBottom: 12,
  },
  quoteRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  quoteLabel: {
    fontSize: 13,
    color: colors.textMuted,
  },
  quoteVal: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
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
  guaranteeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    padding: 12,
    borderRadius: 12,
    marginBottom: 24,
  },
  guaranteeText: {
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
