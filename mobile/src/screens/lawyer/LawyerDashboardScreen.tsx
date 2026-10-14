import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  StyleSheet,
  Alert,
} from 'react-native';
import { colors } from '../../theme/colors';
import { useAuthStore } from '../../store/authStore';

export const LawyerDashboardScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const profile = useAuthStore((state) => state.profile);
  const [isInstantOnline, setIsInstantOnline] = useState(true);

  const todayAppointments = [
    {
      id: 'appt_1',
      clientName: 'Suresh Verma',
      time: '04:30 PM - 04:50 PM',
      mode: 'VIDEO',
      topic: 'Anticipatory bail advice for business inquiry',
      fee: 1199,
    },
    {
      id: 'appt_2',
      clientName: 'Priya Mehra',
      time: '06:00 PM - 06:20 PM',
      mode: 'AUDIO',
      topic: 'Mutual divorce petition drafting inquiry',
      fee: 799,
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Advocate Header */}
      <View style={styles.header}>
        <View>
          <View style={styles.barBadge}>
            <Text style={styles.barBadgeText}>BAR COUNCIL OF DELHI • D/1482/2010</Text>
          </View>
          <Text style={styles.advocateName}>Adv. {profile?.full_name || 'Rajesh Sharma'}</Text>
          <Text style={styles.courtName}>Delhi High Court & Supreme Court</Text>
        </View>
      </View>

      {/* Online Status Toggle */}
      <View style={styles.statusToggleCard}>
        <View style={styles.toggleInfo}>
          <Text style={styles.toggleTitle}>Instant Consultations</Text>
          <Text style={styles.toggleSub}>
            {isInstantOnline ? 'You are visible for immediate client calls' : 'You are currently offline'}
          </Text>
        </View>
        <Switch
          value={isInstantOnline}
          onValueChange={setIsInstantOnline}
          trackColor={{ false: colors.borderDark, true: colors.accent }}
        />
      </View>

      {/* KPI Cards Grid */}
      <View style={styles.metricsGrid}>
        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>2</Text>
          <Text style={styles.metricLabel}>Today's Calls</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>₹14,900</Text>
          <Text style={styles.metricLabel}>Available Balance</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>5</Text>
          <Text style={styles.metricLabel}>Active Cases</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>★ 4.9</Text>
          <Text style={styles.metricLabel}>Client Rating</Text>
        </View>
      </View>

      {/* Today's Agenda */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Appointment Schedule</Text>
        {todayAppointments.map((appt) => (
          <View key={appt.id} style={styles.appointmentCard}>
            <View style={styles.apptTop}>
              <View>
                <Text style={styles.clientName}>{appt.clientName}</Text>
                <Text style={styles.apptTopic}>{appt.topic}</Text>
              </View>
              <View style={styles.modeTag}>
                <Text style={styles.modeTagText}>{appt.mode}</Text>
              </View>
            </View>

            <View style={styles.apptBottom}>
              <Text style={styles.apptTime}>🕒 {appt.time}</Text>
              <TouchableOpacity
                style={styles.joinBtn}
                onPress={() => navigation.navigate('ConsultationRoom', { appointment_id: appt.id })}
              >
                <Text style={styles.joinBtnText}>Join Room 📹</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      {/* Quick Advocate Tools */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Practice Management</Text>
        <View style={styles.toolsRow}>
          <TouchableOpacity
            style={styles.toolBtn}
            onPress={() => Alert.alert('Calendar Manager', 'Manage working hours & blocked court dates.')}
          >
            <Text style={styles.toolIcon}>📅</Text>
            <Text style={styles.toolLabel}>Availability Calendar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.toolBtn}
            onPress={() => Alert.alert('Wallet & Payouts', 'Request instant withdrawal to your verified bank account.')}
          >
            <Text style={styles.toolIcon}>💳</Text>
            <Text style={styles.toolLabel}>Earnings & Payouts</Text>
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
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  barBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8,
  },
  barBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#92400E',
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  appointmentCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
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
  toolsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  toolBtn: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    gap: 6,
  },
  toolIcon: {
    fontSize: 28,
  },
  toolLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
});
