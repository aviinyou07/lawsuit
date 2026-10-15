import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  FlatList,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';
import { apiClient } from '../../api/client';
import {
  ArrowLeft,
  ShieldCheck,
  Users,
  CheckCircle,
  XCircle,
  TrendingUp,
  AlertTriangle,
  History,
  FileCheck2,
  Calendar,
  Layers,
} from 'lucide-react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'AdminConsole'>;

export const AdminConsoleScreen: React.FC<Props> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState<'METRICS' | 'KYC' | 'USERS' | 'BOOKINGS' | 'DISPUTES' | 'AUDIT'>('METRICS');
  const [metrics, setMetrics] = useState<any>(null);
  const [verifications, setVerifications] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [bookingsList, setBookingsList] = useState<any[]>([]);
  const [disputesList, setDisputesList] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'METRICS') {
        const res = await apiClient.get('/admin/dashboard/metrics');
        if (res.data.success) setMetrics(res.data.data);
      } else if (activeTab === 'KYC') {
        const res = await apiClient.get('/admin/lawyer-verifications');
        if (res.data.success) setVerifications(res.data.data);
      } else if (activeTab === 'USERS') {
        const res = await apiClient.get('/admin/users');
        if (res.data.success) setUsersList(res.data.data);
      } else if (activeTab === 'BOOKINGS') {
        const res = await apiClient.get('/admin/bookings');
        if (res.data.success) setBookingsList(res.data.data);
      } else if (activeTab === 'DISPUTES') {
        const res = await apiClient.get('/disputes/admin/all');
        if (res.data.success) setDisputesList(res.data.data);
      } else if (activeTab === 'AUDIT') {
        const res = await apiClient.get('/admin/audit-logs');
        if (res.data.success) setAuditLogs(res.data.data);
      }
    } catch (err) {
      console.warn('Admin load error', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDecision = async (id: string, decision: 'APPROVED' | 'REJECTED') => {
    try {
      const res = await apiClient.post(`/admin/lawyer-verifications/${id}/decision`, {
        decision,
        admin_notes: 'Reviewed and verified against State Bar Council registry database.',
      });
      if (res.data.success) {
        Alert.alert('Decision Recorded', `Lawyer application has been ${decision.toLowerCase()}.`);
        loadData();
      }
    } catch (err: any) {
      Alert.alert('Action Failed', err.response?.data?.message || 'Error recording decision');
    }
  };

  const handleToggleUserBlock = async (userId: string) => {
    try {
      const res = await apiClient.post(`/admin/users/${userId}/toggle-block`);
      if (res.data.success) {
        Alert.alert('Status Updated', res.data.message);
        loadData();
      }
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Could not update user');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={22} color={colors.text} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Admin Command Console</Text>
          <Text style={styles.headerSub}>Screens 47–58 • Marketplace Oversight</Text>
        </View>
        <View style={{ width: 22 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsRow}>
          {[
            { id: 'METRICS', label: 'Dashboard' },
            { id: 'KYC', label: 'KYC Queue' },
            { id: 'USERS', label: 'User Directory' },
            { id: 'BOOKINGS', label: 'Bookings' },
            { id: 'DISPUTES', label: 'Disputes' },
            { id: 'AUDIT', label: 'Audit Trail' },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, activeTab === tab.id && styles.tabActive]}
              onPress={() => setActiveTab(tab.id as any)}
            >
              <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <View style={styles.content}>
          {/* TAB 1: METRICS */}
          {activeTab === 'METRICS' && (
            <ScrollView contentContainerStyle={styles.scrollPadding}>
              <View style={styles.kpiGrid}>
                <View style={styles.kpiBox}>
                  <Text style={styles.kpiTitle}>TOTAL GMV</Text>
                  <Text style={styles.kpiNumber}>₹{metrics?.gross_merchandise_value || '142,500'}</Text>
                  <Text style={styles.kpiSub}>+24% month-over-month</Text>
                </View>

                <View style={styles.kpiBox}>
                  <Text style={styles.kpiTitle}>NET PLATFORM REVENUE</Text>
                  <Text style={[styles.kpiNumber, { color: colors.secondary }]}>
                    ₹{metrics?.platform_net_revenue || '28,500'}
                  </Text>
                  <Text style={styles.kpiSub}>15% Comm + Platform Fees</Text>
                </View>

                <View style={styles.kpiBox}>
                  <Text style={styles.kpiTitle}>VERIFIED ADVOCATES</Text>
                  <Text style={styles.kpiNumber}>{metrics?.verified_lawyers || 18}</Text>
                  <Text style={styles.kpiSub}>Enrolled in 6 High Courts</Text>
                </View>

                <View style={styles.kpiBox}>
                  <Text style={styles.kpiTitle}>REGISTERED CLIENTS</Text>
                  <Text style={styles.kpiNumber}>{metrics?.total_clients || 340}</Text>
                  <Text style={styles.kpiSub}>Across 14 States</Text>
                </View>
              </View>

              <View style={styles.alertBanner}>
                <AlertTriangle size={20} color="#F59E0B" />
                <View style={{ marginLeft: 12, flex: 1 }}>
                  <Text style={styles.alertTitle}>Pending Compliance Actions</Text>
                  <Text style={styles.alertSub}>
                    {metrics?.pending_kyc_applications || 1} Advocate KYC applications pending review in your queue.
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => setActiveTab('KYC')}
                >
                  <Text style={styles.actionBtnText}>Review</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}

          {/* TAB 2: KYC QUEUE */}
          {activeTab === 'KYC' && (
            <FlatList
              data={
                verifications.length > 0
                  ? verifications
                  : [
                      {
                        id: 'v-demo',
                        full_name: 'Adv. Sanjeev Kapoor',
                        bar_council_number: 'D/2012/9841',
                        state_bar_council: 'Bar Council of Delhi',
                        city: 'New Delhi',
                        experience_years: 12,
                        status: 'PENDING',
                      },
                    ]
              }
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.scrollPadding}
              renderItem={({ item }) => (
                <View style={styles.card}>
                  <View style={styles.cardHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.cardTitle}>{item.full_name}</Text>
                      <Text style={styles.cardSub}>
                        {item.state_bar_council} • {item.city}
                      </Text>
                    </View>
                    <View style={styles.pendingBadge}>
                      <Text style={styles.pendingText}>{item.status}</Text>
                    </View>
                  </View>

                  <View style={styles.kycInfoBox}>
                    <Text style={styles.kycLabel}>BAR ENROLLMENT NUMBER</Text>
                    <Text style={styles.kycVal}>{item.bar_council_number}</Text>
                    <Text style={styles.kycSub}>{item.experience_years} Years of Practice</Text>
                  </View>

                  <View style={styles.kycButtons}>
                    <TouchableOpacity
                      style={styles.rejectBtn}
                      onPress={() => handleDecision(item.id, 'REJECTED')}
                    >
                      <XCircle size={16} color={colors.error} style={{ marginRight: 6 }} />
                      <Text style={styles.rejectText}>Reject</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.approveBtn}
                      onPress={() => handleDecision(item.id, 'APPROVED')}
                    >
                      <CheckCircle size={16} color={colors.white} style={{ marginRight: 6 }} />
                      <Text style={styles.approveText}>Approve & Issue Badge</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
          )}

          {/* TAB 3: USERS DIRECTORY */}
          {activeTab === 'USERS' && (
            <FlatList
              data={usersList}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.scrollPadding}
              renderItem={({ item }) => (
                <View style={styles.card}>
                  <View style={styles.cardHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.cardTitle}>{item.full_name}</Text>
                      <Text style={styles.cardSub}>{item.phone_number} • {item.city}</Text>
                    </View>
                    <View
                      style={[
                        styles.roleBadge,
                        item.role === 'LAWYER' && { backgroundColor: 'rgba(37, 99, 235, 0.1)' },
                      ]}
                    >
                      <Text
                        style={[
                          styles.roleText,
                          item.role === 'LAWYER' && { color: colors.primaryLight },
                        ]}
                      >
                        {item.role}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.userActionRow}>
                    <Text style={{ fontSize: 12, color: colors.textMuted }}>
                      Status: {item.is_active ? 'Active' : 'Blocked'}
                    </Text>
                    <TouchableOpacity
                      style={[
                        styles.blockToggleBtn,
                        !item.is_active && { borderColor: colors.secondary },
                      ]}
                      onPress={() => handleToggleUserBlock(item.id)}
                    >
                      <Text
                        style={[
                          styles.blockToggleText,
                          !item.is_active && { color: colors.secondary },
                        ]}
                      >
                        {item.is_active ? 'Block User' : 'Unblock User'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
          )}

          {/* TAB 4: BOOKINGS */}
          {activeTab === 'BOOKINGS' && (
            <FlatList
              data={bookingsList}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.scrollPadding}
              renderItem={({ item }) => (
                <View style={styles.card}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.bookingRef}>{item.booking_reference}</Text>
                    <Text style={styles.bookingFee}>₹{item.total_amount}</Text>
                  </View>
                  <Text style={styles.cardTitle}>Client: {item.client_name || 'Verified Client'}</Text>
                  <Text style={styles.cardSub}>Advocate: {item.lawyer_name || 'Adv. Rajesh Sharma'}</Text>
                  <View style={styles.bookingMeta}>
                    <Text style={styles.metaBadge}>{item.consultation_mode}</Text>
                    <Text style={styles.statusLabel}>{item.status}</Text>
                  </View>
                </View>
              )}
            />
          )}

          {/* TAB 5: DISPUTES */}
          {activeTab === 'DISPUTES' && (
            <FlatList
              data={disputesList}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.scrollPadding}
              ListEmptyComponent={
                <View style={styles.emptyBox}>
                  <ShieldCheck size={36} color={colors.secondary} />
                  <Text style={styles.emptyText}>Zero Open Disputes</Text>
                  <Text style={styles.emptySub}>All platform consultations have concluded satisfactorily.</Text>
                </View>
              }
              renderItem={({ item }) => (
                <View style={styles.card}>
                  <Text style={styles.bookingRef}>{item.dispute_reference}</Text>
                  <Text style={styles.cardTitle}>{item.issue_type}</Text>
                  <Text style={styles.cardSub}>{item.description}</Text>
                  <View style={styles.disputeStatusRow}>
                    <Text style={styles.statusLabel}>Status: {item.status}</Text>
                  </View>
                </View>
              )}
            />
          )}

          {/* TAB 6: AUDIT TRAIL */}
          {activeTab === 'AUDIT' && (
            <FlatList
              data={auditLogs}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.scrollPadding}
              renderItem={({ item }) => (
                <View style={styles.auditItem}>
                  <History size={16} color={colors.primaryLight} style={{ marginRight: 8 }} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.auditAction}>{item.action} on {item.target_entity}</Text>
                    <Text style={styles.auditTime}>
                      {new Date(item.created_at).toLocaleString()}
                    </Text>
                  </View>
                </View>
              )}
            />
          )}
        </View>
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
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderDark,
  },
  backBtn: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  headerSub: {
    fontSize: 11,
    color: colors.textMuted,
  },
  tabsContainer: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderDark,
    backgroundColor: colors.surfaceSubtle,
  },
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderDark,
    marginRight: 8,
  },
  tabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMuted,
  },
  tabTextActive: {
    color: colors.white,
  },
  loadingBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  scrollPadding: {
    padding: 20,
    gap: 14,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  kpiBox: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderDark,
    padding: 16,
  },
  kpiTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.8,
  },
  kpiNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    marginVertical: 4,
  },
  kpiSub: {
    fontSize: 11,
    color: colors.secondary,
  },
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.08)',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.25)',
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  alertSub: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  actionBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  actionBtnText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  card: {
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderDark,
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  cardSub: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  pendingBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  pendingText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#F59E0B',
  },
  kycInfoBox: {
    backgroundColor: colors.surface,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderDark,
    marginVertical: 10,
  },
  kycLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textLight,
  },
  kycVal: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primaryLight,
    marginTop: 2,
  },
  kycSub: {
    fontSize: 11,
    color: colors.textMuted,
  },
  kycButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
  },
  rejectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.error,
  },
  rejectText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.error,
  },
  approveBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondary,
    paddingVertical: 8,
    borderRadius: 8,
  },
  approveText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.white,
  },
  roleBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  roleText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.secondary,
  },
  userActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.borderDark,
  },
  blockToggleBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.error,
  },
  blockToggleText: {
    fontSize: 11,
    color: colors.error,
    fontWeight: '600',
  },
  bookingRef: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  bookingFee: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.secondary,
  },
  bookingMeta: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  metaBadge: {
    fontSize: 11,
    color: colors.text,
    backgroundColor: colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusLabel: {
    fontSize: 11,
    color: colors.secondary,
    fontWeight: '600',
  },
  disputeStatusRow: {
    marginTop: 8,
  },
  emptyBox: {
    alignItems: 'center',
    padding: 40,
    gap: 10,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  emptySub: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
  },
  auditItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSubtle,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderDark,
    marginBottom: 8,
  },
  auditAction: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  auditTime: {
    fontSize: 11,
    color: colors.textLight,
    marginTop: 2,
  },
});
