import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { colors } from '../../theme/colors';
import { apiClient } from '../../api/client';

export const LawyerWalletScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [walletData, setWalletData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    try {
      const res = await apiClient.get('/lawyers/me/wallet');
      if (res.data.success) {
        setWalletData(res.data.data);
      }
    } catch (err: any) {
      console.error('Failed to fetch wallet:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const availableBalance = walletData?.available_balance ?? 0;
  const escrowBalance = walletData?.escrow_locked_balance ?? 0;
  const lifetimePayouts = walletData?.total_withdrawn ?? 0;
  const pastPayouts = walletData?.payouts || [];

  const handleWithdraw = () => {
    if (availableBalance <= 0) {
      Alert.alert('Zero Balance', 'You currently do not have any funds available for withdrawal.');
      return;
    }

    Alert.alert(
      'Withdraw Funds',
      `Available to transfer: ₹${availableBalance.toFixed(2)}\n\nInitiate IMPS instant transfer to your verified Bank Account (Ending in **4921)?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm Withdrawal',
          onPress: async () => {
            try {
              setWithdrawing(true);
              const res = await apiClient.post('/lawyers/me/withdraw', {
                amount: availableBalance,
                bank_account_number: '918273645019',
                bank_ifsc_code: 'HDFC0001234',
              });
              if (res.data.success) {
                Alert.alert('Transfer Initiated ✅', res.data.message || 'Funds transferred via IMPS.');
                fetchWallet();
              }
            } catch (err: any) {
              Alert.alert('Transfer Failed', err.response?.data?.message || 'Could not process withdrawal');
            } finally {
              setWithdrawing(false);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchWallet(); }} />}
    >
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Text style={styles.backBtnText}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.title}>Advocate Earnings & Payouts</Text>
        <Text style={styles.subtitle}>
          Track your consultation fees, escrow settlements, and bank transfers.
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <>
          {/* Balance Hero Card */}
          <View style={styles.heroCard}>
            <Text style={styles.heroLabel}>Available for Withdrawal</Text>
            <Text style={styles.heroAmount}>₹{availableBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Text>

            <TouchableOpacity
              style={[styles.withdrawBtn, (availableBalance <= 0 || withdrawing) && { opacity: 0.6 }]}
              onPress={handleWithdraw}
              disabled={availableBalance <= 0 || withdrawing}
              activeOpacity={0.8}
            >
              <Text style={styles.withdrawBtnText}>
                {withdrawing ? 'Processing IMPS Transfer...' : 'Transfer to Bank Account 🏦'}
              </Text>
            </TouchableOpacity>

            <View style={styles.heroRow}>
              <View style={styles.subStat}>
                <Text style={styles.subStatLabel}>Escrow Pending (24h)</Text>
                <Text style={styles.subStatValue}>₹{escrowBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.subStat}>
                <Text style={styles.subStatLabel}>Lifetime Withdrawn</Text>
                <Text style={styles.subStatValue}>₹{lifetimePayouts.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Text>
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
            {pastPayouts.length === 0 ? (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyText}>No payout settlements yet.</Text>
              </View>
            ) : (
              pastPayouts.map((p: any) => (
                <View key={p.id} style={styles.payoutCard}>
                  <View style={styles.payoutTop}>
                    <View>
                      <Text style={styles.payoutId}>Payout #{p.id.slice(0, 8)}</Text>
                      <Text style={styles.payoutDate}>
                        {p.processed_at ? new Date(p.processed_at).toLocaleDateString() : 'Recent'}
                      </Text>
                    </View>
                    <Text style={styles.payoutAmount}>₹{Number(p.amount).toLocaleString('en-IN')}</Text>
                  </View>
                  <View style={styles.payoutBottom}>
                    <Text style={styles.utrText}>UTR: {p.bank_reference_utr || 'PROCESSED'}</Text>
                    <View style={styles.statusBadge}>
                      <Text style={styles.statusText}>{p.status}</Text>
                    </View>
                  </View>
                </View>
              ))
            )}
          </View>
        </>
      )}
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
    paddingTop: 56,
    paddingBottom: 40,
  },
  backBtn: {
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  backBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 4,
    lineHeight: 18,
  },
  heroCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    marginBottom: 20,
  },
  heroLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  heroAmount: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.primary,
    marginVertical: 12,
  },
  withdrawBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  withdrawBtnText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  heroRow: {
    flexDirection: 'row',
    width: '100%',
    borderTopWidth: 1,
    borderColor: colors.border,
    paddingTop: 16,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  subStat: {
    alignItems: 'center',
  },
  subStatLabel: {
    fontSize: 11,
    color: colors.textLight,
  },
  subStatValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.border,
  },
  infoCard: {
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
    gap: 6,
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
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
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 10,
  },
  emptyCard: {
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
    color: colors.textLight,
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
    fontSize: 11,
    color: colors.textLight,
    marginTop: 2,
  },
  payoutAmount: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
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
    fontFamily: 'monospace',
  },
  statusBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#10B981',
  },
});
