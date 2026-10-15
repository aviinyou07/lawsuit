import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';
import {
  ArrowLeft,
  Gavel,
  Calendar,
  Building,
  Plus,
  Clock,
  FileCheck,
} from 'lucide-react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'LawyerCases'>;

export const LawyerCasesScreen: React.FC<Props> = ({ navigation }) => {
  const [cases, setCases] = useState([
    {
      id: 'cs-01',
      title: 'Sharma vs. Delhi Development Authority',
      case_number: 'WP(C) 4920/2024',
      cnr_number: 'DCHC01-004920-2024',
      court_name: 'High Court of Delhi (Court No. 14)',
      next_hearing_date: '24 Oct 2026',
      stage: 'Arguments on Interim Injunction',
      client_name: 'Rameshwar Chand',
      opposing_counsel: 'Standing Counsel for DDA',
      status: 'ONGOING',
    },
    {
      id: 'cs-02',
      title: 'State vs. Vikrant Bhardwaj',
      case_number: 'BAIL APPLN. 1290/2026',
      cnr_number: 'DCDL02-001290-2026',
      court_name: 'Tis Hazari District Court',
      next_hearing_date: '18 Oct 2026',
      stage: 'Regular Bail Hearing',
      client_name: 'Vikrant Bhardwaj',
      opposing_counsel: 'Additional Public Prosecutor',
      status: 'URGENT',
    },
    {
      id: 'cs-03',
      title: 'Verma vs. Apex Builders Ltd.',
      case_number: 'CC/891/2025',
      cnr_number: 'NCDRC-000891-2025',
      court_name: 'National Consumer Commission (NCDRC)',
      next_hearing_date: '04 Nov 2026',
      stage: 'Evidence of Complainant',
      client_name: 'Sunil Verma',
      opposing_counsel: 'Adv. M.K. Sibal',
      status: 'ONGOING',
    },
  ]);

  const handleAddDiaryNote = (caseItem: any) => {
    Alert.alert('Hearing Note Added', `Logged in your e-Court case diary for ${caseItem.case_number}.`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Advocate Court Diary ({cases.length})</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => Alert.alert('Add Case', 'LinkCNR number from e-Courts to sync cause list automatically.')}
        >
          <Plus size={20} color={colors.primaryLight} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={cases}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.caseNumber}>{item.case_number}</Text>
                <Text style={styles.caseTitle}>{item.title}</Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  item.status === 'URGENT' && { backgroundColor: 'rgba(239, 68, 68, 0.1)' },
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    item.status === 'URGENT' && { color: colors.error },
                  ]}
                >
                  {item.status}
                </Text>
              </View>
            </View>

            <View style={styles.courtRow}>
              <Building size={14} color={colors.textMuted} style={{ marginRight: 6 }} />
              <Text style={styles.courtText}>{item.court_name}</Text>
            </View>

            <View style={styles.hearingBox}>
              <View style={styles.hearingRow}>
                <Clock size={16} color={colors.primaryLight} style={{ marginRight: 6 }} />
                <Text style={styles.hearingDate}>Next Hearing: {item.next_hearing_date}</Text>
              </View>
              <Text style={styles.stageText}>Stage: {item.stage}</Text>
            </View>

            <View style={styles.footerRow}>
              <View>
                <Text style={styles.clientLabel}>Client: {item.client_name}</Text>
                <Text style={styles.opposingLabel}>Opp: {item.opposing_counsel}</Text>
              </View>

              <TouchableOpacity
                style={styles.diaryBtn}
                onPress={() => handleAddDiaryNote(item)}
              >
                <FileCheck size={14} color={colors.white} style={{ marginRight: 4 }} />
                <Text style={styles.diaryBtnText}>Diary Note</Text>
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
  addBtn: {
    padding: 6,
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  caseNumber: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 0.5,
  },
  caseTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginTop: 2,
  },
  statusBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.secondary,
  },
  courtRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  courtText: {
    fontSize: 13,
    color: colors.textMuted,
  },
  hearingBox: {
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.borderDark,
    marginBottom: 12,
  },
  hearingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  hearingDate: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  stageText: {
    fontSize: 12,
    color: colors.textMuted,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  clientLabel: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '600',
  },
  opposingLabel: {
    fontSize: 11,
    color: colors.textLight,
  },
  diaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  diaryBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.white,
  },
});
