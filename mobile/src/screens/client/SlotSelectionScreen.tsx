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

type Props = NativeStackScreenProps<RootStackParamList, 'SlotSelection'>;

export const SlotSelectionScreen: React.FC<Props> = ({ navigation, route }) => {
  const { lawyer, mode, fee } = route.params;

  // Generate next 14 days
  const today = new Date();
  const dates = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(today.getDate() + i);
    return {
      isoString: d.toISOString().split('T')[0],
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNumber: d.getDate(),
      month: d.toLocaleDateString('en-US', { month: 'short' }),
    };
  });

  const [selectedDate, setSelectedDate] = useState(dates[0].isoString);
  const [slots, setSlots] = useState<Array<{ time: string; is_available: boolean }>>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSlots(selectedDate);
  }, [selectedDate]);

  const fetchSlots = async (date: string) => {
    try {
      setLoading(true);
      setSelectedSlot(null);
      const res = await apiClient.get(`/lawyers/${lawyer.user_id}/availability`, {
        params: { date, mode },
      });

      if (res.data.success) {
        setSlots(res.data.data.slots);
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Unable to retrieve availability slots');
    } finally {
      setLoading(false);
    }
  };

  const handleProceed = () => {
    if (!selectedSlot) {
      Alert.alert('Select a Slot', 'Please choose an available appointment time slot');
      return;
    }

    const scheduledStart = `${selectedDate}T${selectedSlot}:00.000Z`;

    navigation.navigate('BookingSummary', {
      lawyer,
      mode,
      scheduled_start: scheduledStart,
      fee,
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.stepTag}>STEP 2 OF 3</Text>
        <Text style={styles.title}>Select Date & Time</Text>
        <Text style={styles.subtitle}>
          Book your 20-minute consultation slot with {lawyer.full_name}.
        </Text>

        {/* Date Selector Carousel */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateCarousel}>
          {dates.map((item) => {
            const isSelected = selectedDate === item.isoString;
            return (
              <TouchableOpacity
                key={item.isoString}
                style={[styles.dateCard, isSelected && styles.activeDateCard]}
                onPress={() => setSelectedDate(item.isoString)}
              >
                <Text style={[styles.dayName, isSelected && styles.activeDateText]}>
                  {item.dayName}
                </Text>
                <Text style={[styles.dayNumber, isSelected && styles.activeDateText]}>
                  {item.dayNumber}
                </Text>
                <Text style={[styles.monthName, isSelected && styles.activeDateText]}>
                  {item.month}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Time Slots Section */}
        <View style={styles.slotsSection}>
          <Text style={styles.slotsHeader}>Available Time Slots (IST)</Text>

          {loading ? (
            <ActivityIndicator color={colors.primary} style={{ marginVertical: 30 }} />
          ) : slots.length === 0 ? (
            <Text style={styles.noSlotsText}>No slots available on this date. Please pick another date.</Text>
          ) : (
            <View style={styles.slotsGrid}>
              {slots.map((slot) => {
                const isSelected = selectedSlot === slot.time;
                return (
                  <TouchableOpacity
                    key={slot.time}
                    disabled={!slot.is_available}
                    style={[
                      styles.slotPill,
                      !slot.is_available && styles.disabledSlotPill,
                      isSelected && styles.activeSlotPill,
                    ]}
                    onPress={() => setSelectedSlot(slot.time)}
                  >
                    <Text
                      style={[
                        styles.slotText,
                        !slot.is_available && styles.disabledSlotText,
                        isSelected && styles.activeSlotText,
                      ]}
                    >
                      {slot.time}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.proceedBtn, !selectedSlot && styles.disabledProceedBtn]}
          disabled={!selectedSlot}
          onPress={handleProceed}
        >
          <Text style={styles.proceedBtnText}>
            {selectedSlot ? `Confirm Slot ${selectedSlot} →` : 'Choose a Slot to Proceed'}
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
  dateCarousel: {
    marginBottom: 24,
  },
  dateCard: {
    width: 68,
    height: 84,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    gap: 2,
  },
  activeDateCard: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dayName: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '600',
  },
  dayNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  monthName: {
    fontSize: 11,
    color: colors.textLight,
  },
  activeDateText: {
    color: colors.white,
  },
  slotsSection: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },
  slotsHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  slotPill: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.borderDark,
    width: '30%',
    alignItems: 'center',
  },
  activeSlotPill: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  disabledSlotPill: {
    backgroundColor: '#F1F5F9',
    borderColor: '#E2E8F0',
    opacity: 0.4,
  },
  slotText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  activeSlotText: {
    color: colors.white,
  },
  disabledSlotText: {
    color: colors.textLight,
  },
  noSlotsText: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    marginVertical: 20,
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
  proceedBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  disabledProceedBtn: {
    backgroundColor: colors.borderDark,
  },
  proceedBtnText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
});
