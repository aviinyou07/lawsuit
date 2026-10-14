import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { colors } from '../../theme/colors';

export const VaultScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [vaultDocs, setVaultDocs] = useState([
    {
      id: '1',
      title: 'Aadhaar Identity Proof',
      category: 'Identity',
      fileSize: '1.2 MB',
      updatedAt: '12 Oct 2026',
      isEncrypted: true,
    },
    {
      id: '2',
      title: 'Registered Tenancy Agreement (2025-2026)',
      category: 'Property',
      fileSize: '3.8 MB',
      updatedAt: '05 Sep 2026',
      isEncrypted: true,
    },
    {
      id: '3',
      title: 'Notice under Section 138 NI Act',
      category: 'Notices',
      fileSize: '840 KB',
      updatedAt: '18 Aug 2026',
      isEncrypted: true,
    },
  ]);

  const handleUpload = () => {
    Alert.alert(
      'Upload Legal Document',
      'Select document to encrypt and store in your private vault with AES-256 encryption.',
      [
        { text: 'Choose from Files', onPress: () => Alert.alert('File Picker', 'Document uploaded & encrypted with AES-256.') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleGrantAccess = (docTitle: string) => {
    Alert.alert(
      'Share with Advocate',
      `Grant temporary 48-hour access to "${docTitle}" for your booked consultation? Access will automatically revoke afterwards.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Grant 48h Access',
          onPress: () => Alert.alert('Access Granted', 'Advocate Sharma can now securely review this document during consultation.'),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.badgeRow}>
          <Text style={styles.badgeText}>🔒 AES-256-GCM ENCRYPTED</Text>
        </View>
        <Text style={styles.title}>Encrypted Document Vault</Text>
        <Text style={styles.subtitle}>
          Secure repository for privileged legal records. Share time-bound access with counsel.
        </Text>
      </View>

      <FlatList
        data={vaultDocs}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.docCard}>
            <View style={styles.docHeader}>
              <View style={styles.iconWrap}>
                <Text style={styles.fileIcon}>📄</Text>
              </View>
              <View style={styles.docInfo}>
                <Text style={styles.docTitle}>{item.title}</Text>
                <Text style={styles.docMeta}>
                  {item.category} • {item.fileSize} • {item.updatedAt}
                </Text>
              </View>
            </View>

            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => Alert.alert('Secure Download', 'Decrypted presigned link generated. Valid for 15 minutes.')}
              >
                <Text style={styles.actionText}>View</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.shareBtn}
                onPress={() => handleGrantAccess(item.title)}
              >
                <Text style={styles.shareText}>Grant Access to Counsel</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <View style={styles.footer}>
        <TouchableOpacity style={styles.uploadBtn} onPress={handleUpload} activeOpacity={0.8}>
          <Text style={styles.uploadBtnText}>+ Upload New Document</Text>
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
  header: {
    backgroundColor: colors.surface,
    paddingTop: 54,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  backBtn: {
    marginBottom: 8,
  },
  backBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primaryLight,
  },
  badgeRow: {
    alignSelf: 'flex-start',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.accent,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
    lineHeight: 18,
  },
  list: {
    padding: 20,
    gap: 14,
    paddingBottom: 100,
  },
  docCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  docHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.surfaceSubtle,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fileIcon: {
    fontSize: 24,
  },
  docInfo: {
    flex: 1,
  },
  docTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  docMeta: {
    fontSize: 12,
    color: colors.textMuted,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    borderTopWidth: 1,
    borderColor: colors.surfaceSubtle,
    paddingTop: 10,
  },
  actionBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.borderDark,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
  shareBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  shareText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.white,
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
  uploadBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  uploadBtnText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
});
