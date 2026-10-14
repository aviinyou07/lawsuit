import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';
import { apiClient } from '../../api/client';
import { Lawyer } from '../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'LawyerProfile'>;

export const LawyerProfileScreen: React.FC<Props> = ({ navigation, route }) => {
  const { lawyer_id, lawyer: initialLawyer } = route.params;
  const [lawyer, setLawyer] = useState<Lawyer | null>(initialLawyer || null);
  const [loading, setLoading] = useState(!initialLawyer);

  useEffect(() => {
    fetchProfile();
  }, [lawyer_id]);

  const fetchProfile = async () => {
    try {
      const res = await apiClient.get(`/lawyers/${lawyer_id}`);
      if (res.data.success) {
        setLawyer(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !lawyer) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Top Navigation */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>

        {/* Hero Card */}
        <View style={styles.heroCard}>
          <Image
            source={{ uri: lawyer.avatar_url || 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=400' }}
            style={styles.avatar}
          />
          <View style={styles.verifiedRow}>
            <Text style={styles.verifiedText}>✓ Bar Council Verified</Text>
          </View>
          <Text style={styles.name}>{lawyer.full_name}</Text>
          <Text style={styles.barNumber}>Enrollment: {lawyer.bar_council_number}</Text>
          <Text style={styles.stateBar}>{lawyer.state_bar_council}</Text>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{lawyer.experience_years}+</Text>
              <Text style={styles.statLabel}>Years Exp</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statValue}>★ {lawyer.rating_average || '4.9'}</Text>
              <Text style={styles.statLabel}>{lawyer.rating_count || 142} Reviews</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{lawyer.city}</Text>
              <Text style={styles.statLabel}>Location</Text>
            </View>
          </View>
        </View>

        {/* About & Qualifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About Counsel</Text>
          <Text style={styles.bioText}>
            {lawyer.bio ||
              'Practicing advocate with extensive trial and appellate experience across civil, property, and matrimonial matters.'}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education & Qualifications</Text>
          <Text style={styles.qualText}>
            {lawyer.qualification_summary || 'B.A. LL.B (Hons.), National Law University; LL.M (Commercial Law)'}
          </Text>
        </View>

        {/* Courts of Practice */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Courts of Practice</Text>
          <View style={styles.courtsWrap}>
            {['Supreme Court of India', 'Delhi High Court', 'District & Sessions Courts'].map((court, i) => (
              <View key={i} style={styles.courtBadge}>
                <Text style={styles.courtBadgeText}>🏛️ {court}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Consultation Pricing Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Consultation Fees</Text>
          <View style={styles.pricingList}>
            <View style={styles.pricingCard}>
              <Text style={styles.pricingIcon}>📹</Text>
              <View style={styles.pricingInfo}>
                <Text style={styles.pricingMode}>Video Consultation</Text>
                <Text style={styles.pricingSub}>Encrypted video room with file sharing (20 mins)</Text>
              </View>
              <Text style={styles.pricingAmount}>₹{lawyer.consultation_fee_video || 999}</Text>
            </View>

            <View style={styles.pricingCard}>
              <Text style={styles.pricingIcon}>📞</Text>
              <View style={styles.pricingInfo}>
                <Text style={styles.pricingMode}>Audio Call</Text>
                <Text style={styles.pricingSub}>Direct voice call with advocate (20 mins)</Text>
              </View>
              <Text style={styles.pricingAmount}>₹{lawyer.consultation_fee_audio || 699}</Text>
            </View>

            <View style={styles.pricingCard}>
              <Text style={styles.pricingIcon}>🏛️</Text>
              <View style={styles.pricingInfo}>
                <Text style={styles.pricingMode}>In-Person Chamber Meeting</Text>
                <Text style={styles.pricingSub}>Physical office visit at advocate chambers (45 mins)</Text>
              </View>
              <Text style={styles.pricingAmount}>₹{lawyer.consultation_fee_offline || 1999}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom CTA */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.startsFromLabel}>Starts From</Text>
          <Text style={styles.bottomFee}>₹{lawyer.consultation_fee_video || 999}</Text>
        </View>
        <TouchableOpacity
          style={styles.bookCta}
          onPress={() => navigation.navigate('ConsultationType', { lawyer })}
        >
          <Text style={styles.bookCtaText}>Book Consultation</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 54,
    paddingBottom: 100,
  },
  backBtn: {
    marginBottom: 16,
  },
  backBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primaryLight,
  },
  heroCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 20,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.surfaceSubtle,
    marginBottom: 12,
  },
  verifiedRow: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  verifiedText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.accent,
  },
  name: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  barNumber: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.secondary,
  },
  stateBar: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    width: '100%',
    paddingTop: 16,
    borderTopWidth: 1,
    borderColor: colors.border,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statBox: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: colors.border,
  },
  section: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 10,
  },
  bioText: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 20,
  },
  qualText: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 18,
  },
  courtsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  courtBadge: {
    backgroundColor: colors.surfaceSubtle,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  courtBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
  pricingList: {
    gap: 10,
  },
  pricingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pricingIcon: {
    fontSize: 22,
    marginRight: 12,
  },
  pricingInfo: {
    flex: 1,
  },
  pricingMode: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  pricingSub: {
    fontSize: 11,
    color: colors.textMuted,
  },
  pricingAmount: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primary,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  startsFromLabel: {
    fontSize: 11,
    color: colors.textMuted,
  },
  bottomFee: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primary,
  },
  bookCta: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
  },
  bookCtaText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
});
