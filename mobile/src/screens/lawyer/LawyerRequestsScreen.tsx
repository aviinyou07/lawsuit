import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';
import { ArrowLeft, Video, Phone, MessageSquare, Check, X, Clock } from 'lucide-react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'LawyerRequests'>;

export const LawyerRequestsScreen: React.FC<Props> = ({ navigation }) => {
  const [requests, setRequests] = useState([
    {
      id: 'apt-01',
      booking_reference: 'LAW-8841',
      client_name: 'Vikas Malhotra',
      city: 'Gurugram',
      consultation_mode: 'VIDEO',
      scheduled_start: 'Tomorrow at 10:30 AM',
      client_case_brief: 'Urgent inquiry regarding illegal construction notice issued by Municipal Corporation under Section 343.',
      fee: 1500,
      status: 'PENDING',
    },
    {
      id: 'apt-02',
      booking_reference: 'LAW-8842',
      client_name: 'Ananya Deshmukh',
      city: 'Pune',
      consultation_mode: 'AUDIO',
      scheduled_start: 'Tomorrow at 02:00 PM',
      client_case_brief: 'Discussion on recovery of unpaid security deposit and notice under Transfer of Property Act.',
      fee: 999,
      status: 'PENDING',
    },
    {
      id: 'apt-03',
      booking_reference: 'LAW-8843',
      client_name: 'Suresh Singhania',
      city: 'New Delhi',
      consultation_mode: 'CHAT',
      scheduled_start: 'Today at 05:00 PM',
      client_case_brief: 'Reviewing non-compete clause in offer letter from competing software firm.',
      fee: 499,
      status: 'PENDING',
    },
  ]);

  const handleRespond = (id: string, action: 'CONFIRM' | 'CANCEL') => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: action === 'CONFIRM' ? 'CONFIRMED' : 'CANCELLED' } : r))
    );
    Alert.alert(
      action === 'CONFIRM' ? 'Appointment Confirmed' : 'Request Declined',
      `Notification sent to client. Calendar updated.`
    );
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'VIDEO':
        return <Video size={16} color={colors.secondary} />;
      case 'AUDIO':
        return <Phone size={16} color={colors.primary} />;
      default:
        return <MessageSquare size={16} color="#F59E0B" />;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Consultation Requests ({requests.filter(r => r.status === 'PENDING').length})</Text>
        <View style={{ width: 22 }} />
      </View>

      <FlatList
        data={requests}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardTop}>
              <View style={styles.badgeRow}>
                <View style={styles.modeBadge}>
                  {getModeIcon(item.consultation_mode)}
                  <Text style={styles.modeText}>{item.consultation_mode}</Text>
                </View>
                <Text style={styles.refText}>{item.booking_reference}</Text>
              </View>
              <Text style={styles.feeText}>₹{item.fee}</Text>
            </View>

            <Text style={styles.clientName}>{item.client_name}</Text>
            <Text style={styles.clientCity}>Location: {item.city} • Scheduled for {item.scheduled_start}</Text>

            <View style={styles.briefBox}>
              <Text style={styles.briefLabel}>CLIENT CASE BRIEF</Text>
              <Text style={styles.briefText}>{item.client_case_brief}</Text>
            </View>

            {item.status === 'PENDING' ? (
              <View style={styles.actionsRow}>
                <TouchableOpacity
                  style={styles.declineBtn}
                  onPress={() => handleRespond(item.id, 'CANCEL')}
                >
                  <X size={16} color={colors.error} style={{ marginRight: 4 }} />
                  <Text style={styles.declineText}>Decline</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.acceptBtn}
                  onPress={() => handleRespond(item.id, 'CONFIRM')}
                >
                  <Check size={16} color={colors.white} style={{ marginRight: 4 }} />
                  <Text style={styles.acceptText}>Accept & Lock Slot</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.statusBox}>
                <Text
                  style={[
                    styles.statusText,
                    { color: item.status === 'CONFIRMED' ? colors.secondary : colors.error },
                  ]}
                >
                  ✓ Request {item.status}
                </Text>
              </View>
            )}
          </View>
        )}
      />
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
  list: {
    padding: 20,
    gap: 14,
  },
  card: {
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderDark,
    padding: 16,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.borderDark,
  },
  modeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.text,
  },
  refText: {
    fontSize: 11,
    color: colors.textMuted,
  },
  feeText: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.secondary,
  },
  clientName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  clientCity: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
    marginBottom: 10,
  },
  briefBox: {
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.borderDark,
    marginBottom: 14,
  },
  briefLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textLight,
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  briefText: {
    fontSize: 13,
    color: colors.text,
    lineHeight: 18,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  declineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
  },
  declineText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.error,
  },
  acceptBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: colors.primary,
    borderRadius: 10,
  },
  acceptText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.white,
  },
  statusBox: {
    backgroundColor: colors.surface,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
