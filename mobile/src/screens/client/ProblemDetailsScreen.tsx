import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';
import {
  ArrowLeft,
  Clock,
  MapPin,
  Paperclip,
  CheckCircle2,
  Sparkles,
} from 'lucide-react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'ProblemDetails'>;

export const ProblemDetailsScreen: React.FC<Props> = ({ navigation, route }) => {
  const initialProblem = route.params?.initial_problem || '';
  const [problemText, setProblemText] = useState(initialProblem);
  const [urgency, setUrgency] = useState<'IMMEDIATE' | 'URGENT' | 'STANDARD'>('URGENT');
  const [city, setCity] = useState('New Delhi');
  const [hasEvidence, setHasEvidence] = useState(false);

  const handleProceed = () => {
    navigation.navigate('SuggestedService', {
      problem_text: problemText,
      urgency,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Legal Problem Details</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.stepBadge}>
          <Text style={styles.stepText}>STEP 2 OF 2 • CASE INTAKE</Text>
        </View>

        <Text style={styles.title}>Refine Your Inquiry</Text>
        <Text style={styles.subtitle}>
          Providing jurisdiction and urgency helps our legal algorithm route your case to the right specialized counsel.
        </Text>

        {/* Problem Brief */}
        <Text style={styles.label}>Your Problem Description</Text>
        <TextInput
          style={styles.textArea}
          multiline
          numberOfLines={4}
          placeholder="Briefly state facts, dates, notices received, or questions..."
          placeholderTextColor={colors.textLight}
          value={problemText}
          onChangeText={setProblemText}
        />

        {/* Urgency Selection */}
        <Text style={styles.label}>Consultation Urgency</Text>
        <View style={styles.urgencyContainer}>
          <TouchableOpacity
            style={[styles.urgencyCard, urgency === 'IMMEDIATE' && styles.urgencySelected]}
            onPress={() => setUrgency('IMMEDIATE')}
          >
            <Clock size={20} color={urgency === 'IMMEDIATE' ? '#EF4444' : colors.textMuted} />
            <Text style={styles.urgencyTitle}>Immediate (2 Hours)</Text>
            <Text style={styles.urgencySub}>Bail, police station detention, court stay orders</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.urgencyCard, urgency === 'URGENT' && styles.urgencySelected]}
            onPress={() => setUrgency('URGENT')}
          >
            <Clock size={20} color={urgency === 'URGENT' ? colors.primary : colors.textMuted} />
            <Text style={styles.urgencyTitle}>Within 24–48 Hours</Text>
            <Text style={styles.urgencySub}>Notice replies, property verification, agreements</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.urgencyCard, urgency === 'STANDARD' && styles.urgencySelected]}
            onPress={() => setUrgency('STANDARD')}
          >
            <Clock size={20} color={urgency === 'STANDARD' ? colors.secondary : colors.textMuted} />
            <Text style={styles.urgencyTitle}>Flexible Advice</Text>
            <Text style={styles.urgencySub}>General legal strategy & second opinion</Text>
          </TouchableOpacity>
        </View>

        {/* Jurisdiction & City */}
        <Text style={styles.label}>Court Jurisdiction / City</Text>
        <View style={styles.inputRow}>
          <MapPin size={18} color={colors.textMuted} style={{ marginRight: 8 }} />
          <TextInput
            style={styles.cityInput}
            placeholder="e.g. New Delhi, Mumbai, Bengaluru"
            placeholderTextColor={colors.textLight}
            value={city}
            onChangeText={setCity}
          />
        </View>

        {/* Evidence Attachment */}
        <Text style={styles.label}>Supporting Files / Legal Notice</Text>
        <TouchableOpacity
          style={styles.uploadBox}
          onPress={() => setHasEvidence(!hasEvidence)}
        >
          {hasEvidence ? (
            <View style={styles.uploadedRow}>
              <CheckCircle2 size={20} color={colors.secondary} />
              <Text style={styles.uploadedText}>Notice_Copy_PDF.pdf (Attached)</Text>
            </View>
          ) : (
            <View style={styles.uploadRow}>
              <Paperclip size={18} color={colors.primary} />
              <Text style={styles.uploadText}>Attach Legal Notice or Agreement (PDF/JPG)</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.proceedBtn}
          onPress={handleProceed}
          activeOpacity={0.8}
        >
          <Sparkles size={18} color={colors.white} style={{ marginRight: 8 }} />
          <Text style={styles.proceedBtnText}>Analyze & Match Lawyers</Text>
        </TouchableOpacity>
      </ScrollView>
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
  container: {
    padding: 20,
  },
  stepBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 8,
  },
  stepText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primaryLight,
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 18,
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    marginTop: 8,
  },
  textArea: {
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderDark,
    padding: 14,
    fontSize: 14,
    color: colors.text,
    textAlignVertical: 'top',
    minHeight: 100,
    marginBottom: 16,
  },
  urgencyContainer: {
    gap: 10,
    marginBottom: 16,
  },
  urgencyCard: {
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderDark,
    padding: 14,
  },
  urgencySelected: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(37, 99, 235, 0.08)',
  },
  urgencyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginTop: 4,
  },
  urgencySub: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderDark,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  cityInput: {
    flex: 1,
    paddingVertical: 12,
    color: colors.text,
    fontSize: 14,
  },
  uploadBox: {
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderDark,
    borderStyle: 'dashed',
    padding: 16,
    alignItems: 'center',
    marginBottom: 26,
  },
  uploadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  uploadText: {
    fontSize: 13,
    color: colors.primaryLight,
    fontWeight: '600',
  },
  uploadedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  uploadedText: {
    fontSize: 13,
    color: colors.secondary,
    fontWeight: '600',
  },
  proceedBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 14,
    marginBottom: 30,
  },
  proceedBtnText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
});
