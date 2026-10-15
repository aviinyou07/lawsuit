import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';
import { apiClient } from '../../api/client';
import {
  ArrowLeft,
  HelpCircle,
  PhoneCall,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  MessageSquareWarning,
  Send,
} from 'lucide-react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'HelpSupport'>;

const FAQS = [
  {
    q: 'Is attorney-client privilege protected on Lawsuit?',
    a: 'Yes. All video consultations and case documents are encrypted with end-to-end security. All participating lawyers are enrolled with State Bar Councils and governed by Section 126 of the Indian Evidence Act.',
  },
  {
    q: 'How does the lawyer escrow payment protection work?',
    a: 'Your consultation fee is held in a protected platform escrow account. Funds are released to the advocate only after the consultation or document delivery is completed satisfactorily.',
  },
  {
    q: 'What if a lawyer misses or reschedules my appointment?',
    a: 'If an advocate does not join within 10 minutes of the scheduled time, you can reschedule immediately at zero cost or receive a 100% instant refund back to your original payment method.',
  },
  {
    q: 'Can I use document drafts for court submissions?',
    a: 'Yes. All drafts generated through Lawsuit include Bar Council enrollment credentials and can be printed on government e-Stamp paper for notarization and court submission.',
  },
];

export const HelpSupportScreen: React.FC<Props> = ({ navigation }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [issueType, setIssueType] = useState('Consultation Issue');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const toggleFaq = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleRaiseTicket = async () => {
    if (description.length < 10) {
      Alert.alert('Required', 'Please describe the issue in at least 10 characters');
      return;
    }

    try {
      setSubmitting(true);
      const res = await apiClient.post('/disputes', {
        issue_type: issueType,
        description,
      });

      if (res.data.success) {
        Alert.alert(
          'Grievance Registered',
          `Ticket ${res.data.data.dispute_reference} has been assigned to a Senior Legal Ops Manager. We will contact you within 24 hours.`
        );
        setDescription('');
      }
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to submit grievance');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Dispute Center</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Urgent Emergency Bar */}
        <View style={styles.emergencyCard}>
          <PhoneCall size={22} color="#EF4444" />
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={styles.emergencyTitle}>National Legal Aid Helpline</Text>
            <Text style={styles.emergencySub}>NALSA Toll-Free: 15100 • 24x7 Free Legal Assistance</Text>
          </View>
        </View>

        {/* FAQs */}
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        <View style={styles.faqList}>
          {FAQS.map((faq, index) => {
            const isExpanded = expandedIndex === index;
            return (
              <TouchableOpacity
                key={index}
                style={styles.faqItem}
                onPress={() => toggleFaq(index)}
                activeOpacity={0.7}
              >
                <View style={styles.faqHeader}>
                  <Text style={styles.faqQuestion}>{faq.q}</Text>
                  {isExpanded ? (
                    <ChevronUp size={18} color={colors.primary} />
                  ) : (
                    <ChevronDown size={18} color={colors.textMuted} />
                  )}
                </View>
                {isExpanded && <Text style={styles.faqAnswer}>{faq.a}</Text>}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Dispute Resolution Ticket */}
        <Text style={styles.sectionTitle}>Raise a Grievance or Dispute</Text>
        <View style={styles.ticketCard}>
          <View style={styles.ticketHeader}>
            <MessageSquareWarning size={20} color={colors.primary} />
            <Text style={styles.ticketTitle}>Formal Dispute Submission</Text>
          </View>
          <Text style={styles.ticketSub}>
            If you experienced lawyer no-show, drafting dispute, or billing error, submit below for admin investigation.
          </Text>

          <Text style={styles.label}>Category of Concern</Text>
          <View style={styles.chipsRow}>
            {['Consultation Issue', 'Draft Quality', 'Payment / Refund', 'Other'].map((type) => (
              <TouchableOpacity
                key={type}
                style={[styles.chip, issueType === type && styles.chipActive]}
                onPress={() => setIssueType(type)}
              >
                <Text style={[styles.chipText, issueType === type && styles.chipTextActive]}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Detailed Description of Issue *</Text>
          <TextInput
            style={styles.textArea}
            multiline
            numberOfLines={4}
            placeholder="Include booking reference, dates, lawyer name, and what went wrong..."
            placeholderTextColor={colors.textLight}
            value={description}
            onChangeText={setDescription}
          />

          <TouchableOpacity
            style={styles.submitBtn}
            onPress={handleRaiseTicket}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Send size={16} color={colors.white} />
                <Text style={styles.submitBtnText}>Submit to Legal Operations</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
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
  emergencyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
    marginBottom: 24,
  },
  emergencyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  emergencySub: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 12,
  },
  faqList: {
    gap: 10,
    marginBottom: 26,
  },
  faqItem: {
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderDark,
    padding: 16,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
    paddingRight: 10,
  },
  faqAnswer: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 18,
    marginTop: 10,
  },
  ticketCard: {
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderDark,
    padding: 18,
    marginBottom: 30,
  },
  ticketHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  ticketTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  ticketSub: {
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 16,
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
    marginBottom: 6,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  chip: {
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderDark,
  },
  chipActive: {
    backgroundColor: colors.primary,
  },
  chipText: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '600',
  },
  chipTextActive: {
    color: colors.white,
  },
  textArea: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderDark,
    padding: 12,
    fontSize: 14,
    color: colors.text,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  submitBtn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitBtnText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
});
