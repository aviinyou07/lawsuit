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
import { ArrowLeft, FileText, CheckCircle2 } from 'lucide-react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'DocumentRequest'>;

export const DocumentRequestScreen: React.FC<Props> = ({ navigation, route }) => {
  const serviceTitle = route.params?.service_title || 'Residential Rental Agreement';
  const baseFee = route.params?.base_fee || 1499;

  const [firstParty, setFirstParty] = useState('');
  const [secondParty, setSecondParty] = useState('');
  const [propertyAddress, setPropertyAddress] = useState('');
  const [monthlyAmount, setMonthlyAmount] = useState('');
  const [securityDeposit, setSecurityDeposit] = useState('');
  const [specialClauses, setSpecialClauses] = useState('');
  const [stampDutyIncluded, setStampDutyIncluded] = useState(true);

  const handleProceed = () => {
    navigation.navigate('DocumentQuote', {
      service_title: serviceTitle,
      base_fee: baseFee,
      requirements: `Parties: ${firstParty} & ${secondParty}. Terms: Rent ₹${monthlyAmount}, Deposit ₹${securityDeposit}. Address: ${propertyAddress}`,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Drafting Requirements</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.serviceBanner}>
          <FileText size={22} color={colors.primary} style={{ marginRight: 10 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTitle}>{serviceTitle}</Text>
            <Text style={styles.bannerSub}>Drafted by High Court Verified Advocate</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Party Details</Text>

        <Text style={styles.label}>First Party (Owner / Landlord / Employer)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Rameshwar Dayal Sharma"
          placeholderTextColor={colors.textLight}
          value={firstParty}
          onChangeText={setFirstParty}
        />

        <Text style={styles.label}>Second Party (Tenant / Employee / Contractor)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Amit Kumar Verma"
          placeholderTextColor={colors.textLight}
          value={secondParty}
          onChangeText={setSecondParty}
        />

        <Text style={styles.sectionTitle}>Terms & Property Address</Text>

        <Text style={styles.label}>Premises / Subject Property Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Full address with city, state & pincode"
          placeholderTextColor={colors.textLight}
          value={propertyAddress}
          onChangeText={setPropertyAddress}
        />

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Monthly Amount (₹)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 25000"
              placeholderTextColor={colors.textLight}
              keyboardType="numeric"
              value={monthlyAmount}
              onChangeText={setMonthlyAmount}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Security Deposit (₹)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 50000"
              placeholderTextColor={colors.textLight}
              keyboardType="numeric"
              value={securityDeposit}
              onChangeText={setSecurityDeposit}
            />
          </View>
        </View>

        <Text style={styles.label}>Specific Custom Clauses (Optional)</Text>
        <TextInput
          style={styles.textArea}
          multiline
          numberOfLines={3}
          placeholder="e.g. Pet policy, lock-in period 11 months, maintenance charges..."
          placeholderTextColor={colors.textLight}
          value={specialClauses}
          onChangeText={setSpecialClauses}
        />

        <TouchableOpacity
          style={styles.stampDutyToggle}
          onPress={() => setStampDutyIncluded(!stampDutyIncluded)}
        >
          <CheckCircle2
            size={20}
            color={stampDutyIncluded ? colors.primary : colors.textMuted}
          />
          <View style={{ marginLeft: 10, flex: 1 }}>
            <Text style={styles.toggleTitle}>Include State e-Stamp Paper (+₹500)</Text>
            <Text style={styles.toggleSub}>Official state government legal stamp paper certificate</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.submitBtn}
          onPress={handleProceed}
          activeOpacity={0.8}
        >
          <Text style={styles.submitBtnText}>Review Quote & Delivery Timeline</Text>
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
  serviceBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderDark,
    marginBottom: 20,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  bannerSub: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    marginTop: 10,
    marginBottom: 12,
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
  row: {
    flexDirection: 'row',
    gap: 12,
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
    marginBottom: 16,
  },
  stampDutyToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderDark,
    padding: 14,
    marginBottom: 24,
  },
  toggleTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  toggleSub: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  submitBtn: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 30,
  },
  submitBtnText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
});
