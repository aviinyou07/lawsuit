import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';
import {
  ArrowLeft,
  Star,
  Eye,
  TrendingUp,
  Award,
  Users,
  CheckCircle2,
} from 'lucide-react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'LawyerAnalytics'>;

const REVIEWS = [
  {
    id: 'r1',
    client_name: 'Ananya S.',
    rating: 5,
    date: '12 Oct 2026',
    comment: 'Adv. Rajesh gave extremely clear guidance on property partition and saved us months of court delays. Highly recommended.',
    service: 'Video Consultation',
  },
  {
    id: 'r2',
    client_name: 'Vikas M.',
    rating: 5,
    date: '08 Oct 2026',
    comment: 'Prompt reply to my Section 138 query. Drafted the demand notice on the same evening.',
    service: 'Legal Notice Service',
  },
  {
    id: 'r3',
    client_name: 'Suresh D.',
    rating: 4,
    date: '29 Sep 2026',
    comment: 'Very professional demeanor and in-depth knowledge of Delhi Rent Control provisions.',
    service: 'Audio Consultation',
  },
];

export const LawyerAnalyticsScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Practice Analytics & Reviews</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* KPI Grid */}
        <View style={styles.kpiGrid}>
          <View style={styles.kpiCard}>
            <Eye size={20} color={colors.primary} />
            <Text style={styles.kpiVal}>412</Text>
            <Text style={styles.kpiLabel}>Profile Views</Text>
          </View>

          <View style={styles.kpiCard}>
            <TrendingUp size={20} color={colors.secondary} />
            <Text style={styles.kpiVal}>98%</Text>
            <Text style={styles.kpiLabel}>Completion Rate</Text>
          </View>

          <View style={styles.kpiCard}>
            <Users size={20} color="#F59E0B" />
            <Text style={styles.kpiVal}>9</Text>
            <Text style={styles.kpiLabel}>Repeat Clients</Text>
          </View>

          <View style={styles.kpiCard}>
            <Award size={20} color="#8B5CF6" />
            <Text style={styles.kpiVal}>#2</Text>
            <Text style={styles.kpiLabel}>Category Rank</Text>
          </View>
        </View>

        {/* Rating Breakdown Card */}
        <View style={styles.ratingCard}>
          <View style={styles.ratingLeft}>
            <Text style={styles.ratingBig}>4.9</Text>
            <View style={styles.starsRow}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} color="#F59E0B" fill="#F59E0B" />
              ))}
            </View>
            <Text style={styles.totalReviews}>Based on 24 reviews</Text>
          </View>

          <View style={styles.ratingBars}>
            <View style={styles.barRow}>
              <Text style={styles.starNum}>5★</Text>
              <View style={styles.barBg}>
                <View style={[styles.barFill, { width: '80%' }]} />
              </View>
              <Text style={styles.barCount}>18</Text>
            </View>

            <View style={styles.barRow}>
              <Text style={styles.starNum}>4★</Text>
              <View style={styles.barBg}>
                <View style={[styles.barFill, { width: '20%' }]} />
              </View>
              <Text style={styles.barCount}>5</Text>
            </View>

            <View style={styles.barRow}>
              <Text style={styles.starNum}>3★</Text>
              <View style={styles.barBg}>
                <View style={[styles.barFill, { width: '5%' }]} />
              </View>
              <Text style={styles.barCount}>1</Text>
            </View>

            <View style={styles.barRow}>
              <Text style={styles.starNum}>2★</Text>
              <View style={styles.barBg}>
                <View style={[styles.barFill, { width: '0%' }]} />
              </View>
              <Text style={styles.barCount}>0</Text>
            </View>
          </View>
        </View>

        {/* Client Reviews */}
        <Text style={styles.sectionTitle}>Verified Client Testimonials</Text>

        {REVIEWS.map((review) => (
          <View key={review.id} style={styles.reviewCard}>
            <View style={styles.reviewTop}>
              <Text style={styles.reviewerName}>{review.client_name}</Text>
              <View style={styles.verifiedRow}>
                <CheckCircle2 size={13} color={colors.secondary} />
                <Text style={styles.verifiedText}>Verified Consultation</Text>
              </View>
            </View>

            <View style={styles.starsRow}>
              {[...Array(review.rating)].map((_, i) => (
                <Star key={i} size={12} color="#F59E0B" fill="#F59E0B" />
              ))}
              <Text style={styles.reviewDate}>{review.date} • {review.service}</Text>
            </View>

            <Text style={styles.commentText}>{review.comment}</Text>
          </View>
        ))}
      </ScrollView>
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
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderDark,
  },
  backBtn: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  container: {
    padding: 20,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  kpiCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderDark,
    padding: 16,
    alignItems: 'center',
    gap: 4,
  },
  kpiVal: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    marginTop: 4,
  },
  kpiLabel: {
    fontSize: 12,
    color: colors.textMuted,
  },
  ratingCard: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderDark,
    padding: 18,
    marginBottom: 24,
    alignItems: 'center',
  },
  ratingLeft: {
    alignItems: 'center',
    paddingRight: 16,
    borderRightWidth: 1,
    borderRightColor: colors.borderDark,
  },
  ratingBig: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.text,
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginVertical: 4,
  },
  totalReviews: {
    fontSize: 11,
    color: colors.textMuted,
  },
  ratingBars: {
    flex: 1,
    paddingLeft: 16,
    gap: 6,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  starNum: {
    fontSize: 11,
    color: colors.textMuted,
    width: 18,
  },
  barBg: {
    flex: 1,
    height: 6,
    backgroundColor: colors.surface,
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#F59E0B',
  },
  barCount: {
    fontSize: 11,
    color: colors.textLight,
    width: 18,
    textAlign: 'right',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 12,
  },
  reviewCard: {
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderDark,
    padding: 16,
    marginBottom: 12,
  },
  reviewTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reviewerName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  verifiedText: {
    fontSize: 11,
    color: colors.secondary,
    fontWeight: '600',
  },
  reviewDate: {
    fontSize: 11,
    color: colors.textLight,
    marginLeft: 6,
  },
  commentText: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 18,
    marginTop: 6,
  },
});
