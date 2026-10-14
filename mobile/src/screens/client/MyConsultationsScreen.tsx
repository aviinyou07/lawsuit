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
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ClientTabParamList, RootStackParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';
import { apiClient } from '../../api/client';
import { Appointment } from '../../types';

type Props = CompositeScreenProps<
  BottomTabScreenProps<ClientTabParamList, 'ConsultationsTab'>,
  NativeStackScreenProps<RootStackParamList>
>;

export const MyConsultationsScreen: React.FC<Props> = ({ navigation }) => {
  const [tab, setTab] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConsultations();
  }, [tab]);

  const fetchConsultations = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/bookings/my-consultations', {
        params: { status: tab },
      });
      if (res.data.success) {
        setAppointments(res.data.data);
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
        <Text style={styles.title}>My Consultations</Text>

        {/* Tab Switcher */}
        <View style={styles.tabContainer}>
          {(['upcoming', 'completed', 'cancelled'] as const).map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.tabBtn, tab === t && styles.activeTabBtn]}
              onPress={() => setTab(t)}
            >
              <Text style={[styles.tabText, tab === t && styles.activeTabText]}>
                {t.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={appointments}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📅</Text>
              <Text style={styles.emptyTitle}>No {tab} consultations</Text>
              <Text style={styles.emptySubtitle}>
                {tab === 'upcoming'
                  ? 'Book a consultation with a verified advocate to get legal guidance.'
                  : `Your ${tab} consultations will be archived here.`}
              </Text>
            </View>
          }
          renderItem={({ item }) => {
            const dateStr = new Date(item.scheduled_start).toLocaleString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.lawyerMeta}>
                    <Image
                      source={{ uri: item.lawyer_avatar || 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=200' }}
                      style={styles.avatar}
                    />
                    <View>
                      <Text style={styles.lawyerName}>{item.lawyer_name || 'Advocate'}</Text>
                      <Text style={styles.refText}>{item.booking_reference}</Text>
                    </View>
                  </View>
                  <View style={styles.modeBadge}>
                    <Text style={styles.modeText}>{item.consultation_mode}</Text>
                  </View>
                </View>

                <View style={styles.scheduleRow}>
                  <Text style={styles.scheduleText}>🕒 {dateStr} IST</Text>
                  <Text style={styles.feeText}>₹{item.total_amount}</Text>
                </View>

                {tab === 'upcoming' && (
                  <TouchableOpacity
                    style={styles.joinBtn}
                    onPress={() => navigation.navigate('ConsultationRoom', { appointment_id: item.id })}
                  >
                    <Text style={styles.joinBtnText}>Join Consultation Room 📹</Text>
                  </TouchableOpacity>
                )}

                {tab === 'completed' && (
                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      style={styles.reviewBtn}
                      onPress={() =>
                        navigation.navigate('Review', {
                          appointment_id: item.id,
                          lawyer_name: item.lawyer_name || 'Counsel',
                        })
                      }
                    >
                      <Text style={styles.reviewBtnText}>★ Rate & Review</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.roomBtn}
                      onPress={() => navigation.navigate('ConsultationRoom', { appointment_id: item.id })}
                    >
                      <Text style={styles.roomBtnText}>View Notes & Files</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          }}
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 12,
    padding: 4,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeTabBtn: {
    backgroundColor: colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
  },
  activeTabText: {
    color: colors.primary,
  },
  list: {
    padding: 20,
    gap: 14,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lawyerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.surfaceSubtle,
  },
  lawyerName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  refText: {
    fontSize: 11,
    color: colors.textLight,
  },
  modeBadge: {
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  modeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primaryLight,
  },
  scheduleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.surfaceSubtle,
  },
  scheduleText: {
    fontSize: 13,
    color: colors.text,
    fontWeight: '600',
  },
  feeText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  joinBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  joinBtnText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  reviewBtn: {
    flex: 1,
    backgroundColor: colors.surfaceSubtle,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderDark,
  },
  reviewBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
  },
  roomBtn: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  roomBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.white,
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
    maxWidth: 240,
  },
});
