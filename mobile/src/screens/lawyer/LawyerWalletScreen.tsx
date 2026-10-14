import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { colors } from '../../theme/colors';

export const LawyerWalletScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [availableBalance, setAvailableBalance] = useState(14900.0);
  const [escrowBalance, setEscrowBalance] = useState(2400.0);
  const [lifetimePayouts, setLifetimePayouts] = useState(85000.0);

  const pastPayouts = [
    { id: 'PAY_101', date: '08 Oct 2026', amount: 12000, status: 'TRANSFERRED', utr: 'SBIN002938192' },
    { id: 'PAY_102', date: '25 Sep 2026', amount: 18500, status: 'TRANSFERRED', utr: 'HDFC001928374' },
    { id: 'PAY_103', date: '10 Sep 2026', amount: 9500, status: 'TRANSFERRED', utr: 'ICIC000192834' },
  ];

  const handleWithdraw = () => {
    Alert.alert(
      'Withdraw Funds',
      `Available to transfer: ₹${availableBalance.toFixed(2)}\n\nInitiate IMPS instant transfer to your verified HDFC Bank Account (Ending in **4921)?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm Withdrawal',
          onPress: () => {
            Alert.alert('Transfer Initiated', '₹14,900 has been sent via IMPS. UTR will be updated in your ledger within 10 minutes.');
            setAvailableBalance(0);
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Text style={styles.backBtnText}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.title}>Advocate Earnings & Payouts</Text>
        <Text style={styles.subtitle}>
          Track your consultation fees, escrow settlements, and bank transfers.
        </Text>
      </View>

      {/* Balance Hero Card */}
      <View style={styles.heroCard}>
        <Text style={styles.heroLabel}>Available for Withdrawal</Text>
        <Text style={styles.heroAmount}>₹{availableBalance.toLocaleString('en-IN')}</Text>

        <TouchableOpacity style={styles.withdrawBtn} onPress={handleWithdraw} activeOpacity={0.8}>
          <Text style={styles.withdrawBtnText}>Transfer to Bank Account 🏦</Text>
        </TouchableOpacity>

        <View style={styles.heroRow}>
          <View style={styles.subStat}>
            <Text style={styles.subStatLabel}>Escrow Pending (24h)</Text>
            <Text style={styles.subStatValue}>₹{escrowBalance.toLocaleString('en-IN')}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.subStat}>
            <Text style={styles.subStatLabel}>Lifetime Earnings</Text>
            <Text style={styles.subStatValue}>₹{lifetimePayouts.toLocaleString('en-IN')}</Text>
          </View>
        </View>
      </View>

      {/* Escrow Explanation */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>🛡️ Platform Escrow Policy</Text>
        <Text style={styles.infoText}>
          In accordance with marketplace standards, consultation earnings mature and move from Escrow to your Available Balance exactly 24 hours after successful consultation completion.
        </Text>
      </View>

      {/* Past Settlements Ledger */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settlement History</Text>
        {pastPayouts.map((p) => (
          <View key={p.id} style={styles.payoutCard}>
            <View style={styles.payoutTop}>
              <View>
                <Text style={styles.payoutId}>Payout #{p.id}</Text>
                <Text style={styles.payoutDate}>{p.date}</Text>
              </View>
              <Text style={styles.payoutAmount}>₹{p.amount.toLocaleString('en-IN')}</Text>
            </View>
            <View style={styles.payoutBottom}>
              <Text style={styles.utrText}>UTR: {p.utr}</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>{p.status}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
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
    paddingBottom: 40,
  },
  backBtn: {
    marginBottom: 16,
  },
  backBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primaryLight,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 18,
  },
  heroCard: {
    backgroundColor: colors.primaryDark,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  heroLabel: {
    fontSize: 13,
    color: colors.textLight,
    fontWeight: '600',
    marginBottom: 4,
  },
  heroAmount: {
    fontSize: 34,
    fontWeight: '800',
    color: colors.white,
    marginBottom: 16,
  },
  withdrawBtn: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  withdrawBtnText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
  heroRow: {
    flexDirection: 'row',
    width: '100%',
    paddingTop: 16,
    borderTopWidth: 1,
    borderColor: '#334155',
    justifyContent: 'space-around',
  },
  subStat: {
    alignItems: 'center',
  },
  subStatLabel: {
    fontSize: 11,
    color: colors.textLight,
  },
  subStatValue: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.white,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#334155',
  },
  infoCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    marginBottom: 20,
    gap: 4,
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  infoText: {
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 18,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  payoutCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 10,
  },
  payoutTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  payoutId: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  payoutDate: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  payoutAmount: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.accent,
  },
  payoutBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: colors.surfaceSubtle,
    paddingTop: 8,
  },
  utrText: {
    fontSize: 11,
    color: colors.textLight,
  },
  statusBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.accent,
  },
});
