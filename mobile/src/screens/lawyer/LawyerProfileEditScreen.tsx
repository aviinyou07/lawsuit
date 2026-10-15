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
import { ArrowLeft, Save, ShieldCheck } from 'lucide-react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'LawyerProfileEdit'>;

export const LawyerProfileEditScreen: React.FC<Props> = ({ navigation }) => {
  const [bio, setBio] = useState('Senior Advocate practicing primarily before the High Court of Delhi and District Courts. Specializes in criminal defense, property litigation, and commercial arbitrations.');
  const [experience, setExperience] = useState('14');
  const [chatFee, setChatFee] = useState('499');
  const [audioFee, setAudioFee] = useState('999');
  const [videoFee, setVideoFee] = useState('1500');
  const [offlineFee, setOfflineFee] = useState('3000');
  const [city, setCity] = useState('New Delhi');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await apiClient.put('/lawyers/profile/settings', {
        bio,
        experience_years: parseInt(experience, 10),
        chat_fee: parseFloat(chatFee),
        audio_fee: parseFloat(audioFee),
        video_fee: parseFloat(videoFee),
        offline_fee: parseFloat(offlineFee),
        city,
      });

      if (res.data.success) {
        Alert.alert('Profile Updated', 'Your consultation fees and bio have been updated across the marketplace.');
      }
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Advocate Profile & Fees</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.badgeBox}>
          <ShieldCheck size={18} color={colors.secondary} style={{ marginRight: 8 }} />
          <Text style={styles.badgeText}>Enrolled Advocate • Bar Council Verified</Text>
        </View>

        {/* Bio */}
        <Text style={styles.label}>Professional Biography / Summary</Text>
        <TextInput
          style={styles.textArea}
          multiline
          numberOfLines={4}
          value={bio}
          onChangeText={setBio}
        />

        {/* Experience & City */}
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Years of Experience</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={experience}
              onChangeText={setExperience}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Primary Practice City</Text>
            <TextInput
              style={styles.input}
              value={city}
              onChangeText={setCity}
            />
          </View>
        </View>

        {/* Consultation Pricing Structure */}
        <Text style={styles.sectionTitle}>Consultation Fee Structure (₹)</Text>

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Chat Consultation</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={chatFee}
              onChangeText={setChatFee}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Audio Call (30m)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={audioFee}
              onChangeText={setAudioFee}
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Video Call (45m)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={videoFee}
              onChangeText={setVideoFee}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>In-Person Chambers</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={offlineFee}
              onChangeText={setOfflineFee}
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.saveBtn}
          onPress={handleSave}
          disabled={saving}
          activeOpacity={0.8}
        >
          {saving ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Save size={18} color={colors.white} />
              <Text style={styles.saveBtnText}>Save Profile Changes</Text>
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
  badgeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
    marginBottom: 20,
  },
  badgeText: {
    fontSize: 13,
    color: colors.secondary,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
    marginTop: 14,
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
    minHeight: 90,
    textAlignVertical: 'top',
    marginBottom: 14,
  },
  saveBtn: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  saveBtnText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
});
