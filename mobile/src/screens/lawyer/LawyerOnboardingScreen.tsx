import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { colors } from '../../theme/colors';
import { apiClient } from '../../api/client';

export const LawyerOnboardingScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [barCouncilNumber, setBarCouncilNumber] = useState('');
  const [stateBarCouncil, setStateBarCouncil] = useState('Bar Council of Delhi');
  const [yearOfEnrollment, setYearOfEnrollment] = useState('2015');
  const [experienceYears, setExperienceYears] = useState('9');
  const [bio, setBio] = useState('');
  const [city, setCity] = useState('New Delhi');
  const [stateName, setStateName] = useState('Delhi');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!barCouncilNumber.trim() || !fullName.trim()) {
      Alert.alert('Required Fields', 'Please fill in your full name and Bar Council registration number.');
      return;
    }

    try {
      setLoading(true);
      const res = await apiClient.post('/lawyers/onboarding', {
        full_name: fullName,
        bar_council_number: barCouncilNumber,
        state_bar_council: stateBarCouncil,
        year_of_enrollment: parseInt(yearOfEnrollment, 10),
        experience_years: parseInt(experienceYears, 10),
        bio,
        city,
        state: stateName,
        category_ids: ['c0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000002'],
        bar_id_front_url: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=400',
        bar_id_back_url: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=400',
        degree_url: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=400',
      });

      if (res.data.success) {
        Alert.alert(
          'Application Submitted',
          'Your credentials and Bar Council enrollment have been submitted to our compliance desk for verification. You will be notified within 24-48 hours.',
          [
            {
              text: 'Go to Dashboard',
              onPress: () => navigation.replace('LawyerDashboard'),
            },
          ]
        );
      }
    } catch (err: any) {
      Alert.alert('Submission Error', err.response?.data?.message || 'Failed to submit advocate onboarding application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.badgeRow}>
          <Text style={styles.badgeText}>ADVOCATE CREDENTIALING</Text>
        </View>
        <Text style={styles.title}>Bar Council Verification</Text>
        <Text style={styles.subtitle}>
          Provide your Bar Council enrollment details to activate your verified advocate profile.
        </Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full Name as per Bar Council *</Text>
          <TextInput
            style={styles.input}
            placeholder="Adv. Rajesh Sharma"
            placeholderTextColor={colors.textLight}
            value={fullName}
            onChangeText={setFullName}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Bar Council Enrollment Number *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. D/1482/2010"
            placeholderTextColor={colors.textLight}
            autoCapitalize="characters"
            value={barCouncilNumber}
            onChangeText={setBarCouncilNumber}
          />
        </View>

        <View style={styles.inputRow}>
          <View style={[styles.inputGroup, { flex: 1.2 }]}>
            <Text style={styles.label}>State Bar Council</Text>
            <TextInput
              style={styles.input}
              placeholder="Bar Council of Delhi"
              placeholderTextColor={colors.textLight}
              value={stateBarCouncil}
              onChangeText={setStateBarCouncil}
            />
          </View>
          <View style={[styles.inputGroup, { flex: 0.8 }]}>
            <Text style={styles.label}>Enrollment Year</Text>
            <TextInput
              style={styles.input}
              placeholder="2015"
              placeholderTextColor={colors.textLight}
              keyboardType="number-pad"
              value={yearOfEnrollment}
              onChangeText={setYearOfEnrollment}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Years of Court Practice Experience</Text>
          <TextInput
            style={styles.input}
            placeholder="9"
            placeholderTextColor={colors.textLight}
            keyboardType="number-pad"
            value={experienceYears}
            onChangeText={setExperienceYears}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Professional Biography / Summary</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Describe your areas of specialization, landmark cases, or court chambers..."
            placeholderTextColor={colors.textLight}
            multiline
            numberOfLines={4}
            value={bio}
            onChangeText={setBio}
          />
        </View>

        <TouchableOpacity
          style={styles.submitBtn}
          onPress={handleSubmit}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.submitBtnText}>Submit for Bar Verification</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  badgeRow: {
    alignSelf: 'flex-start',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#92400E',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 18,
  },
  form: {
    gap: 16,
  },
  inputGroup: {
    gap: 6,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  input: {
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.borderDark,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: colors.text,
  },
  textArea: {
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.borderDark,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: colors.text,
    textAlignVertical: 'top',
    height: 100,
  },
  submitBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  submitBtnText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
});
