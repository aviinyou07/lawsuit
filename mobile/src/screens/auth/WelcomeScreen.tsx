import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';

type Props = NativeStackScreenProps<AuthStackParamList, 'Welcome'>;

export const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  const features = [
    { icon: '👨‍⚖️', title: 'Consult Top Advocates', desc: 'Secure video, audio and in-person consultations with Bar-verified lawyers.' },
    { icon: '📄', title: 'Verified Legal Drafting', desc: 'Rent agreements, affidavits, statutory legal notices, and corporate contracts.' },
    { icon: '⚡', title: 'Instant Legal Triage', desc: 'Explain your legal issue in simple words and get matched with specialized counsel.' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={styles.badgeRow}>
          <Text style={styles.badgeText}>⚖️ BAR COUNCIL COMPLIANT</Text>
        </View>
        <Text style={styles.heading}>Your Direct Gateway to Verified Legal Counsel</Text>
        <Text style={styles.subheading}>
          Consult court-practicing advocates, draft ironclad legal agreements, and protect your legal rights.
        </Text>
      </View>

      <View style={styles.featuresList}>
        {features.map((item, index) => (
          <View key={index} style={styles.featureCard}>
            <Text style={styles.featureIcon}>{item.icon}</Text>
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>{item.title}</Text>
              <Text style={styles.featureDesc}>{item.desc}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.languageContainer}>
        <Text style={styles.languageLabel}>Preferred Language:</Text>
        <View style={styles.languageChips}>
          {['English', 'हिन्दी', 'मराठी', 'বাংলা'].map((lang) => (
            <TouchableOpacity
              key={lang}
              onPress={() => setSelectedLanguage(lang)}
              style={[
                styles.chip,
                selectedLanguage === lang && styles.activeChip,
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedLanguage === lang && styles.activeChipText,
                ]}
              >
                {lang}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.ctaContainer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('Login', { role: 'CLIENT' })}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryButtonText}>Find Legal Help</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('Login', { role: 'LAWYER' })}
          activeOpacity={0.8}
        >
          <Text style={styles.secondaryButtonText}>I Am an Advocate / Lawyer</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.surface,
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  header: {
    marginBottom: 24,
  },
  badgeRow: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(217, 119, 6, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.secondary,
    letterSpacing: 0.5,
  },
  heading: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    lineHeight: 36,
    marginBottom: 10,
  },
  subheading: {
    fontSize: 15,
    color: colors.textMuted,
    lineHeight: 22,
  },
  featuresList: {
    gap: 16,
    marginVertical: 16,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  featureIcon: {
    fontSize: 28,
    marginRight: 16,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 18,
  },
  languageContainer: {
    marginVertical: 12,
  },
  languageLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
    marginBottom: 8,
  },
  languageChips: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activeChip: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 13,
    color: colors.text,
    fontWeight: '500',
  },
  activeChipText: {
    color: colors.white,
    fontWeight: '700',
  },
  ctaContainer: {
    gap: 12,
    marginTop: 20,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.borderDark,
  },
  secondaryButtonText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
});
