import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';
import { ArrowLeft, Video, Phone, MessageSquare, Check, X, Clock } from 'lucide-react-native';
import { apiClient } from '../../api/client';

type Props = any;

export const LawyerRequestsScreen: React.FC<any> = ({ navigation }) => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await apiClient.get('/lawyers/me/requests');
      if (res.data.success) {
        setRequests(res.data.data);
      }
    } catch (err: any) {
      console.error('Failed to fetch requests:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRespond = async (id: string, action: 'CONFIRM' | 'CANCEL') => {
    try {
      const res = await apiClient.post(`/lawyers/me/requests/${id}/action`, { action });
      if (res.data.success) {
        setRequests((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: action === 'CONFIRM' ? 'CONFIRMED' : 'CANCELLED' } : r))
        );
        Alert.alert(
          action === 'CONFIRM' ? 'Appointment Confirmed ✅' : 'Request Declined',
          `Notification sent to client. Calendar slot has been updated.`
        );
      }
    } catch (err: any) {
      Alert.alert('Action Failed', err.response?.data?.message || 'Could not update appointment');
    }
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'VIDEO':
        return <Video size={16} color={colors.secondary} />;
      case 'AUDIO':
        return <Phone size={16} color={colors.primary} />;
      default:
        return <MessageSquare size={16} color={colors.textLight} />;
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.clientInfo}>
          <Text style={styles.clientName}>{item.client_name || 'Client'}</Text>
          <Text style={styles.clientLocation}>📍 {item.client_city || 'New Delhi'}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor:
                item.status === 'CONFIRMED'
                  ? 'rgba(16, 185, 129, 0.12)'
                  : item.status === 'CANCELLED'
                  ? 'rgba(239, 68, 68, 0.12)'
                  : 'rgba(245, 158, 11, 0.12)',
            },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              {
                color:
                  item.status === 'CONFIRMED'
                    ? '#10B981'
                    : item.status === 'CANCELLED'
                    ? '#EF4444'
                    : '#F59E0B',
              },
            ]}
          >
            {item.status}
          </Text>
        </View>
      </View>

      <View style={styles.metaRow}>
        <View style={styles.modePill}>
          {getModeIcon(item.consultation_mode)}
          <Text style={styles.modeText}>{item.consultation_mode} Consultation</Text>
        </View>
        <View style={styles.timePill}>
          <Clock size={14} color={colors.textLight} />
          <Text style={styles.timeText}>
            {new Date(item.scheduled_start).toLocaleString([], {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>
      </View>

      <View style={styles.briefBox}>
        <Text style={styles.briefLabel}>Dispute Brief / Notes:</Text>
        <Text style={styles.briefText}>{item.client_case_brief || 'Legal consultation on pending dispute.'}</Text>
      </View>

      <View style={styles.cardFooter}>
        <View>
          <Text style={styles.feeLabel}>Fee (Escrow Protected)</Text>
          <Text style={styles.feeValue}>₹{item.total_amount || item.consultation_fee || '999'}</Text>
        </View>

        {item.status === 'PENDING' ? (
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.btn, styles.declineBtn]}
              onPress={() => handleRespond(item.id, 'CANCEL')}
            >
              <X size={16} color="#EF4444" />
              <Text style={styles.declineText}>Decline</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, styles.acceptBtn]}
              onPress={() => handleRespond(item.id, 'CONFIRM')}
            >
              <Check size={16} color={colors.white} />
              <Text style={styles.acceptText}>Accept</Text>
            </TouchableOpacity>
          </View>
        ) : item.status === 'CONFIRMED' ? (
          <TouchableOpacity
            style={[styles.btn, styles.acceptBtn]}
            onPress={() => navigation.navigate('ConsultationRoom', { appointment_id: item.id })}
          >
            <Video size={16} color={colors.white} />
            <Text style={styles.acceptText}>Join Room 📹</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Consultation Requests ({requests.length})</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={requests}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchRequests(); }} />}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📥</Text>
              <Text style={styles.emptyTitle}>Queue is Clear</Text>
              <Text style={styles.emptyDesc}>New client consultation requests will be dispatched to your queue here in real time.</Text>
            </View>
          }
        />
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
  list: {
    padding: 16,
    gap: 16,
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
    alignItems: 'flex-start',
  },
  clientInfo: {
    gap: 2,
  },
  clientName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  clientLocation: {
    fontSize: 12,
    color: colors.textLight,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  modePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surfaceSubtle,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  modeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
  timePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surfaceSubtle,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  timeText: {
    fontSize: 12,
    color: colors.textLight,
  },
  briefBox: {
    backgroundColor: colors.surfaceSubtle,
    padding: 12,
    borderRadius: 10,
    gap: 4,
  },
  briefLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textLight,
    textTransform: 'uppercase',
  },
  briefText: {
    fontSize: 13,
    color: colors.text,
    lineHeight: 18,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: colors.border,
    paddingTop: 12,
  },
  feeLabel: {
    fontSize: 11,
    color: colors.textLight,
  },
  feeValue: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  declineBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  declineText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#EF4444',
  },
  acceptBtn: {
    backgroundColor: colors.primary,
  },
  acceptText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.white,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    gap: 12,
  },
  emptyIcon: {
    fontSize: 48,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  emptyDesc: {
    fontSize: 13,
    color: colors.textLight,
    textAlign: 'center',
    maxWidth: 260,
  },
});
