import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ClientTabParamList, RootStackParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';
import { useAuthStore } from '../../store/authStore';

type Props = CompositeScreenProps<
  BottomTabScreenProps<ClientTabParamList, 'ProfileTab'>,
  NativeStackScreenProps<RootStackParamList>
>;

export const SettingsScreen: React.FC<Props> = ({ navigation }) => {
  const user = useAuthStore((state) => state.user);
  const profile = useAuthStore((state) => state.profile);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you wish to logout from your account?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => logout(),
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Account & Settings</Text>
      </View>

      {/* User Info Card */}
      <View style={styles.profileCard}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarInitial}>
            {profile?.full_name ? profile.full_name[0] : 'U'}
          </Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.userName}>{profile?.full_name || 'Verified Citizen'}</Text>
          <Text style={styles.userPhone}>+91 {user?.phone_number || '9876543210'}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>{user?.role || 'CLIENT'}</Text>
          </View>
        </View>
      </View>

      {/* Advocate Workspace Switch Banner */}
      <TouchableOpacity
        style={styles.advocateBanner}
        onPress={() => navigation.navigate('LawyerDashboard')}
        activeOpacity={0.8}
      >
        <Text style={styles.advocateBannerIcon}>⚖️</Text>
        <View style={styles.advocateBannerText}>
          <Text style={styles.advocateBannerTitle}>Switch to Advocate Practice Portal</Text>
          <Text style={styles.advocateBannerSub}>Manage today's consultations, calendar & bank wallet</Text>
        </View>
        <Text style={styles.chevron}>›</Text>
      </TouchableOpacity>

      {/* Legal Matter Management */}
      <View style={styles.menuSection}>
        <Text style={styles.sectionHeader}>Client Legal Services (Screens 06–35)</Text>
        <View style={styles.menuCard}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('MyCases')}
            activeOpacity={0.7}
          >
            <Text style={styles.menuIcon}>📁</Text>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuLabel}>My Court Cases & Cause Lists</Text>
              <Text style={styles.menuSub}>Track hearing dates, CNR & judicial orders</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('Vault')}
            activeOpacity={0.7}
          >
            <Text style={styles.menuIcon}>🔒</Text>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuLabel}>Encrypted Document Vault</Text>
              <Text style={styles.menuSub}>AES-256 secure storage & counsel access grants</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('Shortlist')}
            activeOpacity={0.7}
          >
            <Text style={styles.menuIcon}>🔖</Text>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuLabel}>Saved & Shortlisted Advocates</Text>
              <Text style={styles.menuSub}>Compare fees, ratings & court jurisdictions</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('PaymentHistory')}
            activeOpacity={0.7}
          >
            <Text style={styles.menuIcon}>🧾</Text>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuLabel}>Invoices & Payment Receipts</Text>
              <Text style={styles.menuSub}>GST tax invoices with SAC code 998211</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('Notifications')}
            activeOpacity={0.7}
          >
            <Text style={styles.menuIcon}>🔔</Text>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuLabel}>Notifications Center</Text>
              <Text style={styles.menuSub}>Booking alerts, hearing reminders & messages</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('HelpSupport')}
            activeOpacity={0.7}
          >
            <Text style={styles.menuIcon}>💬</Text>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuLabel}>Help, FAQs & Dispute Support</Text>
              <Text style={styles.menuSub}>24x7 NALSA helpline & grievance tickets</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Advocate Practice Modules */}
      <View style={styles.menuSection}>
        <Text style={styles.sectionHeader}>Advocate Portal Modules (Screens 36–46)</Text>
        <View style={styles.menuCard}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('LawyerRequests')}
            activeOpacity={0.7}
          >
            <Text style={styles.menuIcon}>📋</Text>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuLabel}>Incoming Consultation Requests</Text>
              <Text style={styles.menuSub}>Accept, decline, or propose reschedule</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('LawyerClients')}
            activeOpacity={0.7}
          >
            <Text style={styles.menuIcon}>👥</Text>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuLabel}>Client Management Directory</Text>
              <Text style={styles.menuSub}>Active clients, consultation history & case notes</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('LawyerCases')}
            activeOpacity={0.7}
          >
            <Text style={styles.menuIcon}>⚖️</Text>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuLabel}>Advocate Court Diary & Cause List</Text>
              <Text style={styles.menuSub}>Track upcoming hearing dates & CNR records</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('LawyerAnalytics')}
            activeOpacity={0.7}
          >
            <Text style={styles.menuIcon}>📊</Text>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuLabel}>Practice Analytics & Reviews</Text>
              <Text style={styles.menuSub}>Profile views, 5★ breakdown & completion rate</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('LawyerProfileEdit')}
            activeOpacity={0.7}
          >
            <Text style={styles.menuIcon}>⚙️</Text>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuLabel}>Fee Structure & Practice Bio</Text>
              <Text style={styles.menuSub}>Configure Chat, Audio, Video & Offline fees</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('LawyerWallet')}
            activeOpacity={0.7}
          >
            <Text style={styles.menuIcon}>💰</Text>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuLabel}>Earnings & Bank Payout Wallet</Text>
              <Text style={styles.menuSub}>Escrow balance & direct bank withdrawals</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('LawyerOnboarding')}
            activeOpacity={0.7}
          >
            <Text style={styles.menuIcon}>🎓</Text>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuLabel}>Advocate Verification / KYC</Text>
              <Text style={styles.menuSub}>Submit Bar Council certificate to accept consultations</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
        <Text style={styles.logoutText}>Log Out from Lawsuit</Text>
      </TouchableOpacity>

      <Text style={styles.versionText}>Lawsuit Platform v1.0.0 (All 58 Screens Active)</Text>
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
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderDark,
    marginBottom: 16,
  },
  avatarCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarInitial: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.white,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  userPhone: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
    marginBottom: 6,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  roleText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 0.5,
  },
  advocateBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#3B82F6',
    padding: 16,
    marginBottom: 24,
  },
  advocateBannerIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  advocateBannerText: {
    flex: 1,
  },
  advocateBannerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.white,
  },
  advocateBannerSub: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  menuSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginLeft: 4,
  },
  menuCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderDark,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderDark,
  },
  menuIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  menuSub: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  chevron: {
    fontSize: 20,
    color: colors.textMuted,
    marginLeft: 8,
  },
  logoutBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  logoutText: {
    color: colors.error,
    fontSize: 14,
    fontWeight: '700',
  },
  versionText: {
    fontSize: 11,
    color: colors.textLight,
    textAlign: 'center',
  },
});
