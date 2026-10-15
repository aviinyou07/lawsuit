import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';
import { ArrowLeft, Star, Trash2, Calendar, MapPin, Award } from 'lucide-react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'Shortlist'>;

export const ShortlistScreen: React.FC<Props> = ({ navigation }) => {
  const [shortlistedLawyers, setShortlistedLawyers] = useState([
    {
      id: 'l1',
      full_name: 'Adv. Rajesh Sharma',
      avatar_url: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=300',
      experience_years: 14,
      rating_average: '4.9',
      rating_count: 142,
      city: 'New Delhi',
      court: 'Delhi High Court',
      specialization: 'Criminal & Property Law',
      video_fee: 1500,
      audio_fee: 999,
      chat_fee: 499,
      offline_fee: 3000,
    },
    {
      id: 'l2',
      full_name: 'Adv. Priya Malhotra',
      avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
      experience_years: 11,
      rating_average: '4.8',
      rating_count: 98,
      city: 'Mumbai',
      court: 'Bombay High Court',
      specialization: 'Corporate & Real Estate',
      video_fee: 1800,
      audio_fee: 1200,
      chat_fee: 699,
      offline_fee: 3500,
    },
  ]);

  const handleRemove = (id: string) => {
    setShortlistedLawyers((prev) => prev.filter((l) => l.id !== id));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Shortlist & Compare ({shortlistedLawyers.length})</Text>
        <View style={{ width: 22 }} />
      </View>

      {shortlistedLawyers.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Award size={48} color={colors.textMuted} />
          <Text style={styles.emptyTitle}>No Saved Advocates</Text>
          <Text style={styles.emptySubtitle}>
            Bookmark lawyers while browsing to compare fees, experience, and court jurisdictions side-by-side.
          </Text>
          <TouchableOpacity
            style={styles.browseBtn}
            onPress={() => navigation.navigate('Categories')}
          >
            <Text style={styles.browseBtnText}>Browse Practice Areas</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.sectionHeader}>Side-by-Side Comparison</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {shortlistedLawyers.map((lawyer) => (
              <View key={lawyer.id} style={styles.compareCard}>
                <TouchableOpacity
                  style={styles.removeIcon}
                  onPress={() => handleRemove(lawyer.id)}
                >
                  <Trash2 size={16} color={colors.error} />
                </TouchableOpacity>

                <Image source={{ uri: lawyer.avatar_url }} style={styles.avatar} />
                <Text style={styles.lawyerName} numberOfLines={1}>
                  {lawyer.full_name}
                </Text>
                <Text style={styles.lawyerSpec} numberOfLines={1}>
                  {lawyer.specialization}
                </Text>

                <View style={styles.ratingBadge}>
                  <Star size={13} color="#F59E0B" fill="#F59E0B" />
                  <Text style={styles.ratingText}>
                    {lawyer.rating_average} ({lawyer.rating_count})
                  </Text>
                </View>

                {/* Metrics Comparison Table */}
                <View style={styles.table}>
                  <View style={styles.tableRow}>
                    <Text style={styles.tableLabel}>Experience</Text>
                    <Text style={styles.tableVal}>{lawyer.experience_years} Years</Text>
                  </View>

                  <View style={styles.tableRow}>
                    <Text style={styles.tableLabel}>Primary Court</Text>
                    <Text style={styles.tableVal} numberOfLines={1}>
                      {lawyer.court}
                    </Text>
                  </View>

                  <View style={styles.tableRow}>
                    <Text style={styles.tableLabel}>City</Text>
                    <Text style={styles.tableVal}>{lawyer.city}</Text>
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.tableRow}>
                    <Text style={styles.tableLabel}>Chat Fee</Text>
                    <Text style={styles.feeHighlight}>₹{lawyer.chat_fee}</Text>
                  </View>

                  <View style={styles.tableRow}>
                    <Text style={styles.tableLabel}>Audio Call</Text>
                    <Text style={styles.feeHighlight}>₹{lawyer.audio_fee}</Text>
                  </View>

                  <View style={styles.tableRow}>
                    <Text style={styles.tableLabel}>Video Call</Text>
                    <Text style={styles.feeHighlight}>₹{lawyer.video_fee}</Text>
                  </View>

                  <View style={styles.tableRow}>
                    <Text style={styles.tableLabel}>In-Person</Text>
                    <Text style={styles.feeHighlight}>₹{lawyer.offline_fee}</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.bookBtn}
                  onPress={() =>
                    navigation.navigate('ConsultationType', {
                      lawyer: lawyer as any,
                    })
                  }
                  activeOpacity={0.8}
                >
                  <Calendar size={15} color={colors.white} style={{ marginRight: 6 }} />
                  <Text style={styles.bookBtnText}>Book Appointment</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </ScrollView>
      )}
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
  scrollContent: {
    paddingVertical: 20,
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textMuted,
    marginHorizontal: 20,
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  horizontalScroll: {
    paddingHorizontal: 20,
    flexDirection: 'row',
  },
  compareCard: {
    width: 250,
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.borderDark,
    padding: 16,
    marginRight: 16,
    alignItems: 'center',
    position: 'relative',
  },
  removeIcon: {
    position: 'absolute',
    top: 14,
    right: 14,
    padding: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: colors.primary,
    marginBottom: 10,
  },
  lawyerName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  lawyerSpec: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
    marginBottom: 8,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
    marginBottom: 14,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
  table: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    gap: 8,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tableLabel: {
    fontSize: 12,
    color: colors.textMuted,
  },
  tableVal: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
    maxWidth: 130,
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderDark,
    marginVertical: 4,
  },
  feeHighlight: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primaryLight,
  },
  bookBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    width: '100%',
  },
  bookBtnText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  browseBtn: {
    marginTop: 12,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  browseBtnText: {
    color: colors.white,
    fontWeight: '600',
  },
});
