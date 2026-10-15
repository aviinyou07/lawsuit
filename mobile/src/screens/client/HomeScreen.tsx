import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ClientTabParamList, RootStackParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';
import { apiClient } from '../../api/client';
import { Category, Lawyer } from '../../types';
import { useAuthStore } from '../../store/authStore';

type Props = CompositeScreenProps<
  BottomTabScreenProps<ClientTabParamList, 'HomeTab'>,
  NativeStackScreenProps<RootStackParamList>
>;

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const profile = useAuthStore((state) => state.profile);
  const user = useAuthStore((state) => state.user);
  const [categories, setCategories] = useState<Category[]>([]);
  const [topLawyers, setTopLawyers] = useState<Lawyer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      const [catsRes, lawyersRes] = await Promise.all([
        apiClient.get('/categories'),
        apiClient.get('/lawyers?limit=5&sort_by=rating'),
      ]);

      if (catsRes.data.success) {
        setCategories(catsRes.data.data);
      }
      if (lawyersRes.data.success) {
        setTopLawyers(lawyersRes.data.data);
      }
    } catch (err) {
      console.error('Failed to load home data', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header Bar */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {profile?.full_name || 'Citizen'} 👋</Text>
          <View style={styles.locationRow}>
            <Text style={styles.locationPin}>📍</Text>
            <Text style={styles.locationText}>{profile?.city || 'New Delhi, India'}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.notificationBtn}
          onPress={() => navigation.navigate('Notifications')}
        >
          <Text style={styles.bellIcon}>🔔</Text>
          <View style={styles.unreadDot} />
        </TouchableOpacity>
      </View>

      {/* Search Bar Trigger */}
      <TouchableOpacity
        style={styles.searchBar}
        onPress={() => navigation.navigate('SearchTab', undefined)}
        activeOpacity={0.8}
      >
        <Text style={styles.searchIcon}>🔍</Text>
        <Text style={styles.searchPlaceholder}>Search advocates, legal issues, or court...</Text>
      </TouchableOpacity>

      {/* Quick Action Banners */}
      <View style={styles.quickActionsGrid}>
        <TouchableOpacity
          style={[styles.actionCard, { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' }]}
          onPress={() => navigation.navigate('DescribeProblem')}
          activeOpacity={0.8}
        >
          <Text style={styles.actionIcon}>🤖</Text>
          <Text style={styles.actionTitle}>Describe My Problem</Text>
          <Text style={styles.actionSubtitle}>AI Legal Triage & Matching</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCard, { backgroundColor: '#FEF3C7', borderColor: '#FDE68A' }]}
          onPress={() => navigation.navigate('ServicesTab')}
          activeOpacity={0.8}
        >
          <Text style={styles.actionIcon}>📄</Text>
          <Text style={styles.actionTitle}>Document Services</Text>
          <Text style={styles.actionSubtitle}>Agreements, Notices, Affidavits</Text>
        </TouchableOpacity>
      </View>

      {/* Secondary Quick Actions */}
      <View style={[styles.quickActionsGrid, { marginTop: 10 }]}>
        <TouchableOpacity
          style={[styles.actionCard, { backgroundColor: '#FEE2E2', borderColor: '#FECACA' }]}
          onPress={() => navigation.navigate('LegalNotice')}
          activeOpacity={0.8}
        >
          <Text style={styles.actionIcon}>⚖️</Text>
          <Text style={styles.actionTitle}>Issue Legal Notice</Text>
          <Text style={styles.actionSubtitle}>Sec 138, Eviction, Dues</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCard, { backgroundColor: '#F3E8FF', borderColor: '#E9D5FF' }]}
          onPress={() => navigation.navigate('Shortlist')}
          activeOpacity={0.8}
        >
          <Text style={styles.actionIcon}>🔖</Text>
          <Text style={styles.actionTitle}>Saved Advocates</Text>
          <Text style={styles.actionSubtitle}>Compare Fees & Ratings</Text>
        </TouchableOpacity>
      </View>

      {/* Legal Categories Grid */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Legal Categories</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Categories')}>
          <Text style={styles.seeAllText}>See All (11)</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginVertical: 20 }} />
      ) : (
        <View style={styles.categoriesGrid}>
          {categories.slice(0, 8).map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={styles.categoryItem}
              onPress={() =>
                navigation.navigate('LawyerListing', {
                  category_id: cat.id,
                  category_name: cat.name,
                })
              }
              activeOpacity={0.7}
            >
              <View style={styles.categoryIconCircle}>
                <Text style={styles.categoryIcon}>⚖️</Text>
              </View>
              <Text style={styles.categoryName} numberOfLines={2}>
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Featured Verified Lawyers */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Top Verified Advocates</Text>
        <TouchableOpacity onPress={() => navigation.navigate('LawyerListing', {})}>
          <Text style={styles.seeAllText}>View All</Text>
        </TouchableOpacity>
      </View>

      {topLawyers.map((lawyer) => (
        <TouchableOpacity
          key={lawyer.user_id}
          style={styles.lawyerCard}
          onPress={() => navigation.navigate('LawyerProfile', { lawyer_id: lawyer.user_id, lawyer })}
          activeOpacity={0.8}
        >
          <Image
            source={{ uri: lawyer.avatar_url || 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=200' }}
            style={styles.lawyerAvatar}
          />
          <View style={styles.lawyerInfo}>
            <View style={styles.lawyerTitleRow}>
              <Text style={styles.lawyerName}>{lawyer.full_name}</Text>
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedText}>✓ Verified</Text>
              </View>
            </View>

            <Text style={styles.lawyerMeta}>
              {lawyer.experience_years}+ Yrs Exp • {lawyer.city}
            </Text>

            <View style={styles.ratingAndFeeRow}>
              <View style={styles.ratingPill}>
                <Text style={styles.ratingStar}>★</Text>
                <Text style={styles.ratingNumber}>
                  {lawyer.rating_average > 0 ? lawyer.rating_average : '4.9'}
                </Text>
                <Text style={styles.ratingCount}>({lawyer.rating_count || 48})</Text>
              </View>
              <Text style={styles.feeText}>
                ₹{lawyer.consultation_fee_video || 999} / 20 min
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  locationPin: {
    fontSize: 12,
    marginRight: 4,
  },
  locationText: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: '500',
  },
  notificationBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  bellIcon: {
    fontSize: 18,
  },
  unreadDot: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.danger,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  searchPlaceholder: {
    fontSize: 14,
    color: colors.textLight,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 28,
  },
  actionCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },
  actionIcon: {
    fontSize: 26,
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 11,
    color: colors.textMuted,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primaryLight,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 28,
  },
  categoryItem: {
    width: '22%',
    alignItems: 'center',
    gap: 6,
  },
  categoryIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryIcon: {
    fontSize: 24,
  },
  categoryName: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    lineHeight: 14,
  },
  lawyerCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  lawyerAvatar: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: colors.surfaceSubtle,
    marginRight: 14,
  },
  lawyerInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  lawyerTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  lawyerName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  verifiedBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.accent,
  },
  lawyerMeta: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 8,
  },
  ratingAndFeeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingStar: {
    color: colors.ratingGold,
    fontSize: 13,
  },
  ratingNumber: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
  },
  ratingCount: {
    fontSize: 11,
    color: colors.textLight,
  },
  feeText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
});
