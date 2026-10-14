import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';
import { apiClient } from '../../api/client';

type Props = NativeStackScreenProps<RootStackParamList, 'CaseDetails'>;

export const MyCasesScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/cases');
      if (res.data.success) {
        setCases(res.data.data);
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
        <Text style={styles.title}>My Court Cases</Text>
        <Text style={styles.subtitle}>Track active hearings, cause lists, and daily judicial orders.</Text>
      </View>

      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={cases}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>⚖️</Text>
              <Text style={styles.emptyTitle}>No Active Court Cases</Text>
              <Text style={styles.emptySubtitle}>
                When you engage an advocate for court litigation, your filings and hearing dates will appear here.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('CaseDetails', { case_id: item.id })}
              activeOpacity={0.8}
            >
              <View style={styles.cardHeader}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.case_type || 'CIVIL SUIT'}</Text>
                </View>
                <Text style={styles.statusText}>{item.case_status || 'FILED'}</Text>
              </View>

              <Text style={styles.caseTitle}>{item.case_title}</Text>
              <Text style={styles.courtName}>🏛️ {item.court_name}</Text>
              <Text style={styles.cnrText}>CNR: {item.cnr_number || 'Pending Allocation'}</Text>

              <View style={styles.divider} />

              <View style={styles.footerRow}>
                <Text style={styles.advocateName}>Adv. {item.lawyer_name || 'Assigned Counsel'}</Text>
                <Text style={styles.nextHearing}>
                  Next Date: {item.next_hearing_date || 'Awaiting Cause List'}
                </Text>
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
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  list: {
    padding: 20,
    gap: 14,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.secondary,
  },
  caseTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  courtName: {
    fontSize: 13,
    color: colors.textMuted,
  },
  cnrText: {
    fontSize: 12,
    color: colors.textLight,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 4,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  advocateName: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
  },
  nextHearing: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.accent,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
    gap: 8,
    paddingHorizontal: 20,
  },
  emptyIcon: {
    fontSize: 40,
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
