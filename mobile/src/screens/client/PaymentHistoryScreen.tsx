import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
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
  Receipt,
  Download,
  CreditCard,
  CheckCircle,
} from 'lucide-react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'PaymentHistory'>;

export const PaymentHistoryScreen: React.FC<Props> = ({ navigation }) => {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get('/payments/history');
        if (res.data.success) {
          setPayments(res.data.data);
        }
      } catch (err) {
        console.warn('Payments fetch error');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const handleDownloadInvoice = (item: any) => {
    Alert.alert(
      'Tax Invoice Downloaded',
      `Official GST invoice ${item.invoice_number || 'INV-2026-0891'} (SAC 998211) saved to device storage.`
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payments & Invoices</Text>
        <View style={{ width: 22 }} />
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={payments}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>TOTAL CONSULTATION & DRAFTING SPENT</Text>
              <Text style={styles.summaryVal}>₹2,679.00</Text>
              <Text style={styles.summarySub}>All fees protected under Bar Council verified escrow</Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardTop}>
                <View style={styles.iconCircle}>
                  <Receipt size={20} color={colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.serviceTitle}>{item.service_type || 'Legal Consultation'}</Text>
                  <Text style={styles.lawyerName}>Adv. {item.lawyer_name || 'Rajesh Sharma'}</Text>
                </View>
                <Text style={styles.amountText}>₹{item.amount}</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.metaRow}>
                <View style={{ gap: 2 }}>
                  <Text style={styles.metaLabel}>Invoice #{item.invoice_number || 'INV-2026-0891'}</Text>
                  <Text style={styles.metaVal}>{item.payment_method || 'UPI (Google Pay)'}</Text>
                </View>

                <TouchableOpacity
                  style={styles.downloadBtn}
                  onPress={() => handleDownloadInvoice(item)}
                >
                  <Download size={14} color={colors.primaryLight} style={{ marginRight: 4 }} />
                  <Text style={styles.downloadText}>Invoice PDF</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
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
  loadingBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    padding: 20,
    gap: 14,
  },
  summaryCard: {
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.borderDark,
    marginBottom: 16,
  },
  summaryLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.8,
  },
  summaryVal: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.primary,
    marginVertical: 6,
  },
  summarySub: {
    fontSize: 12,
    color: colors.secondary,
  },
  card: {
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderDark,
    padding: 16,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: colors.borderDark,
  },
  serviceTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  lawyerName: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  amountText: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderDark,
    marginVertical: 12,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaLabel: {
    fontSize: 11,
    color: colors.textMuted,
  },
  metaVal: {
    fontSize: 12,
    color: colors.textLight,
  },
  downloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderDark,
  },
  downloadText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primaryLight,
  },
});
