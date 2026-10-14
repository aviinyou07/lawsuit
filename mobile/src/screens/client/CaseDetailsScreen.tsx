import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';
import { apiClient } from '../../api/client';

type Props = NativeStackScreenProps<RootStackParamList, 'CaseDetails'>;

export const CaseDetailsScreen: React.FC<Props> = ({ navigation, route }) => {
  const { case_id } = route.params;
  const [caseData, setCaseData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCaseDetails();
  }, [case_id]);

  const fetchCaseDetails = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(`/cases/${case_id}`);
      if (res.data.success) {
        setCaseData(res.data.data);
      }
    } catch (err: any) {
      console.error(err);
      Alert.alert('Error', 'Failed to load case details');
    } finally {
      setLoading(false);
    }
  };

  if (loading || !caseData) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Text style={styles.backBtnText}>← Back to Cases</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{caseData.case_status || 'ACTIVE LITIGATION'}</Text>
        </View>
        <Text style={styles.title}>{caseData.case_title}</Text>
        <Text style={styles.courtText}>🏛️ {caseData.court_name}</Text>
      </View>

      {/* Parties Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Parties to Suit</Text>
        <View style={styles.partyRow}>
          <Text style={styles.partyLabel}>Petitioner / Plaintiff:</Text>
          <Text style={styles.partyValue}>{caseData.petitioner_name || 'Ramesh Chandra'}</Text>
        </View>
        <View style={styles.vsRow}>
          <Text style={styles.vsText}>— VERSUS —</Text>
        </View>
        <View style={styles.partyRow}>
          <Text style={styles.partyLabel}>Respondent / Defendant:</Text>
          <Text style={styles.partyValue}>{caseData.respondent_name || 'Apex Realty Pvt Ltd'}</Text>
        </View>
      </View>

      {/* Hearing Timeline */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Hearing History & Proceedings</Text>
        {caseData.hearings && caseData.hearings.length > 0 ? (
          caseData.hearings.map((h: any, i: number) => (
            <View key={i} style={styles.hearingItem}>
              <View style={styles.hearingDot} />
              <View style={styles.hearingContent}>
                <Text style={styles.hearingDate}>{h.hearing_date}</Text>
                <Text style={styles.proceedingsText}>{h.proceedings_summary}</Text>
                {h.next_action && <Text style={styles.nextActionText}>Next Step: {h.next_action}</Text>}
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyHearings}>
            <Text style={styles.emptyHearingsText}>
              No past proceedings logged. Next hearing scheduled for {caseData.next_hearing_date || 'next cause list'}.
            </Text>
          </View>
        )}
      </View>

      {/* Contact Counsel CTA */}
      <TouchableOpacity
        style={styles.contactBtn}
        onPress={() => Alert.alert('Contacting Counsel', 'Opening secure communication channel with your advocate.')}
      >
        <Text style={styles.contactBtnText}>Message Advocate Adv. {caseData.lawyer_name || 'Sharma'} 💬</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 54,
    paddingBottom: 40,
  },
  backBtn: {
    marginBottom: 16,
  },
  backBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primaryLight,
  },
  header: {
    marginBottom: 20,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.accent,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  courtText: {
    fontSize: 14,
    color: colors.textMuted,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
    gap: 10,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  partyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  partyLabel: {
    fontSize: 13,
    color: colors.textMuted,
  },
  partyValue: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  vsRow: {
    alignItems: 'center',
    marginVertical: 4,
  },
  vsText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.secondary,
  },
  hearingItem: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: colors.surfaceSubtle,
  },
  hearingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
    marginTop: 4,
  },
  hearingContent: {
    flex: 1,
  },
  hearingDate: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  proceedingsText: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 18,
  },
  nextActionText: {
    fontSize: 12,
    color: colors.primaryLight,
    fontWeight: '600',
    marginTop: 4,
  },
  emptyHearings: {
    paddingVertical: 10,
  },
  emptyHearingsText: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 18,
  },
  contactBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  contactBtnText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
});
