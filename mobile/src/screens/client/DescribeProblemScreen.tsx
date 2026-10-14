import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';
import { apiClient } from '../../api/client';

type Props = NativeStackScreenProps<RootStackParamList, 'DescribeProblem'>;

export const DescribeProblemScreen: React.FC<Props> = ({ navigation }) => {
  const [problemText, setProblemText] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const samplePrompts = [
    'My landlord refuses to refund my security deposit of ₹60,000.',
    'A client issued a cheque of ₹3 Lakhs that bounced with "insufficient funds".',
    'I was terminated without notice or severance pay after 3 years.',
    'Urgent anticipatory bail advice for false criminal allegation.',
  ];

  const handleAnalyze = async (textToAnalyze?: string) => {
    const text = textToAnalyze || problemText;
    if (text.trim().length < 10) {
      Alert.alert('Too Brief', 'Please provide a few more details about your legal situation (min 10 characters).');
      return;
    }

    try {
      setLoading(true);
      const res = await apiClient.post('/triage/analyze', {
        problem_text: text,
      });

      if (res.data.success) {
        setAnalysisResult(res.data.data);
      }
    } catch (err: any) {
      Alert.alert('Analysis Failed', err.response?.data?.message || 'Failed to triage legal issue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Text style={styles.backBtnText}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <View style={styles.aiBadge}>
          <Text style={styles.aiBadgeText}>🤖 AI LEGAL TRIAGE & MATCHING</Text>
        </View>
        <Text style={styles.title}>Describe Your Legal Problem</Text>
        <Text style={styles.subtitle}>
          Explain your situation in plain words. Our legal intake system categorizes your issue, determines urgency, and recommends specialized counsel.
        </Text>
      </View>

      <View style={styles.inputCard}>
        <TextInput
          style={styles.textArea}
          placeholder="Type or paste your legal situation here... e.g., 'My builder has delayed possession of my flat by 18 months and is not responding to calls...'"
          placeholderTextColor={colors.textLight}
          multiline
          numberOfLines={6}
          value={problemText}
          onChangeText={setProblemText}
        />

        <TouchableOpacity
          style={styles.analyzeBtn}
          onPress={() => handleAnalyze()}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.analyzeBtnText}>Analyze & Match Lawyers ⚡</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Quick Prompts */}
      {!analysisResult && (
        <View style={styles.samplesSection}>
          <Text style={styles.samplesTitle}>Or select a common legal issue:</Text>
          <View style={styles.samplesList}>
            {samplePrompts.map((prompt, i) => (
              <TouchableOpacity
                key={i}
                style={styles.sampleChip}
                onPress={() => {
                  setProblemText(prompt);
                  handleAnalyze(prompt);
                }}
              >
                <Text style={styles.sampleChipText}>"{prompt}"</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Analysis Results Display */}
      {analysisResult && (
        <View style={styles.resultContainer}>
          <View style={styles.analysisCard}>
            <View style={styles.urgencyRow}>
              <Text style={styles.resultCategory}>{analysisResult.analysis.category_name}</Text>
              <View
                style={[
                  styles.urgencyBadge,
                  analysisResult.analysis.urgency === 'HIGH' && styles.highUrgencyBadge,
                ]}
              >
                <Text
                  style={[
                    styles.urgencyText,
                    analysisResult.analysis.urgency === 'HIGH' && styles.highUrgencyText,
                  ]}
                >
                  {analysisResult.analysis.urgency} URGENCY
                </Text>
              </View>
            </View>

            <Text style={styles.actionTitle}>Recommended Immediate Step:</Text>
            <Text style={styles.actionDesc}>{analysisResult.analysis.suggested_action}</Text>

            <View style={styles.disclaimerBox}>
              <Text style={styles.disclaimerText}>{analysisResult.legal_disclaimer}</Text>
            </View>
          </View>

          {/* Recommended Advocates */}
          <Text style={styles.advocatesTitle}>Matched Advocates for this Matter</Text>
          {analysisResult.recommended_lawyers.map((lawyer: any) => (
            <View key={lawyer.user_id} style={styles.matchedLawyerCard}>
              <View style={styles.lawyerMeta}>
                <Text style={styles.matchedName}>{lawyer.full_name}</Text>
                <Text style={styles.matchedSub}>
                  {lawyer.experience_years}+ Yrs • ★ {lawyer.rating_average || '4.9'} ({lawyer.rating_count || 48})
                </Text>
              </View>

              <TouchableOpacity
                style={styles.consultBtn}
                onPress={() => navigation.navigate('ConsultationType', { lawyer })}
              >
                <Text style={styles.consultBtnText}>
                  Book (₹{lawyer.consultation_fee_video || 999})
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
  aiBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  aiBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 19,
  },
  inputCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 24,
    gap: 14,
  },
  textArea: {
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderDark,
    padding: 14,
    fontSize: 15,
    color: colors.text,
    textAlignVertical: 'top',
    height: 140,
  },
  analyzeBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  analyzeBtnText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
  samplesSection: {
    gap: 10,
  },
  samplesTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMuted,
  },
  samplesList: {
    gap: 8,
  },
  sampleChip: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sampleChipText: {
    fontSize: 13,
    color: colors.text,
    fontStyle: 'italic',
  },
  resultContainer: {
    gap: 16,
    marginTop: 10,
  },
  analysisCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 10,
  },
  urgencyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultCategory: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primary,
  },
  urgencyBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  highUrgencyBadge: {
    backgroundColor: '#FEE2E2',
  },
  urgencyText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#92400E',
  },
  highUrgencyText: {
    color: colors.danger,
  },
  actionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  actionDesc: {
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 20,
  },
  disclaimerBox: {
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 10,
    padding: 10,
    marginTop: 4,
  },
  disclaimerText: {
    fontSize: 11,
    color: colors.textLight,
    lineHeight: 16,
  },
  advocatesTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  matchedLawyerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  lawyerMeta: {
    flex: 1,
  },
  matchedName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  matchedSub: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  consultBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  consultBtnText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
});
