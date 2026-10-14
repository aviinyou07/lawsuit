import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';
import { apiClient } from '../../api/client';
import { useAuthStore } from '../../store/authStore';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export const LoginScreen: React.FC<Props> = ({ navigation, route }) => {
  const role = route.params?.role || 'CLIENT';
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSendOtp = async () => {
    if (phoneNumber.length < 10) {
      Alert.alert('Invalid Number', 'Please enter a valid 10-digit mobile number');
      return;
    }

    try {
      setLoading(true);
      const res = await apiClient.post('/auth/send-otp', {
        phone_country_code: '+91',
        phone_number: phoneNumber,
        role,
      });

      if (res.data.success) {
        setStep('OTP');
        if (res.data.data?.dev_otp) {
          setOtp(res.data.data.dev_otp);
        }
      }
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to dispatch OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length < 6) {
      Alert.alert('Invalid OTP', 'Please enter the 6-digit OTP');
      return;
    }

    try {
      setLoading(true);
      const res = await apiClient.post('/auth/verify-otp', {
        phone_country_code: '+91',
        phone_number: phoneNumber,
        otp,
      });

      if (res.data.success) {
        const { user, tokens } = res.data.data;
        setAuth(user, tokens.access_token, tokens.refresh_token);

        if (user.role === 'LAWYER') {
          navigation.navigate('ProfileSetup');
        } else {
          navigation.navigate('ProfileSetup');
        }
      }
    } catch (err: any) {
      Alert.alert('Verification Failed', err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.roleTag}>
          {role === 'LAWYER' ? 'ADVOCATE PORTAL' : 'CLIENT ACCESS'}
        </Text>
        <Text style={styles.title}>
          {step === 'PHONE' ? 'Enter Mobile Number' : 'Verify One-Time Password'}
        </Text>
        <Text style={styles.subtitle}>
          {step === 'PHONE'
            ? 'We will send a 6-digit verification code to your phone.'
            : `Code sent to +91 ${phoneNumber}. Enter code below.`}
        </Text>
      </View>

      <View style={styles.form}>
        {step === 'PHONE' ? (
          <View style={styles.phoneInputRow}>
            <View style={styles.countryCodeBox}>
              <Text style={styles.countryCodeText}>🇮🇳 +91</Text>
            </View>
            <TextInput
              style={styles.phoneInput}
              placeholder="9876543210"
              placeholderTextColor={colors.textLight}
              keyboardType="phone-pad"
              maxLength={10}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              autoFocus
            />
          </View>
        ) : (
          <View>
            <TextInput
              style={styles.otpInput}
              placeholder="123456"
              placeholderTextColor={colors.textLight}
              keyboardType="number-pad"
              maxLength={6}
              value={otp}
              onChangeText={setOtp}
              autoFocus
            />
            <TouchableOpacity onPress={() => setStep('PHONE')} style={styles.changeNumberBtn}>
              <Text style={styles.changeNumberText}>Edit Phone Number</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          style={styles.submitButton}
          onPress={step === 'PHONE' ? handleSendOtp : handleVerifyOtp}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.submitButtonText}>
              {step === 'PHONE' ? 'Send OTP' : 'Verify & Continue'}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.disclaimer}>
        <Text style={styles.disclaimerText}>
          By proceeding, you agree to the Lawsuit Terms of Service, Privacy Policy & Bar Council Ethics Guidelines.
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  header: {
    marginBottom: 32,
  },
  roleTag: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 1,
    marginBottom: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 20,
  },
  form: {
    gap: 20,
  },
  phoneInputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  countryCodeBox: {
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.borderDark,
    borderRadius: 14,
    paddingHorizontal: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countryCodeText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  phoneInput: {
    flex: 1,
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.borderDark,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    letterSpacing: 1,
  },
  otpInput: {
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    letterSpacing: 12,
    marginBottom: 12,
  },
  changeNumberBtn: {
    alignSelf: 'center',
    paddingVertical: 4,
  },
  changeNumberText: {
    fontSize: 13,
    color: colors.primaryLight,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  disclaimer: {
    alignItems: 'center',
  },
  disclaimerText: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 18,
  },
});
