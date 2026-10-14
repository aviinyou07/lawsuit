import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ClientTabParamList, RootStackParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';
import { apiClient } from '../../api/client';
import { Lawyer, Category } from '../../types';

type Props = CompositeScreenProps<
  BottomTabScreenProps<ClientTabParamList, 'SearchTab'>,
  NativeStackScreenProps<RootStackParamList>
>;

export const SearchScreen: React.FC<Props> = ({ navigation, route }) => {
  const initialCategory = route.params?.category_id;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(initialCategory);
  const [categories, setCategories] = useState<Category[]>([]);
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('rating');

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchLawyers();
  }, [searchQuery, selectedCategory, sortBy]);

  const fetchCategories = async () => {
    try {
      const res = await apiClient.get('/categories');
      if (res.data.success) {
        setCategories(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchLawyers = async () => {
    try {
      setLoading(true);
      const params: any = { sort_by: sortBy };
      if (searchQuery.trim()) params.q = searchQuery.trim();
      if (selectedCategory) params.category_id = selectedCategory;

      const res = await apiClient.get('/lawyers', { params });
      if (res.data.success) {
        setLawyers(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Find Legal Advocates</Text>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, specialization, court..."
            placeholderTextColor={colors.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Categories Horizontal Scroll */}
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={[{ id: '', name: 'All Practice Areas' }, ...categories]}
          keyExtractor={(item) => item.id || 'all'}
          contentContainerStyle={styles.categoriesList}
          renderItem={({ item }) => {
            const isSelected = (!selectedCategory && !item.id) || selectedCategory === item.id;
            return (
              <TouchableOpacity
                style={[styles.categoryPill, isSelected && styles.activePill]}
                onPress={() => setSelectedCategory(item.id || undefined)}
              >
                <Text style={[styles.pillText, isSelected && styles.activePillText]}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Results List */}
      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={lawyers}
          keyExtractor={(item) => item.user_id}
          contentContainerStyle={styles.resultsList}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>🔍</Text>
              <Text style={styles.emptyTitle}>No Advocates Found</Text>
              <Text style={styles.emptySubtitle}>Try adjusting your search keywords or category filters.</Text>
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.lawyerCard}
              onPress={() => navigation.navigate('LawyerProfile', { lawyer_id: item.user_id, lawyer: item })}
              activeOpacity={0.8}
            >
              <Image
                source={{ uri: item.avatar_url || 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=200' }}
                style={styles.lawyerAvatar}
              />
              <View style={styles.lawyerInfo}>
                <View style={styles.lawyerHeaderRow}>
                  <Text style={styles.lawyerName}>{item.full_name}</Text>
                  <Text style={styles.ratingText}>★ {item.rating_average || '4.9'}</Text>
                </View>

                <Text style={styles.lawyerBio} numberOfLines={2}>
                  {item.bio || 'Practicing advocate with extensive courtroom experience.'}
                </Text>

                <Text style={styles.lawyerCity}>
                  📍 {item.city} • {item.experience_years}+ Yrs Experience
                </Text>

                <View style={styles.cardFooter}>
                  <Text style={styles.feeBadge}>Video: ₹{item.consultation_fee_video || 999}</Text>
                  <TouchableOpacity
                    style={styles.bookBtn}
                    onPress={() => navigation.navigate('ConsultationType', { lawyer: item })}
                  >
                    <Text style={styles.bookBtnText}>Book Now</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.surface,
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.borderDark,
    marginBottom: 14,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.text,
  },
  categoriesList: {
    gap: 8,
  },
  categoryPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activePill: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
  activePillText: {
    color: colors.white,
  },
  resultsList: {
    padding: 20,
    gap: 14,
  },
  lawyerCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  lawyerAvatar: {
    width: 72,
    height: 72,
    borderRadius: 18,
    backgroundColor: colors.surfaceSubtle,
    marginRight: 14,
  },
  lawyerInfo: {
    flex: 1,
  },
  lawyerHeaderRow: {
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
  ratingText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.ratingGold,
  },
  lawyerBio: {
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 16,
    marginBottom: 6,
  },
  lawyerCity: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: 10,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  feeBadge: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  bookBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 10,
  },
  bookBtnText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
    gap: 8,
  },
  emptyIcon: {
    fontSize: 36,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  emptySubtitle: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
