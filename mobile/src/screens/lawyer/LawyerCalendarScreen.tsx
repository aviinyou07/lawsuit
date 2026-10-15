import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../../theme/colors';
import { apiClient } from '../../api/client';

export const LawyerCalendarScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [slotDuration, setSlotDuration] = useState(20);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [days, setDays] = useState([
    { day: 'Monday', day_of_week: 1, active: true, hours: '10:00 AM - 06:00 PM' },
    { day: 'Tuesday', day_of_week: 2, active: true, hours: '10:00 AM - 06:00 PM' },
    { day: 'Wednesday', day_of_week: 3, active: true, hours: '10:00 AM - 06:00 PM' },
    { day: 'Thursday', day_of_week: 4, active: true, hours: '10:00 AM - 06:00 PM' },
    { day: 'Friday', day_of_week: 5, active: true, hours: '10:00 AM - 06:00 PM' },
    { day: 'Saturday', day_of_week: 6, active: false, hours: 'Court Vacation / Chambers' },
    { day: 'Sunday', day_of_week: 0, active: false, hours: 'Closed' },
  ]);

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    try {
      const res = await apiClient.get('/lawyers/me/schedule');
      if (res.data.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
        const scheduleMap = new Map();
        res.data.data.forEach((s: any) => {
          scheduleMap.set(s.day_of_week, s.is_active);
          if (s.slot_duration_minutes) setSlotDuration(s.slot_duration_minutes);
        });

        setDays((prev) =>
          prev.map((d) => ({
            ...d,
            active: scheduleMap.has(d.day_of_week) ? scheduleMap.get(d.day_of_week) : d.active,
          }))
        );
      }
    } catch (err: any) {
      console.error('Failed to fetch schedule:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleDay = (index: number) => {
    setDays((prev) =>
      prev.map((d, i) => (i === index ? { ...d, active: !d.active } : d))
    );
  };

  const handleSaveSchedule = async () => {
    try {
      setSaving(true);
      const payload = {
        slot_duration_minutes: slotDuration,
        schedules: days.map((d) => ({
          day_of_week: d.day_of_week,
          is_active: d.active,
          start_time: '10:00:00',
          end_time: '18:00:00',
        })),
      };

      const res = await apiClient.post('/lawyers/me/schedule', payload);
      if (res.data.success) {
        Alert.alert('Schedule Saved ✅', 'Your working hours & slot duration have been updated.');
      }
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Could not update schedule');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Text style={styles.backBtnText}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.title}>Practice Availability Schedule</Text>
        <Text style={styles.subtitle}>
          Configure your working hours, default consultation slot length, and client booking windows.
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <>
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

          {/* Weekly Schedule Days */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Weekly Available Days</Text>
            {days.map((item, index) => (
              <View key={item.day} style={styles.dayCard}>
                <View style={styles.dayInfo}>
                  <Text style={styles.dayName}>{item.day}</Text>
                  <Text style={styles.dayHours}>{item.active ? item.hours : 'Unavailable'}</Text>
                </View>
                <Switch
                  value={item.active}
                  onValueChange={() => toggleDay(index)}
                  trackColor={{ false: colors.borderDark, true: colors.accent }}
                />
              </View>
            ))}
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={[styles.saveBtn, saving && { opacity: 0.7 }]}
            onPress={handleSaveSchedule}
            disabled={saving}
            activeOpacity={0.8}
          >
            <Text style={styles.saveBtnText}>
              {saving ? 'Updating Schedule...' : 'Save Availability Schedule'}
            </Text>
          </TouchableOpacity>
        </>
      )}
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
    paddingTop: 56,
    paddingBottom: 40,
  },
  backBtn: {
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  backBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 4,
    lineHeight: 18,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
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
  section: {
    gap: 10,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  dayCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dayInfo: {
    gap: 2,
  },
  dayName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  dayHours: {
    fontSize: 12,
    color: colors.textMuted,
  },
  saveBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  saveBtnText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
});
