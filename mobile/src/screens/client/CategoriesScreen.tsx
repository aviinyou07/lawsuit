import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';
import {
  ShieldAlert,
  Home,
  HeartHandshake,
  Building2,
  Briefcase,
  Smartphone,
  Landmark,
  Scale,
  Car,
  FileText,
  Search,
  ArrowLeft,
  ChevronRight,
} from 'lucide-react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'Categories'>;

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  lawyer_count: number;
  sub_areas: string[];
  icon: any;
}

const CATEGORIES: CategoryItem[] = [
  {
    id: 'c1',
    name: 'Criminal Law',
    slug: 'criminal',
    description: 'Bail applications, FIR quashing, IPC/BNS offenses, police investigations.',
    lawyer_count: 84,
    sub_areas: ['Regular & Anticipatory Bail', 'FIR Quashing (482 CrPC)', 'Cyber Fraud & Extortion', 'Narcotics (NDPS)'],
    icon: ShieldAlert,
  },
  {
    id: 'c2',
    name: 'Civil Law',
    slug: 'civil',
    description: 'Property partition, recovery suits, injunctions, breach of contract.',
    lawyer_count: 92,
    sub_areas: ['Injunctions & Stay Orders', 'Money Recovery Suit', 'Property Partition', 'Specific Performance'],
    icon: Scale,
  },
  {
    id: 'c3',
    name: 'Family & Divorce',
    slug: 'family',
    description: 'Mutual divorce, contested divorce, child custody, maintenance & 498A.',
    lawyer_count: 67,
    sub_areas: ['Mutual Consent Divorce', 'Child Custody & Visitation', 'Alimony & Maintenance (125 CrPC)', 'Domestic Violence (DV Act)'],
    icon: HeartHandshake,
  },
  {
    id: 'c4',
    name: 'Property & Real Estate',
    slug: 'property',
    description: 'Title search verification, RERA builder disputes, tenant eviction, registry.',
    lawyer_count: 73,
    sub_areas: ['RERA Builder Delay Claims', 'Title Verification & Due Diligence', 'Illegal Possession & Eviction', 'Sale Deed / Lease Disputes'],
    icon: Home,
  },
  {
    id: 'c5',
    name: 'Consumer Protection',
    slug: 'consumer',
    description: 'Defective products, builder delays, medical negligence, insurance denial.',
    lawyer_count: 45,
    sub_areas: ['District Consumer Forum', 'Insurance Claim Rejection', 'E-commerce & Flight Refunds', 'Medical Malpractice'],
    icon: Building2,
  },
  {
    id: 'c6',
    name: 'Cyber Crime',
    slug: 'cyber',
    description: 'UPI fraud, financial phishing, identity theft, unauthorized account access.',
    lawyer_count: 38,
    sub_areas: ['Bank Account Freeze & Lien', 'Crypto & Forex Investment Fraud', 'Online Harassment & Defamation', 'Data Theft'],
    icon: Smartphone,
  },
  {
    id: 'c7',
    name: 'Corporate & Business',
    slug: 'corporate',
    description: 'Startup structuring, shareholder agreements, NCLT insolvency, commercial contracts.',
    lawyer_count: 51,
    sub_areas: ['NCLT Insolvency (IBC)', 'Co-founder & Shareholder Agreements', 'Trademark / Copyright Filing', 'Commercial Contracts'],
    icon: Briefcase,
  },
  {
    id: 'c8',
    name: 'Employment & Labour',
    slug: 'labour',
    description: 'Wrongful termination, unpaid salary dues, POSH compliance, non-compete clauses.',
    lawyer_count: 34,
    sub_areas: ['Unpaid Gratuity & Severance', 'Wrongful Termination Notice', 'POSH Internal Complaints', 'Non-Compete Enforceability'],
    icon: FileText,
  },
  {
    id: 'c9',
    name: 'Cheque Bounce & Finance',
    slug: 'cheque',
    description: 'Section 138 NI Act notices, debt recovery tribunals (DRT), loan disputes.',
    lawyer_count: 59,
    sub_areas: ['Sec 138 NI Act Demand Notice', 'DRT Loan Settlement', 'Promissory Note Enforcement', 'Arbitration in Finance'],
    icon: Landmark,
  },
  {
    id: 'c10',
    name: 'Accident & Motor Claims',
    slug: 'accident',
    description: 'MACT claim compensation, vehicular third-party insurance disputes.',
    lawyer_count: 29,
    sub_areas: ['MACT Tribunal Filings', 'Hit & Run Compensation', 'Third Party Damage Claims', 'Commercial Vehicle Disputes'],
    icon: Car,
  },
];

export const CategoriesScreen: React.FC<Props> = ({ navigation }) => {
  const [search, setSearch] = useState('');

  const filtered = CATEGORIES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase()) ||
      c.sub_areas.some((s) => s.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Legal Practice Areas</Text>
        <View style={{ width: 22 }} />
      </View>

      <View style={styles.searchContainer}>
        <Search size={18} color={colors.textMuted} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search categories (e.g. Divorce, RERA, Bail)..."
          placeholderTextColor={colors.textLight}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => {
          const IconComponent = item.icon;
          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() =>
                navigation.navigate('LawyerListing', {
                  category_id: item.id,
                  category_name: item.name,
                })
              }
              activeOpacity={0.7}
            >
              <View style={styles.cardTop}>
                <View style={styles.iconCircle}>
                  <IconComponent size={24} color={colors.primary} />
                </View>
                <View style={styles.cardInfo}>
                  <Text style={styles.categoryName}>{item.name}</Text>
                  <Text style={styles.lawyerBadge}>{item.lawyer_count}+ Advocates</Text>
                </View>
                <ChevronRight size={20} color={colors.textMuted} />
              </View>

              <Text style={styles.description}>{item.description}</Text>

              <View style={styles.tagsRow}>
                {item.sub_areas.slice(0, 3).map((sub, idx) => (
                  <View key={idx} style={styles.subTag}>
                    <Text style={styles.subTagText}>{sub}</Text>
                  </View>
                ))}
              </View>
            </TouchableOpacity>
          );
        }}
      />
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSubtle,
    marginHorizontal: 20,
    marginVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderDark,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    color: colors.text,
    fontSize: 15,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 14,
  },
  card: {
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderDark,
    padding: 18,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderDark,
    marginRight: 14,
  },
  cardInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  lawyerBadge: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
  description: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 18,
    marginBottom: 12,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  subTag: {
    backgroundColor: colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.borderDark,
  },
  subTagText: {
    fontSize: 11,
    color: colors.textLight,
  },
});
