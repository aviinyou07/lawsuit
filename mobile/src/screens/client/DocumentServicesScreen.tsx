import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ClientTabParamList, RootStackParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';
import { apiClient } from '../../api/client';
import { DocumentService } from '../../types';

type Props = CompositeScreenProps<
  BottomTabScreenProps<ClientTabParamList, 'ServicesTab'>,
  NativeStackScreenProps<RootStackParamList>
>;

export const DocumentServicesScreen: React.FC<Props> = ({ navigation }) => {
  const [services, setServices] = useState<DocumentService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/documents/services');
      if (res.data.success) {
        setServices(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderService = (service: DocumentService) => {
    (navigation as any).navigate('DocumentRequest', {
      service_id: service.id,
      service_title: service.name,
      base_fee: service.standard_price,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Document Drafting Services</Text>
        <Text style={styles.subtitle}>
          Contracts, notices, affidavits, and agreements drafted and verified by senior legal practitioners.
        </Text>
      </View>

      {/* Legal Notice Special Banner */}
      <TouchableOpacity
        style={styles.noticeBanner}
        onPress={() => (navigation as any).navigate('LegalNotice')}
        activeOpacity={0.8}
      >
        <Text style={styles.noticeBannerIcon}>⚖️</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.noticeBannerTitle}>Formal Legal Demand Notice</Text>
          <Text style={styles.noticeBannerSub}>Section 138 NI Act, Eviction, Consumer Dues with Speed Post dispatch</Text>
        </View>
        <Text style={styles.chevron}>›</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={services}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.priceText}>₹{item.standard_price}</Text>
              </View>

              <Text style={styles.description}>{item.description}</Text>

              <View style={styles.perksRow}>
                <View style={styles.perk}>
                  <Text style={styles.perkIcon}>⏱️</Text>
                  <Text style={styles.perkText}>{item.delivery_sla_days} Days Delivery</Text>
                </View>
                <View style={styles.perk}>
                  <Text style={styles.perkIcon}>🔄</Text>
                  <Text style={styles.perkText}>{item.revisions_included} Free Revisions</Text>
                </View>
                <View style={styles.perk}>
                  <Text style={styles.perkIcon}>✓</Text>
                  <Text style={styles.perkText}>Advocate Signed</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.orderBtn}
                onPress={() => handleOrderService(item)}
                activeOpacity={0.8}
              >
                <Text style={styles.orderBtnText}>Request Drafting (₹{item.standard_price})</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
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
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 18,
  },
  list: {
    padding: 20,
    gap: 16,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
    marginRight: 10,
  },
  priceText: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primary,
  },
  description: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 19,
  },
  perksRow: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 12,
    padding: 10,
    justifyContent: 'space-between',
  },
  perk: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  perkIcon: {
    fontSize: 12,
  },
  perkText: {
    fontSize: 11,
    color: colors.text,
    fontWeight: '600',
  },
  orderBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  orderBtnText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  noticeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#3B82F6',
    padding: 14,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  noticeBannerIcon: {
    fontSize: 22,
    marginRight: 10,
  },
  noticeBannerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.white,
  },
  noticeBannerSub: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  chevron: {
    fontSize: 20,
    color: colors.textMuted,
    marginLeft: 6,
  },
});
