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

type Props = NativeStackScreenProps<RootStackParamList, 'DocumentWorkspace'>;

export const DocumentWorkspaceScreen: React.FC<Props> = ({ navigation, route }) => {
  const { order_id } = route.params;
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, [order_id]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(`/documents/orders/${order_id}`);
      if (res.data.success) {
        setOrder(res.data.data);
      }
    } catch (err: any) {
      console.error(err);
      Alert.alert('Error', 'Failed to load document order workspace');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { title: 'Intake Submitted', desc: 'Requirements received', done: true },
    { title: 'Lawyer Assigned', desc: 'Senior advocate reviewing', done: true },
    { title: 'Drafting v1.0', desc: 'Initial draft in preparation', done: order?.status !== 'REQUESTED' },
    { title: 'Client Review', desc: 'Revisions & annotations', done: order?.status === 'IN_REVIEW' || order?.status === 'COMPLETED' },
    { title: 'Final Approved', desc: 'Digitally sealed & verified', done: order?.status === 'COMPLETED' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Text style={styles.backBtnText}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.orderTag}>DOCUMENT WORKSPACE</Text>
        <Text style={styles.title}>{order?.service_name || 'Legal Drafting Order'}</Text>
        <Text style={styles.refText}>Order Reference: #{order?.order_reference || 'DOC-2026'}</Text>
      </View>

      {/* Lifecycle Stepper */}
      <View style={styles.stepperCard}>
        <Text style={styles.cardTitle}>Drafting Progress</Text>
        <View style={styles.stepper}>
          {steps.map((s, i) => (
            <View key={i} style={styles.stepRow}>
              <View style={[styles.stepCircle, s.done && styles.stepCircleActive]}>
                <Text style={styles.stepNum}>{s.done ? '✓' : i + 1}</Text>
              </View>
              <View style={styles.stepText}>
                <Text style={[styles.stepTitle, s.done && styles.stepTitleActive]}>{s.title}</Text>
                <Text style={styles.stepDesc}>{s.desc}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Versions & Drafts Section */}
      <View style={styles.draftsCard}>
        <Text style={styles.cardTitle}>Version History & Files</Text>
        <View style={styles.draftItem}>
          <Text style={styles.fileIcon}>📄</Text>
          <View style={styles.fileInfo}>
            <Text style={styles.fileName}>Draft_v1.0_Rent_Agreement.docx</Text>
            <Text style={styles.fileMeta}>Uploaded by Adv. Sharma • 24 KB</Text>
          </View>
          <TouchableOpacity
            style={styles.downloadBtn}
            onPress={() => Alert.alert('Downloading', 'Draft v1.0 file downloaded to secure vault.')}
          >
            <Text style={styles.downloadBtnText}>View</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.approveBtn}
          onPress={() =>
            Alert.alert(
              'Approve Final Draft',
              'Approving the final draft will release the escrow funds to the advocate and generate the official digitally sealed PDF. Proceed?',
              [
                { text: 'Request Changes', style: 'cancel' },
                {
                  text: 'Approve & Release',
                  onPress: () => Alert.alert('Success', 'Document finalized and saved to your Vault!'),
                },
              ]
            )
          }
        >
          <Text style={styles.approveBtnText}>Approve Final Document ✓</Text>
        </TouchableOpacity>
      </View>
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
  orderTag: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.secondary,
    letterSpacing: 1,
    marginBottom: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  refText: {
    fontSize: 13,
    color: colors.textMuted,
  },
  stepperCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  stepper: {
    gap: 14,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1.5,
    borderColor: colors.borderDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepCircleActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  stepNum: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.white,
  },
  stepText: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textMuted,
  },
  stepTitleActive: {
    color: colors.text,
    fontWeight: '700',
  },
  stepDesc: {
    fontSize: 12,
    color: colors.textLight,
  },
  draftsCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 14,
  },
  draftItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  fileIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  fileMeta: {
    fontSize: 11,
    color: colors.textMuted,
  },
  downloadBtn: {
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderDark,
  },
  downloadBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  approveBtn: {
    backgroundColor: colors.accent,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 6,
  },
  approveBtnText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
});
