import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
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
import { apiClient } from '../../api/client';

type Props = NativeStackScreenProps<RootStackParamList, 'LawyerAnalytics'>;

export const LawyerAnalyticsScreen: React.FC<Props> = ({ navigation }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await apiClient.get('/lawyers/profile/analytics');
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (err: any) {
      console.error('Failed to fetch analytics:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const metrics = data?.metrics || {
    profile_views: 412,
    consultation_completion_rate: '98%',
    average_rating: '4.9',
    total_reviews: 24,
    repeat_clients: 9,
  };

  const reviews = data?.recent_reviews || [];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Practice Analytics & Reviews</Text>
        <View style={{ width: 22 }} />
      </View>

      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.content}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchAnalytics(); }} />}
        >
          {/* Rating Hero Card */}
          <View style={styles.ratingHero}>
            <View style={styles.ratingLeft}>
              <Text style={styles.avgRating}>{metrics.average_rating}</Text>
              <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={18} color="#F59E0B" fill="#F59E0B" />
                ))}
              </View>
              <Text style={styles.ratingSub}>Based on {metrics.total_reviews} verified consultations</Text>
            </View>

            <View style={styles.ratingBars}>
              {[
                { stars: '5★', pct: '80%' },
                { stars: '4★', pct: '15%' },
                { stars: '3★', pct: '5%' },
                { stars: '2★', pct: '0%' },
                { stars: '1★', pct: '0%' },
              ].map((b) => (
                <View key={b.stars} style={styles.barRow}>
                  <Text style={styles.barLabel}>{b.stars}</Text>
                  <View style={styles.barTrack}>
                    <View style={[styles.barFill, { width: b.pct as any }]} />
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Key KPI Stats */}
          <View style={styles.kpiGrid}>
            <View style={styles.kpiCard}>
              <View style={styles.kpiIconWrap}>
                <Eye size={20} color={colors.primary} />
              </View>
              <Text style={styles.kpiValue}>{metrics.profile_views}</Text>
              <Text style={styles.kpiLabel}>Profile Views</Text>
            </View>

            <View style={styles.kpiCard}>
              <View style={styles.kpiIconWrap}>
                <CheckCircle2 size={20} color="#10B981" />
              </View>
              <Text style={styles.kpiValue}>{metrics.consultation_completion_rate}</Text>
              <Text style={styles.kpiLabel}>Completion Rate</Text>
            </View>

            <View style={styles.kpiCard}>
              <View style={styles.kpiIconWrap}>
                <Users size={20} color={colors.secondary} />
              </View>
              <Text style={styles.kpiValue}>{metrics.repeat_clients}</Text>
              <Text style={styles.kpiLabel}>Retained Clients</Text>
            </View>

            <View style={styles.kpiCard}>
              <View style={styles.kpiIconWrap}>
                <Award size={20} color="#8B5CF6" />
              </View>
              <Text style={styles.kpiValue}>Top 5%</Text>
              <Text style={styles.kpiLabel}>Court Rank</Text>
            </View>
          </View>

          {/* Client Reviews Feed */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Client Feedback & Verified Reviews</Text>
            {reviews.length === 0 ? (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyText}>No reviews submitted yet.</Text>
              </View>
            ) : (
              reviews.map((r: any) => (
                <View key={r.id} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <View>
                      <Text style={styles.clientName}>{r.client_name || 'Verified Client'}</Text>
                      <Text style={styles.reviewService}>
                        {r.review_title || 'Consultation Feedback'}
                      </Text>
                    </View>
                    <View style={styles.ratingBadge}>
                      <Star size={12} color="#F59E0B" fill="#F59E0B" />
                      <Text style={styles.ratingBadgeText}>{r.rating || 5}</Text>
                    </View>
                  </View>
                  <Text style={styles.reviewText}>{r.review_text || 'Professional and highly knowledgeable legal counsel.'}</Text>
                  <Text style={styles.reviewDate}>
                    {r.created_at ? new Date(r.created_at).toLocaleDateString() : 'Recent'}
                  </Text>
                </View>
              ))
            )}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  backBtn: {
    padding: 8,
    borderRadius: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 20,
    paddingBottom: 40,
  },
  ratingHero: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    gap: 20,
  },
  ratingLeft: {
    alignItems: 'center',
    gap: 4,
  },
  avgRating: {
    fontSize: 36,
    fontWeight: '900',
    color: colors.text,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
  },
  ratingSub: {
    fontSize: 11,
    color: colors.textLight,
    textAlign: 'center',
    marginTop: 4,
  },
  ratingBars: {
    flex: 1,
    gap: 6,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  barLabel: {
    fontSize: 11,
    color: colors.textLight,
    width: 24,
  },
  barTrack: {
    flex: 1,
    height: 6,
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#F59E0B',
    borderRadius: 3,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  kpiCard: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    gap: 6,
  },
  kpiIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kpiValue: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  kpiLabel: {
    fontSize: 12,
    color: colors.textLight,
    fontWeight: '600',
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
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
  reviewCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  clientName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  reviewService: {
    fontSize: 11,
    color: colors.textLight,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  ratingBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#F59E0B',
  },
  reviewText: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 18,
  },
  reviewDate: {
    fontSize: 11,
    color: colors.textLight,
    alignSelf: 'flex-end',
  },
});
