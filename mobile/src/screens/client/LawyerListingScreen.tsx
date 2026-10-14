import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';
import { apiClient } from '../../api/client';
import { Lawyer } from '../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'LawyerListing'>;

export const LawyerListingScreen: React.FC<Props> = ({ navigation, route }) => {
  const { category_id, category_name } = route.params;
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLawyers();
  }, [category_id]);

  const fetchLawyers = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (category_id) params.category_id = category_id;
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
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{category_name || 'Verified Advocates'}</Text>
        <Text style={styles.headerSubtitle}>{lawyers.length} practicing advocates found</Text>
      </View>

      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={lawyers}
          keyExtractor={(item) => item.user_id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardTop}>
                <Image
                  source={{ uri: item.avatar_url || 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=200' }}
                  style={styles.avatar}
                />
                <View style={styles.topInfo}>
                  <Text style={styles.name}>{item.full_name}</Text>
                  <Text style={styles.barNumber}>Bar Reg: {item.bar_council_number}</Text>
                  <Text style={styles.experience}>
                    {item.experience_years}+ Years Experience • {item.city}
                  </Text>
                  <View style={styles.ratingBadge}>
                    <Text style={styles.ratingText}>★ {item.rating_average || '4.9'} ({item.rating_count || 48} reviews)</Text>
                  </View>
                </View>
              </View>

              <Text style={styles.bio} numberOfLines={2}>{item.bio}</Text>

              <View style={styles.feeBreakdown}>
                <View style={styles.feeCol}>
                  <Text style={styles.feeLabel}>Video Call</Text>
                  <Text style={styles.feeValue}>₹{item.consultation_fee_video || 999}</Text>
                </View>
                <View style={styles.feeCol}>
                  <Text style={styles.feeLabel}>Audio Call</Text>
                  <Text style={styles.feeValue}>₹{item.consultation_fee_audio || 699}</Text>
                </View>
                <View style={styles.feeCol}>
                  <Text style={styles.feeLabel}>In-Person</Text>
                  <Text style={styles.feeValue}>₹{item.consultation_fee_offline || 1999}</Text>
                </View>
              </View>

              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={styles.profileBtn}
                  onPress={() => navigation.navigate('LawyerProfile', { lawyer_id: item.user_id, lawyer: item })}
                >
                  <Text style={styles.profileBtnText}>View Full Profile</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.bookNowBtn}
                  onPress={() => navigation.navigate('ConsultationType', { lawyer: item })}
                >
                  <Text style={styles.bookNowBtnText}>Book Consultation</Text>
                </TouchableOpacity>
              </View>
            </View>
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
    paddingTop: 54,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  backBtn: {
    marginBottom: 8,
  },
  backBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primaryLight,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  list: {
    padding: 20,
    gap: 16,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTop: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 18,
    backgroundColor: colors.surfaceSubtle,
    marginRight: 14,
  },
  topInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  barNumber: {
    fontSize: 11,
    color: colors.secondary,
    fontWeight: '600',
    marginTop: 2,
  },
  experience: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  ratingBadge: {
    marginTop: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.ratingGold,
  },
  bio: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 18,
    marginBottom: 14,
  },
  feeBreakdown: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 12,
    padding: 10,
    justifyContent: 'space-around',
    marginBottom: 14,
  },
  feeCol: {
    alignItems: 'center',
  },
  feeLabel: {
    fontSize: 11,
    color: colors.textMuted,
    marginBottom: 2,
  },
  feeValue: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  profileBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.borderDark,
  },
  profileBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  bookNowBtn: {
    flex: 1.2,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  bookNowBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.white,
  },
});
