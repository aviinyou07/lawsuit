import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
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

type Props = NativeStackScreenProps<RootStackParamList, 'LawyerClients'>;

const CLIENTS = [
  {
    id: 'c1',
    name: 'Rameshwar Chand',
    phone: '+91 9876543210',
    city: 'New Delhi',
    matter: 'Property Partition Suit',
    total_consultations: 3,
    last_met: '3 days ago',
    status: 'ACTIVE',
  },
  {
    id: 'c2',
    name: 'Pooja Agarwal',
    phone: '+91 9821034567',
    city: 'Noida',
    matter: 'Mutual Divorce Agreement',
    total_consultations: 2,
    last_met: 'Last week',
    status: 'ACTIVE',
  },
  {
    id: 'c3',
    name: 'Kunal Singhal',
    phone: '+91 9711223344',
    city: 'Gurugram',
    matter: 'Sec 138 Cheque Bounce Notice',
    total_consultations: 1,
    last_met: '2 weeks ago',
    status: 'COMPLETED',
  },
  {
    id: 'c4',
    name: 'Tarun Mehra',
    phone: '+91 9988776655',
    city: 'Faridabad',
    matter: 'Consumer Forum Delay Claim',
    total_consultations: 4,
    last_met: '1 month ago',
    status: 'ACTIVE',
  },
];

export const LawyerClientsScreen: React.FC<Props> = ({ navigation }) => {
  const [search, setSearch] = useState('');

  const filtered = CLIENTS.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.matter.toLowerCase().includes(search.toLowerCase()) ||
      c.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Client Directory ({CLIENTS.length})</Text>
        <View style={{ width: 22 }} />
      </View>

      <View style={styles.searchBar}>
        <Search size={18} color={colors.textMuted} style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by client name, matter, city..."
          placeholderTextColor={colors.textLight}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardTop}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarInitial}>{item.name.charAt(0)}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.clientName}>{item.name}</Text>
                <Text style={styles.clientPhone}>{item.phone} • {item.city}</Text>
              </View>
              <View style={styles.activeBadge}>
                <Text style={styles.activeText}>{item.status}</Text>
              </View>
            </View>

            <View style={styles.matterBox}>
              <Text style={styles.matterLabel}>ONGOING LEGAL MATTER</Text>
              <Text style={styles.matterText}>{item.matter}</Text>
            </View>

            <View style={styles.footerRow}>
              <Text style={styles.historyText}>
                {item.total_consultations} Consultations • Last: {item.last_met}
              </Text>

              <TouchableOpacity
                style={styles.chatBtn}
                onPress={() =>
                  navigation.navigate('ConsultationRoom', {
                    appointment_id: 'demo-client-room',
                  })
                }
              >
                <MessageSquare size={14} color={colors.primaryLight} style={{ marginRight: 4 }} />
                <Text style={styles.chatText}>Message</Text>
              </TouchableOpacity>
            </View>
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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSubtle,
    marginHorizontal: 20,
    marginVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderDark,
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    color: colors.text,
    fontSize: 14,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    gap: 12,
  },
  card: {
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderDark,
    padding: 16,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarInitial: {
    color: colors.white,
    fontWeight: '800',
    fontSize: 16,
  },
  clientName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  clientPhone: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  activeBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  activeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.secondary,
  },
  matterBox: {
    backgroundColor: colors.surface,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.borderDark,
    marginBottom: 12,
  },
  matterLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textLight,
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  matterText: {
    fontSize: 13,
    color: colors.text,
    fontWeight: '600',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyText: {
    fontSize: 11,
    color: colors.textMuted,
  },
  chatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderDark,
  },
  chatText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primaryLight,
  },
});
