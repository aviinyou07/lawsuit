import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';
import { apiClient } from '../../api/client';
import {
  ArrowLeft,
  Bell,
  Calendar,
  FileText,
  CreditCard,
  CheckCheck,
} from 'lucide-react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'Notifications'>;

export const NotificationsScreen: React.FC<Props> = ({ navigation }) => {
  const [filter, setFilter] = useState<'ALL' | 'APPOINTMENT' | 'DOCUMENT' | 'PAYMENT'>('ALL');
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifs = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/notifications');
      if (res.data.success) {
        setNotifications(res.data.data);
      }
    } catch (err) {
      console.warn('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifs();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await apiClient.post('/notifications/mark-all-read');
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (err) {
      console.warn('Mark all read error');
    }
  };

  const filtered = notifications.filter((n) =>
    filter === 'ALL' ? true : n.category === filter
  );

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'APPOINTMENT':
        return <Calendar size={20} color={colors.primary} />;
      case 'DOCUMENT':
        return <FileText size={20} color={colors.secondary} />;
      case 'PAYMENT':
        return <CreditCard size={20} color="#F59E0B" />;
      default:
        return <Bell size={20} color={colors.primaryLight} />;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications Center</Text>
        <TouchableOpacity onPress={handleMarkAllRead} style={styles.readAllBtn}>
          <CheckCheck size={20} color={colors.primaryLight} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsRow}>
        {(['ALL', 'APPOINTMENT', 'DOCUMENT', 'PAYMENT'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, filter === tab && styles.tabActive]}
            onPress={() => setFilter(tab)}
          >
            <Text style={[styles.tabText, filter === tab && styles.tabTextActive]}>
              {tab.charAt(0) + tab.slice(1).toLowerCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={[styles.notifCard, !item.is_read && styles.unreadCard]}>
              <View style={styles.iconCircle}>{getCategoryIcon(item.category)}</View>
              <View style={styles.cardContent}>
                <View style={styles.titleRow}>
                  <Text style={styles.notifTitle}>{item.title}</Text>
                  {!item.is_read && <View style={styles.unreadDot} />}
                </View>
                <Text style={styles.notifBody}>{item.body}</Text>
                <Text style={styles.notifTime}>
                  {new Date(item.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </View>
            </View>
          )}
        />
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
  readAllBtn: {
    padding: 6,
  },
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderDark,
  },
  tab: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: colors.surfaceSubtle,
  },
  tabActive: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
  },
  tabTextActive: {
    color: colors.white,
  },
  loadingBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    padding: 20,
    gap: 12,
  },
  notifCard: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderDark,
    padding: 16,
  },
  unreadCard: {
    borderColor: 'rgba(59, 130, 246, 0.4)',
    backgroundColor: 'rgba(37, 99, 235, 0.05)',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: colors.borderDark,
  },
  cardContent: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  notifTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginLeft: 6,
  },
  notifBody: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 18,
    marginBottom: 6,
  },
  notifTime: {
    fontSize: 11,
    color: colors.textLight,
  },
});
