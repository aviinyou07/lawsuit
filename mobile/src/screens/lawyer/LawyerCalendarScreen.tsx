import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
} from 'react-native';
import { colors } from '../../theme/colors';

export const LawyerCalendarScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [slotDuration, setSlotDuration] = useState(20);
  const [days, setDays] = useState([
    { day: 'Monday', active: true, hours: '09:00 AM - 06:00 PM' },
    { day: 'Tuesday', active: true, hours: '09:00 AM - 06:00 PM' },
    { day: 'Wednesday', active: true, hours: '09:00 AM - 06:00 PM' },
    { day: 'Thursday', active: true, hours: '09:00 AM - 06:00 PM' },
    { day: 'Friday', active: true, hours: '09:00 AM - 06:00 PM' },
    { day: 'Saturday', active: false, hours: 'Court Vacation / Chambers' },
    { day: 'Sunday', active: false, hours: 'Closed' },
  ]);

  const toggleDay = (index: number) => {
    setDays((prev) =>
      prev.map((d, i) => (i === index ? { ...d, active: !d.active } : d))
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Text style={styles.backBtnText}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.title}>Practice Availability Schedule</Text>
        <Text style={styles.subtitle}>
          Configure your working hours, default consultation slot length, and buffer time.
        </Text>
      </View>

      {/* Slot Duration Selector */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Default Slot Duration</Text>
        <View style={styles.durationPills}>
          {[15, 20, 30, 45, 60].map((dur) => (
            <TouchableOpacity
              key={dur}
              style={[styles.durPill, slotDuration === dur && styles.activeDurPill]}
              onPress={() => setSlotDuration(dur)}
            >
              <Text style={[styles.durText, slotDuration === dur && styles.activeDurText]}>
                {dur} min
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Weekly Schedule */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Weekly Working Hours</Text>
        {days.map((item, index) => (
          <View key={item.day} style={styles.dayRow}>
            <View style={styles.dayInfo}>
              <Text style={styles.dayName}>{item.day}</Text>
              <Text style={styles.dayHours}>{item.hours}</Text>
            </View>
            <Switch
              value={item.active}
              onValueChange={() => toggleDay(index)}
              trackColor={{ false: colors.borderDark, true: colors.accent }}
            />
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={styles.saveBtn}
        onPress={() => Alert.alert('Saved', 'Your weekly availability schedule has been updated.')}
        activeOpacity={0.8}
      >
        <Text style={styles.saveBtnText}>Save Schedule Changes</Text>
      </TouchableOpacity>
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
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 18,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
    gap: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  durationPills: {
    flexDirection: 'row',
    gap: 8,
  },
  durPill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  activeDurPill: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  durText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
  },
  activeDurText: {
    color: colors.white,
  },
  dayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: colors.surfaceSubtle,
  },
  dayInfo: {
    flex: 1,
  },
  dayName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  dayHours: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  saveBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  saveBtnText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
});
