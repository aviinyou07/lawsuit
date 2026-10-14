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
          <Text style={styles.userName}>{profile?.full_name || 'Verified Client'}</Text>
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
        <Text style={styles.sectionHeader}>Legal Matter Management</Text>
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
            onPress={() => Alert.alert('Tax Invoices', 'Consultation tax invoices with 18% GST breakdown downloaded.')}
            activeOpacity={0.7}
          >
            <Text style={styles.menuIcon}>🧾</Text>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuLabel}>Invoices & Payment Receipts</Text>
              <Text style={styles.menuSub}>GST tax invoices for consultations</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Advocate Credentialing */}
      <View style={styles.menuSection}>
        <Text style={styles.sectionHeader}>Professional Services</Text>
        <View style={styles.menuCard}>
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

      <Text style={styles.versionText}>Lawsuit Mobile v1.0.0 (Production Build)</Text>
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
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarInitial: {
    color: colors.white,
    fontSize: 24,
    fontWeight: '800',
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 2,
  },
  userPhone: {
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: 6,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(30, 58, 138, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  roleText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primary,
  },
  advocateBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginBottom: 20,
    gap: 12,
  },
  advocateBannerIcon: {
    fontSize: 28,
  },
  advocateBannerText: {
    flex: 1,
  },
  advocateBannerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#92400E',
    marginBottom: 2,
  },
  advocateBannerSub: {
    fontSize: 11,
    color: '#78350F',
  },
  menuSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  menuCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: colors.surfaceSubtle,
  },
  menuIcon: {
    fontSize: 22,
    marginRight: 14,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  menuSub: {
    fontSize: 11,
    color: colors.textMuted,
  },
  chevron: {
    fontSize: 20,
    color: colors.textLight,
  },
  logoutBtn: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#FCA5A5',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  logoutText: {
    color: colors.danger,
    fontSize: 15,
    fontWeight: '700',
  },
  versionText: {
    textAlign: 'center',
    fontSize: 11,
    color: colors.textLight,
  },
});
