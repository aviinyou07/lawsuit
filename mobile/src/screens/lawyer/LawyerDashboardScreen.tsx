import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { colors } from '../../theme/colors';
import { useAuthStore } from '../../store/authStore';
import { apiClient } from '../../api/client';

export const LawyerDashboardScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const logout = useAuthStore((state) => state.logout);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isInstantOnline, setIsInstantOnline] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await apiClient.get('/lawyers/me/dashboard');
      if (res.data.success && res.data.data) {
        setDashboardData(res.data.data);
        setIsInstantOnline(res.data.data.advocate?.is_online_for_instant ?? true);
      }
    } catch (err: any) {
      console.error('Error fetching lawyer dashboard:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleToggleInstant = async () => {
    try {
      const res = await apiClient.post('/lawyers/me/toggle-instant');
      if (res.data.success) {
        setIsInstantOnline(res.data.data.is_online_for_instant);
      }
    } catch (err: any) {
      Alert.alert('Status Error', 'Could not update instant availability');
    }
  };

  const advocate = dashboardData?.advocate;
  const metrics = dashboardData?.metrics;
  const appointments = dashboardData?.today_appointments || [];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchDashboard(); }} />}
    >
      {/* Advocate Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.barBadge}>
            <Text style={styles.barBadgeText}>
              {advocate?.state_bar_council ? advocate.state_bar_council.toUpperCase() : 'BAR COUNCIL OF DELHI'} • {advocate?.bar_council_number || 'D/1482/2010'}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={() => {
              Alert.alert('Sign Out', 'Are you sure you want to log out of your Advocate Portal?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Log Out', style: 'destructive', onPress: () => logout() },
              ]);
            }}
          >
            <Text style={styles.logoutText}>Log Out 🚪</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.advocateName}>{advocate?.full_name || 'Advocate'}</Text>
        <Text style={styles.courtName}>
          {Array.isArray(advocate?.courts_of_practice) && advocate.courts_of_practice.length > 0
            ? advocate.courts_of_practice.join(' & ')
            : 'Delhi High Court & Supreme Court'}
        </Text>
      </View>

      {/* Online Status Toggle */}
      <View style={styles.statusToggleCard}>
        <View style={styles.toggleInfo}>
          <Text style={styles.toggleTitle}>Instant Consultations</Text>
          <Text style={styles.toggleSub}>
            {isInstantOnline ? '🟢 Visible in discovery for immediate consultations' : '⚪ Offline for instant calls (scheduled only)'}
          </Text>
        </View>
        <Switch
          value={isInstantOnline}
          onValueChange={handleToggleInstant}
          trackColor={{ false: colors.borderDark, true: colors.accent }}
        />
      </View>

      {/* KPI Cards Grid */}
      <View style={styles.metricsGrid}>
        <TouchableOpacity style={styles.metricCard} onPress={() => navigation.navigate('LawyerRequests')}>
          <Text style={styles.metricValue}>{metrics?.today_calls ?? 0}</Text>
          <Text style={styles.metricLabel}>Today's Calls</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.metricCard} onPress={() => navigation.navigate('LawyerWallet')}>
          <Text style={styles.metricValue}>₹{metrics?.available_balance?.toLocaleString('en-IN') ?? '0'}</Text>
          <Text style={styles.metricLabel}>Available Balance</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.metricCard} onPress={() => navigation.navigate('LawyerCases')}>
          <Text style={styles.metricValue}>{metrics?.active_cases ?? 0}</Text>
          <Text style={styles.metricLabel}>Court Diary Cases</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.metricCard} onPress={() => navigation.navigate('LawyerAnalytics')}>
          <Text style={styles.metricValue}>★ {metrics?.client_rating ?? '4.9'}</Text>
          <Text style={styles.metricLabel}>Client Rating</Text>
        </TouchableOpacity>
      </View>

      {/* Today's Agenda */}
      <View style={styles.section}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Today's Consultation Schedule</Text>
          <TouchableOpacity onPress={() => navigation.navigate('LawyerRequests')}>
            <Text style={styles.seeAllText}>View Queue →</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator color={colors.primary} style={{ marginVertical: 20 }} />
        ) : appointments.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>📅</Text>
            <Text style={styles.emptyTitle}>No More Consultations Today</Text>
            <Text style={styles.emptySub}>Incoming booking requests will appear in your queue.</Text>
          </View>
        ) : (
          appointments.map((appt: any) => (
            <View key={appt.id} style={styles.appointmentCard}>
              <View style={styles.apptTop}>
                <View>
                  <Text style={styles.clientName}>{appt.client_name || 'Client'}</Text>
                  <Text style={styles.apptTopic} numberOfLines={2}>
                    {appt.client_case_brief || 'Legal consultation inquiry'}
                  </Text>
                </View>
                <View style={styles.modeTag}>
                  <Text style={styles.modeTagText}>{appt.consultation_mode || 'VIDEO'}</Text>
                </View>
              </View>

              <View style={styles.apptBottom}>
                <Text style={styles.apptTime}>
                  🕒 {new Date(appt.scheduled_start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • ₹{appt.consultation_fee || '999'}
                </Text>
                <TouchableOpacity
                  style={styles.joinBtn}
                  onPress={() => navigation.navigate('ConsultationRoom', { appointment_id: appt.id })}
                >
                  <Text style={styles.joinBtnText}>Join Room 📹</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </View>

      {/* Quick Advocate Tools */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Practice Management</Text>
        <View style={styles.toolsGrid}>
          <TouchableOpacity style={styles.toolBtn} onPress={() => navigation.navigate('LawyerRequests')}>
            <Text style={styles.toolIcon}>📥</Text>
            <Text style={styles.toolLabel}>Consultation Queue</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.toolBtn} onPress={() => navigation.navigate('LawyerCases')}>
            <Text style={styles.toolIcon}>⚖️</Text>
            <Text style={styles.toolLabel}>e-Courts Diary</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.toolBtn} onPress={() => navigation.navigate('LawyerCalendar')}>
            <Text style={styles.toolIcon}>📅</Text>
            <Text style={styles.toolLabel}>Availability Schedule</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.toolBtn} onPress={() => navigation.navigate('LawyerWallet')}>
            <Text style={styles.toolIcon}>💳</Text>
            <Text style={styles.toolLabel}>Earnings & Payouts</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.toolBtn} onPress={() => navigation.navigate('LawyerClients')}>
            <Text style={styles.toolIcon}>👥</Text>
            <Text style={styles.toolLabel}>Client Roster</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.toolBtn} onPress={() => navigation.navigate('LawyerAnalytics')}>
            <Text style={styles.toolIcon}>📈</Text>
            <Text style={styles.toolLabel}>Practice Analytics</Text>
          </TouchableOpacity>
        </View>
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
    paddingTop: 56,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  barBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  barBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#92400E',
  },
  logoutBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  logoutText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.error || '#EF4444',
  },
  advocateName: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
  },
  courtName: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  statusToggleCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 20,
  },
  toggleInfo: {
    flex: 1,
    paddingRight: 10,
  },
  toggleTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  toggleSub: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  metricCard: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
    gap: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  appointmentCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    gap: 6,
  },
  emptyIcon: {
    fontSize: 32,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  emptySub: {
    fontSize: 12,
    color: colors.textMuted,
  },
  apptTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  clientName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  apptTopic: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
    maxWidth: 220,
  },
  modeTag: {
    backgroundColor: 'rgba(30, 58, 138, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  modeTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
  apptBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: colors.surfaceSubtle,
    paddingTop: 10,
  },
  apptTime: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  joinBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  joinBtnText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  toolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  toolBtn: {
    width: '31%',
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    gap: 6,
  },
  toolIcon: {
    fontSize: 24,
  },
  toolLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
});
