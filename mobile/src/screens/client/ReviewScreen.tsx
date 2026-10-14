import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';
import { apiClient } from '../../api/client';

type Props = NativeStackScreenProps<RootStackParamList, 'Review'>;

export const ReviewScreen: React.FC<Props> = ({ navigation, route }) => {
  const { appointment_id, lawyer_name } = route.params;
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const res = await apiClient.post('/reviews', {
        appointment_id,
        rating,
        review_title: title.trim() || undefined,
        review_text: feedback.trim() || undefined,
      });

      if (res.data.success) {
        Alert.alert('Review Submitted', 'Thank you for rating your consultation!', [
          {
            text: 'Return Home',
            onPress: () => navigation.navigate('Main', { screen: 'HomeTab' }),
          },
        ]);
      }
    } catch (err: any) {
      Alert.alert('Submission Error', err.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.stepTag}>FEEDBACK & RATING</Text>
        <Text style={styles.title}>How was your consultation with {lawyer_name}?</Text>
        <Text style={styles.subtitle}>
          Your verified review helps fellow citizens find trusted advocates.
        </Text>
      </View>

      {/* Star Selector */}
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => setRating(star)}>
            <Text style={[styles.starIcon, rating >= star && styles.activeStar]}>
              ★
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.ratingLabel}>
        {rating === 5 && 'Outstanding Legal Guidance'}
        {rating === 4 && 'Very Knowledgeable & Helpful'}
        {rating === 3 && 'Satisfactory Consultation'}
        {rating === 2 && 'Could Have Been Better'}
        {rating === 1 && 'Unsatisfactory'}
      </Text>

      {/* Review Form */}
      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Headline / Title</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Prompt advice on tenancy dispute"
            placeholderTextColor={colors.textLight}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Detailed Feedback</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Describe your experience with advocate punctuality, clarity, and legal depth..."
            placeholderTextColor={colors.textLight}
            multiline
            numberOfLines={4}
            value={feedback}
            onChangeText={setFeedback}
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
            <Text style={styles.submitBtnText}>Submit Review</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.skipBtn}
          onPress={() => navigation.navigate('Main', { screen: 'HomeTab' })}
        >
          <Text style={styles.skipBtnText}>Skip for Now</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.surface,
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  stepTag: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.secondary,
    letterSpacing: 1,
    marginBottom: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  starIcon: {
    fontSize: 44,
    color: colors.borderDark,
  },
  activeStar: {
    color: colors.ratingGold,
  },
  ratingLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 32,
  },
  form: {
    width: '100%',
    gap: 18,
  },
  inputGroup: {
    gap: 8,
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
    marginTop: 8,
  },
  submitBtnText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  skipBtn: {
    alignSelf: 'center',
    paddingVertical: 8,
  },
  skipBtnText: {
    fontSize: 14,
    color: colors.textMuted,
    fontWeight: '600',
  },
});
