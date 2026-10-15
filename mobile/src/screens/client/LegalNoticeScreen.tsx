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
import {
  ArrowLeft,
  FileWarning,
  Send,
  Building,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'LegalNotice'>;

const NOTICE_TYPES = [
  { id: 'n138', title: 'Cheque Bounce (Sec 138 NI Act)', statutory_days: '15 Days', fee: 1999 },
  { id: 'ntenant', title: 'Tenant Eviction & Unpaid Rent', statutory_days: '15/30 Days', fee: 2499 },
  { id: 'nconsumer', title: 'Consumer Deficiency & Refund', statutory_days: '30 Days', fee: 1799 },
  { id: 'ncontract', title: 'Breach of Commercial Contract', statutory_days: '15 Days', fee: 2999 },
  { id: 'ndefamation', title: 'Cease & Desist / Defamation', statutory_days: '7 Days', fee: 3499 },
];

export const LegalNoticeScreen: React.FC<Props> = ({ navigation }) => {
  const [selectedNotice, setSelectedNotice] = useState(NOTICE_TYPES[0]);
  const [recipientName, setRecipientName] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [claimAmount, setClaimAmount] = useState('');
  const [factsBrief, setFactsBrief] = useState('');
  const [includePostalDispatch, setIncludePostalDispatch] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const totalFee = selectedNotice.fee + (includePostalDispatch ? 499 : 0);

  const handleSubmit = () => {
    if (!recipientName || !recipientAddress) {
      Alert.alert('Required Fields', 'Please specify the recipient name and postal dispatch address');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      Alert.alert(
        'Notice Assigned to Advocate',
        `Your ${selectedNotice.title} has been assigned to Adv. Rajesh Sharma. Draft will be sent to your Documents Workspace within 24 hours for review prior to dispatch.`,
        [
          {
            text: 'View Workspace',
            onPress: () => navigation.navigate('DocumentWorkspace', { order_id: 'notice-demo' }),
          },
        ]
      );
    }, 1200);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Legal Notice Service</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.banner}>
          <FileWarning size={24} color="#EF4444" />
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={styles.bannerTitle}>Formal Advocate Demand Notice</Text>
            <Text style={styles.bannerSub}>
              Issued on official Bar Council letterhead with Speed Post tracking & delivery certificate.
            </Text>
          </View>
        </View>

        {/* Notice Type Selector */}
        <Text style={styles.sectionTitle}>1. Select Legal Notice Type</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeScroll}>
          {NOTICE_TYPES.map((type) => {
            const isSelected = selectedNotice.id === type.id;
            return (
              <TouchableOpacity
                key={type.id}
                style={[styles.typeCard, isSelected && styles.typeSelected]}
                onPress={() => setSelectedNotice(type)}
              >
                <Text style={[styles.typeTitle, isSelected && styles.typeTextSelected]}>
                  {type.title}
                </Text>
                <Text style={styles.typeStatutory}>Statutory window: {type.statutory_days}</Text>
                <Text style={styles.typeFee}>₹{type.fee}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Recipient Details */}
        <Text style={styles.sectionTitle}>2. Opposing Party / Defaulter Details</Text>

        <Text style={styles.label}>Recipient / Company Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Acme Realty Pvt Ltd or John Doe"
          placeholderTextColor={colors.textLight}
          value={recipientName}
          onChangeText={setRecipientName}
        />

        <Text style={styles.label}>Full Registered Postal Address (For Speed Post) *</Text>
        <TextInput
          style={styles.input}
          placeholder="Address, Landmark, District, Pincode"
          placeholderTextColor={colors.textLight}
          value={recipientAddress}
          onChangeText={setRecipientAddress}
        />

        <Text style={styles.label}>Total Financial Claim / Default Amount (₹)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 150000"
          placeholderTextColor={colors.textLight}
          keyboardType="numeric"
          value={claimAmount}
          onChangeText={setClaimAmount}
        />

        <Text style={styles.label}>Brief Facts / Cheque No. / Notice Ground</Text>
        <TextInput
          style={styles.textArea}
          multiline
          numberOfLines={3}
          placeholder="e.g. Cheque No. 492019 drawn on HDFC bank returned unpaid with memo 'Funds Insufficient' on 12th Oct..."
          placeholderTextColor={colors.textLight}
          value={factsBrief}
          onChangeText={setFactsBrief}
        />

        {/* Speed Post Dispatch Service */}
        <TouchableOpacity
          style={styles.dispatchOption}
          onPress={() => setIncludePostalDispatch(!includePostalDispatch)}
        >
          <CheckCircle2
            size={20}
            color={includePostalDispatch ? colors.primary : colors.textMuted}
          />
          <View style={{ marginLeft: 10, flex: 1 }}>
            <Text style={styles.dispatchTitle}>Registered Speed Post AD Dispatch (+₹499)</Text>
            <Text style={styles.dispatchSub}>
              Physical dispatch with Indian Post tracking number & proof of service receipt
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.submitBtn}
          onPress={handleSubmit}
          disabled={submitting}
          activeOpacity={0.8}
        >
          {submitting ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Send size={18} color={colors.white} />
              <Text style={styles.submitBtnText}>Draft & Issue Notice (₹{totalFee})</Text>
            </View>
          )}
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
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
    marginBottom: 20,
  },
  bannerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  bannerSub: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
    lineHeight: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 12,
    marginTop: 8,
  },
  typeScroll: {
    marginBottom: 20,
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  typeCard: {
    width: 200,
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderDark,
    padding: 14,
    marginRight: 12,
  },
  typeSelected: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
  },
  typeTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  typeTextSelected: {
    color: colors.primaryLight,
  },
  typeStatutory: {
    fontSize: 12,
    color: colors.textMuted,
    marginVertical: 4,
  },
  typeFee: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.secondary,
    marginTop: 4,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
    marginBottom: 6,
  },
  input: {
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderDark,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.text,
    marginBottom: 14,
  },
  textArea: {
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderDark,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.text,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 18,
  },
  dispatchOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderDark,
    padding: 14,
    marginBottom: 24,
  },
  dispatchTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  dispatchSub: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  submitBtn: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  submitBtnText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
});
