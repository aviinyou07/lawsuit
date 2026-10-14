import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';
import { ConsultationMode } from '../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'ConsultationType'>;

export const ConsultationTypeScreen: React.FC<Props> = ({ navigation, route }) => {
  const { lawyer } = route.params;
  const [selectedMode, setSelectedMode] = useState<ConsultationMode>('VIDEO');

  const modes: Array<{
    mode: ConsultationMode;
    title: string;
    icon: string;
    duration: string;
    desc: string;
    fee: number;
  }> = [
    {
      mode: 'VIDEO',
      title: 'Video Consultation',
      icon: '📹',
      duration: '20 Mins',
      desc: 'Encrypted face-to-face video consultation with live document review.',
      fee: lawyer.consultation_fee_video || 999,
    },
    {
      mode: 'AUDIO',
      title: 'Audio Phone Call',
      icon: '📞',
      duration: '20 Mins',
      desc: 'Private high-fidelity voice call for fast confidential legal guidance.',
      fee: lawyer.consultation_fee_audio || 699,
    },
    {
      mode: 'CHAT',
      title: '24-Hour Secure Chat',
      icon: '💬',
      duration: '24 Hours',
      desc: 'Asynchronous text messaging channel with lawyer to exchange papers.',
      fee: lawyer.consultation_fee_chat || 499,
    },
    {
      mode: 'OFFLINE',
      title: 'In-Person Chamber Visit',
      icon: '🏛️',
      duration: '45 Mins',
      desc: 'Physical consultation at advocate chambers in Delhi High Court.',
      fee: lawyer.consultation_fee_offline || 1999,
    },
  ];

  const currentOption = modes.find((m) => m.mode === selectedMode)!;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.stepTag}>STEP 1 OF 3</Text>
        <Text style={styles.title}>Select Consultation Mode</Text>
        <Text style={styles.subtitle}>
          Choose how you wish to connect with {lawyer.full_name}.
        </Text>

        <View style={styles.modesList}>
          {modes.map((item) => {
            const isSelected = selectedMode === item.mode;
            return (
              <TouchableOpacity
                key={item.mode}
                style={[styles.modeCard, isSelected && styles.activeModeCard]}
                onPress={() => setSelectedMode(item.mode)}
                activeOpacity={0.8}
              >
                <View style={styles.modeCardHeader}>
                  <View style={styles.iconAndTitle}>
                    <Text style={styles.modeIcon}>{item.icon}</Text>
                    <View>
                      <Text style={styles.modeTitle}>{item.title}</Text>
                      <Text style={styles.modeDuration}>{item.duration}</Text>
                    </View>
                  </View>
                  <Text style={styles.modeFee}>₹{item.fee}</Text>
                </View>

                <Text style={styles.modeDesc}>{item.desc}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.continueBtn}
          onPress={() =>
            navigation.navigate('SlotSelection', {
              lawyer,
              mode: selectedMode,
              fee: currentOption.fee,
            })
          }
        >
          <Text style={styles.continueBtnText}>
            Continue to Slot Selection (₹{currentOption.fee})
          </Text>
        </TouchableOpacity>
      </View>
    </View>
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
    paddingBottom: 100,
  },
  backBtn: {
    marginBottom: 16,
  },
  backBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primaryLight,
  },
  stepTag: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.secondary,
    letterSpacing: 1,
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: 20,
  },
  modesList: {
    gap: 14,
  },
  modeCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  activeModeCard: {
    borderColor: colors.primary,
    backgroundColor: '#F8FAFC',
  },
  modeCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconAndTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  modeIcon: {
    fontSize: 26,
  },
  modeTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  modeDuration: {
    fontSize: 12,
    color: colors.textMuted,
  },
  modeFee: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primary,
  },
  modeDesc: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 18,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderColor: colors.border,
  },
  continueBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  continueBtnText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
});
