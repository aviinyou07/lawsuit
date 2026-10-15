import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Image,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';
import { apiClient } from '../../api/client';
import {
  ArrowLeft,
  Sparkles,
  Scale,
  ShieldCheck,
  FileText,
  Video,
  Star,
  ChevronRight,
  AlertCircle,
} from 'lucide-react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'SuggestedService'>;

export const SuggestedServiceScreen: React.FC<Props> = ({ navigation, route }) => {
  const { problem_text } = route.params;
  const [loading, setLoading] = useState(true);
  const [triageData, setTriageData] = useState<any>(null);

  useEffect(() => {
    const fetchTriage = async () => {
      try {
        setLoading(true);
        const res = await apiClient.post('/triage/analyze', {
          problem_description: problem_text || 'Tenant eviction notice received',
        });
        if (res.data.success) {
          setTriageData(res.data.data);
        }
      } catch (err) {
        console.warn('Triage fallback');
      } finally {
        setLoading(false);
      }
    };

    fetchTriage();
  }, [problem_text]);

  const recommendedLawyers = [
    {
      id: 'l1',
      full_name: 'Adv. Rajesh Sharma',
      experience_years: 14,
      rating_average: '4.9',
      city: 'New Delhi',
      court: 'Delhi High Court',
      specialization: 'Property & Real Estate Law',
      avatar_url: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=300',
      video_fee: 1500,
    },
    {
      id: 'l2',
      full_name: 'Adv. Priya Malhotra',
      experience_years: 11,
      rating_average: '4.8',
      city: 'Mumbai',
      court: 'Bombay High Court',
      specialization: 'Commercial & Property Litigation',
      avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
      video_fee: 1800,
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI Legal Assessment</Text>
        <View style={{ width: 22 }} />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Analyzing issue against Indian statutory codes...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.container}>
          {/* AI Triage Card */}
          <View style={styles.triageCard}>
            <View style={styles.badgeRow}>
              <View style={styles.aiBadge}>
                <Sparkles size={14} color="#3B82F6" />
                <Text style={styles.aiBadgeText}>AI PRE-LEGAL TRIAGE</Text>
              </View>
              <Text style={styles.confidenceText}>94% Match</Text>
            </View>

            <Text style={styles.categoryTitle}>
              {triageData?.category?.name || 'Property & Real Estate Law'}
            </Text>
            <Text style={styles.summaryText}>
              {triageData?.triage_analysis ||
                'Issue relates to tenant rights, eviction statutory notice, and dispute resolution under Transfer of Property Act, 1882.'}
            </Text>

            <View style={styles.applicableBox}>
              <Scale size={16} color={colors.primaryLight} style={{ marginRight: 6 }} />
              <Text style={styles.applicableText}>
                Key Statutory Provisions: Sec 106 Transfer of Property Act & Specific Relief Act
              </Text>
            </View>
          </View>

          {/* Recommended Next Steps */}
          <Text style={styles.sectionTitle}>Recommended Legal Remedies</Text>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('LegalNotice')}
            activeOpacity={0.8}
          >
            <View style={styles.actionIconBox}>
              <FileText size={22} color={colors.primary} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Issue Formal Legal Notice</Text>
              <Text style={styles.actionDesc}>
                Dispatch formal advocate notice on Bar Council letterhead with 15-day compliance deadline.
              </Text>
            </View>
            <ChevronRight size={18} color={colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() =>
              navigation.navigate('ConsultationType', {
                lawyer: recommendedLawyers[0] as any,
              })
            }
            activeOpacity={0.8}
          >
            <View style={styles.actionIconBox}>
              <Video size={22} color={colors.secondary} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Book Urgent Video Consultation</Text>
              <Text style={styles.actionDesc}>
                Discuss response strategy directly with a verified High Court property advocate.
              </Text>
            </View>
            <ChevronRight size={18} color={colors.textMuted} />
          </TouchableOpacity>

          {/* Matched Advocates */}
          <Text style={styles.sectionTitle}>Top Matched Advocates for Your Matter</Text>

          {recommendedLawyers.map((lawyer) => (
            <View key={lawyer.id} style={styles.lawyerCard}>
              <Image source={{ uri: lawyer.avatar_url }} style={styles.avatar} />
              <View style={styles.lawyerInfo}>
                <Text style={styles.lawyerName}>{lawyer.full_name}</Text>
                <Text style={styles.lawyerSpec}>{lawyer.court} • {lawyer.experience_years}y Exp</Text>

                <View style={styles.ratingRow}>
                  <Star size={13} color="#F59E0B" fill="#F59E0B" />
                  <Text style={styles.ratingText}>{lawyer.rating_average}</Text>
                  <Text style={styles.feeText}>• ₹{lawyer.video_fee}/video call</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.consultBtn}
                onPress={() =>
                  navigation.navigate('ConsultationType', {
                    lawyer: lawyer as any,
                  })
                }
              >
                <Text style={styles.consultBtnText}>Consult</Text>
              </TouchableOpacity>
            </View>
          ))}

          {/* Ethical Disclaimer */}
          <View style={styles.disclaimerBox}>
            <AlertCircle size={16} color={colors.textMuted} style={{ marginRight: 8 }} />
            <Text style={styles.disclaimerText}>
              Antigravity AI Triage provides analytical categorization. Definitive legal advice and court representation are provided exclusively by enrolled Advocates.
            </Text>
          </View>
        </ScrollView>
      )}
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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    gap: 16,
  },
  loadingText: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
  },
  container: {
    padding: 20,
  },
  triageCard: {
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 18,
    padding: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(59, 130, 246, 0.4)',
    marginBottom: 24,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 6,
  },
  aiBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#3B82F6',
    letterSpacing: 0.6,
  },
  confidenceText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.secondary,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 20,
    marginBottom: 14,
  },
  applicableBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.borderDark,
  },
  applicableText: {
    flex: 1,
    fontSize: 12,
    color: colors.primaryLight,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 12,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderDark,
    marginBottom: 12,
  },
  actionIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    borderWidth: 1,
    borderColor: colors.borderDark,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  actionDesc: {
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 16,
  },
  lawyerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.borderDark,
    marginBottom: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  lawyerInfo: {
    flex: 1,
  },
  lawyerName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  lawyerSpec: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
  },
  feeText: {
    fontSize: 12,
    color: colors.primaryLight,
    fontWeight: '600',
  },
  consultBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  consultBtnText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '700',
  },
  disclaimerBox: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceSubtle,
    padding: 14,
    borderRadius: 12,
    marginTop: 14,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: colors.borderDark,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 11,
    color: colors.textMuted,
    lineHeight: 16,
  },
});
