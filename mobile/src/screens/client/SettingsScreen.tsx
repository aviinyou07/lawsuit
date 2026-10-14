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

  const menuSections = [
    {
      title: 'Legal Matter Management',
      items: [
        { icon: '📁', label: 'My Court Cases & Cause Lists', sub: 'Track hearing dates, CNR & case status' },
        { icon: '🔒', label: 'Encrypted Document Vault', sub: 'Store identity & property records securely' },
        { icon: '🧾', label: 'Invoices & Payment Receipts', sub: 'GST tax invoices for consultations' },
      ],
    },
    {
      title: 'Support & Compliance',
      items: [
        { icon: '❓', label: 'Help & Support Center', sub: 'FAQs & grievance tickets' },
        { icon: '⚖️', label: 'Bar Council Regulatory Notice', sub: 'Rule 36 compliance & disclaimer' },
        { icon: '🛡️', label: 'Privacy & Security Controls', sub: 'End-to-end encryption & data rights' },
      ],
    },
  ];

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

      {/* Menu Sections */}
      {menuSections.map((section, idx) => (
        <View key={idx} style={styles.menuSection}>
          <Text style={styles.sectionHeader}>{section.title}</Text>
          <View style={styles.menuCard}>
            {section.items.map((item, itemIdx) => (
              <TouchableOpacity key={itemIdx} style={styles.menuItem} activeOpacity={0.7}>
                <Text style={styles.menuIcon}>{item.icon}</Text>
                <View style={styles.menuTextContainer}>
                  <Text style={styles.menuLabel}>{item.label}</Text>
                  <Text style={styles.menuSub}>{item.sub}</Text>
                </View>
                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

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
    marginBottom: 24,
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
