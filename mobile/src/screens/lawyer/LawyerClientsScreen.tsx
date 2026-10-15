import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';
import {
  ArrowLeft,
  Users,
  Search,
  MessageSquare,
  FileText,
  Phone,
} from 'lucide-react-native';
import { apiClient } from '../../api/client';

type Props = NativeStackScreenProps<RootStackParamList, 'LawyerClients'>;

export const LawyerClientsScreen: React.FC<Props> = ({ navigation }) => {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const res = await apiClient.get('/lawyers/me/clients');
      if (res.data.success) {
        setClients(res.data.data);
      }
    } catch (err: any) {
      console.error('Failed to fetch clients:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filtered = clients.filter(
    (c) =>
      c.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      c.phone_number?.includes(search) ||
      c.city?.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{(item.full_name || 'C')[0]}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{item.full_name || 'Client'}</Text>
          <Text style={styles.phone}>📞 +91 {item.phone_number}</Text>
          <Text style={styles.city}>📍 {item.city || 'India'} • Lang: {item.preferred_language || 'English'}</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{item.total_consultations || 1} Sessions</Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => Alert.alert('Client Interaction', `Phone: +91 ${item.phone_number}\nInitiate direct consultation call.`)}
        >
          <Phone size={14} color={colors.primary} />
          <Text style={styles.actionText}>Call Client</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => navigation.navigate('LawyerRequests')}
        >
          <FileText size={14} color={colors.primary} />
          <Text style={styles.actionText}>Case History</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Client Directory ({clients.length})</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.searchBox}>
        <Search size={18} color={colors.textLight} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by client name, mobile, city..."
          placeholderTextColor={colors.textLight}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={filtered}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchClients(); }} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Users size={48} color={colors.textLight} />
              <Text style={styles.emptyTitle}>No Client Records</Text>
              <Text style={styles.emptySub}>
                Clients who book consultations or retain your services will automatically be indexed here.
              </Text>
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
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
  },
  list: {
    padding: 16,
    gap: 12,
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
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(30, 58, 138, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primary,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  phone: {
    fontSize: 12,
    color: colors.textLight,
  },
  city: {
    fontSize: 12,
    color: colors.textMuted,
  },
  badge: {
    backgroundColor: colors.surfaceSubtle,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    borderTopWidth: 1,
    borderColor: colors.border,
    paddingTop: 10,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surfaceSubtle,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  emptySub: {
    fontSize: 13,
    color: colors.textLight,
    textAlign: 'center',
    maxWidth: 280,
  },
});
