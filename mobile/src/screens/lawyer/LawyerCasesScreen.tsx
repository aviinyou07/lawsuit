import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Modal,
  TextInput,
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
import { apiClient } from '../../api/client';

type Props = any;

export const LawyerCasesScreen: React.FC<any> = ({ navigation }) => {
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // New Case Form
  const [caseTitle, setCaseTitle] = useState('');
  const [courtName, setCourtName] = useState('Delhi High Court');
  const [caseType, setCaseType] = useState('Civil / Writ Petition');
  const [cnrNumber, setCnrNumber] = useState('');
  const [nextHearing, setNextHearing] = useState('2026-11-15');

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      const res = await apiClient.get('/lawyers/me/cases');
      if (res.data.success) {
        setCases(res.data.data);
      }
    } catch (err: any) {
      console.error('Failed to fetch cases:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleAddCase = async () => {
    if (!caseTitle.trim()) {
      Alert.alert('Required', 'Please enter the case title');
      return;
    }
    try {
      const res = await apiClient.post('/lawyers/me/cases', {
        case_title: caseTitle,
        court_name: courtName,
        case_type: caseType,
        cnr_number: cnrNumber || `DLHC-${Date.now().toString().slice(-6)}`,
        next_hearing_date: nextHearing,
      });
      if (res.data.success) {
        Alert.alert('Case Added', 'Case successfully synchronized into your court diary.');
        setModalVisible(false);
        setCaseTitle('');
        fetchCases();
      }
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Could not save case');
    }
  };

  const handleAddDiaryNote = async (caseItem: any) => {
    try {
      await apiClient.post(`/lawyers/me/cases/${caseItem.id}/hearings`, {
        proceedings_summary: 'Arguments heard in part. Ordered compliance filing by next listing date.',
        next_action: 'Prepare rebuttal submissions',
      });
      Alert.alert(
        'Hearing Note Logged ✅',
        `Logged in your e-Court case diary for ${caseItem.case_title || caseItem.cnr_number}.`
      );
      fetchCases();
    } catch (err: any) {
      Alert.alert('Error', 'Could not record hearing note');
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.titleArea}>
          <Text style={styles.caseTitle}>{item.case_title}</Text>
          <Text style={styles.cnrText}>CNR: {item.cnr_number || 'N/A'}</Text>
        </View>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{item.case_status || 'ONGOING'}</Text>
        </View>
      </View>

      <View style={styles.courtRow}>
        <Building size={16} color={colors.textLight} />
        <Text style={styles.courtName}>{item.court_name}</Text>
      </View>

      <View style={styles.hearingBox}>
        <View style={styles.hearingHeader}>
          <Calendar size={16} color={colors.secondary} />
          <Text style={styles.hearingLabel}>Next Listing Date</Text>
        </View>
        <Text style={styles.hearingDate}>
          {item.next_hearing_date
            ? new Date(item.next_hearing_date).toLocaleDateString([], {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })
            : 'To be listed'}
        </Text>
        <Text style={styles.stageText}>Stage: {item.case_type || 'Arguments / Hearing'}</Text>
      </View>

      <View style={styles.partiesRow}>
        <Text style={styles.partyText}>
          <Text style={styles.partyLabel}>Client: </Text>
          {item.client_name || 'Direct Client'}
        </Text>
      </View>

      <View style={styles.cardFooter}>
        <TouchableOpacity
          style={styles.diaryActionBtn}
          onPress={() => handleAddDiaryNote(item)}
        >
          <FileCheck size={16} color={colors.primary} />
          <Text style={styles.diaryActionText}>Log Hearing Update</Text>
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
        <Text style={styles.headerTitle}>Advocate Court Diary ({cases.length})</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
          <Plus size={22} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={cases}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchCases(); }} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Gavel size={48} color={colors.textLight} />
              <Text style={styles.emptyTitle}>No Court Cases Logged</Text>
              <Text style={styles.emptySub}>
                Tap the + icon in the top right to link an e-Court matter or manual CNR number to your daily diary.
              </Text>
            </View>
          }
        />
      )}

      {/* Add Case Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Matter to Court Diary</Text>

            <Text style={styles.inputLabel}>Case Title / Parties</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Anand Sharma vs. ICICI Bank"
              placeholderTextColor={colors.textLight}
              value={caseTitle}
              onChangeText={setCaseTitle}
            />

            <Text style={styles.inputLabel}>Court Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Delhi High Court (Court 14)"
              placeholderTextColor={colors.textLight}
              value={courtName}
              onChangeText={setCourtName}
            />

            <Text style={styles.inputLabel}>Case Type</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Criminal Appeal / Bail"
              placeholderTextColor={colors.textLight}
              value={caseType}
              onChangeText={setCaseType}
            />

            <Text style={styles.inputLabel}>CNR Number (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. DLHC01-004921-2024"
              placeholderTextColor={colors.textLight}
              value={cnrNumber}
              onChangeText={setCnrNumber}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleAddCase}>
                <Text style={styles.saveText}>Save Matter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  addBtn: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.surfaceSubtle,
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
  titleArea: {
    flex: 1,
    paddingRight: 10,
    gap: 2,
  },
  caseTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  cnrText: {
    fontSize: 12,
    color: colors.textLight,
  },
  statusBadge: {
    backgroundColor: 'rgba(30, 58, 138, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
  courtRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  courtName: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: '600',
  },
  hearingBox: {
    backgroundColor: colors.surfaceSubtle,
    padding: 12,
    borderRadius: 10,
    gap: 4,
  },
  hearingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  hearingLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.secondary,
    textTransform: 'uppercase',
  },
  hearingDate: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
  },
  stageText: {
    fontSize: 12,
    color: colors.textLight,
  },
  partiesRow: {
    borderTopWidth: 1,
    borderColor: colors.border,
    paddingTop: 10,
  },
  partyLabel: {
    fontWeight: '700',
    color: colors.textLight,
  },
  partyText: {
    fontSize: 13,
    color: colors.text,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderColor: colors.border,
    paddingTop: 10,
  },
  diaryActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surfaceSubtle,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  diaryActionText: {
    fontSize: 12,
    fontWeight: '700',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    gap: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textLight,
  },
  input: {
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: colors.surfaceSubtle,
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textMuted,
  },
  saveBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: colors.primary,
  },
  saveText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.white,
  },
});
