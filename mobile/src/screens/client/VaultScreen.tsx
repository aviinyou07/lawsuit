import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { colors } from '../../theme/colors';
import { apiClient } from '../../api/client';

export const VaultScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [vaultDocs, setVaultDocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchVault();
  }, []);

  const fetchVault = async () => {
    try {
      const res = await apiClient.get('/documents/vault');
      if (res.data.success) {
        setVaultDocs(res.data.data);
      }
    } catch (err: any) {
      console.error('Failed to fetch vault:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleUpload = () => {
    Alert.alert(
      'Upload Legal Document',
      'Select a document to encrypt and store in your private digital vault with AES-256-GCM encryption.',
      [
        {
          text: 'Upload Sale Deed / Tenancy Agreement',
          onPress: async () => {
            try {
              const res = await apiClient.post('/documents/vault/upload', {
                title: 'Registered Tenancy Agreement (2026)',
                category: 'Property',
                file_size_bytes: 2458120,
                mime_type: 'application/pdf',
              });
              if (res.data.success) {
                Alert.alert('Vault Encrypted ✅', res.data.message || 'Saved to vault');
                fetchVault();
              }
            } catch (err: any) {
              Alert.alert('Upload Error', err.response?.data?.message || 'Could not upload document');
            }
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleGrantAccess = (doc: any) => {
    Alert.alert(
      'Share with Advocate',
      `Grant temporary 48-hour access to "${doc.title}" for your consultation? Access automatically expires after 48h.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Grant 48h Access',
          onPress: async () => {
            try {
              const res = await apiClient.post(`/documents/vault/${doc.id}/grant-access`, {});
              if (res.data.success) {
                Alert.alert('Access Granted ✅', res.data.message || 'Advocate granted 48h access');
              }
            } catch (err: any) {
              Alert.alert('Error', 'Could not grant access');
            }
          },
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
        <Text style={styles.title}>Legal Document Vault</Text>
        <Text style={styles.subtitle}>
          Secure digital locker for agreements, affidavits, and court records. Your files are encrypted at rest.
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={vaultDocs}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchVault(); }} />}
          renderItem={({ item }) => (
            <View style={styles.docCard}>
              <View style={styles.docIconContainer}>
                <Text style={styles.docIcon}>📄</Text>
              </View>
              <View style={styles.docInfo}>
                <Text style={styles.docTitle}>{item.title}</Text>
                <Text style={styles.docMeta}>
                  {item.category} • {item.file_size_bytes ? `${(item.file_size_bytes / (1024 * 1024)).toFixed(1)} MB` : '1.2 MB'} • {new Date(item.updatedAt).toLocaleDateString()}
                </Text>
                <View style={styles.encryptionPill}>
                  <Text style={styles.encryptionText}>🛡️ Encrypted</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.shareBtn}
                onPress={() => handleGrantAccess(item)}
              >
                <Text style={styles.shareBtnText}>Share</Text>
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>🔒</Text>
              <Text style={styles.emptyTitle}>Vault is Empty</Text>
              <Text style={styles.emptySubtitle}>Store sensitive legal documents here with AES-256 encryption.</Text>
            </View>
          }
        />
      )}

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
    backgroundColor: colors.surface,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  backBtn: {
    marginBottom: 12,
  },
  backBtnText: {
    fontSize: 15,
    color: colors.primary,
    fontWeight: '700',
  },
  badgeRow: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#10B981',
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
  list: {
    padding: 16,
    gap: 12,
  },
  docCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  docIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: 'rgba(30, 58, 138, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  docIcon: {
    fontSize: 22,
  },
  docInfo: {
    flex: 1,
    gap: 2,
  },
  docTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  docMeta: {
    fontSize: 12,
    color: colors.textMuted,
  },
  encryptionPill: {
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  encryptionText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#10B981',
  },
  shareBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  shareBtnText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    gap: 8,
  },
  emptyIcon: {
    fontSize: 40,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  emptySubtitle: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
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
