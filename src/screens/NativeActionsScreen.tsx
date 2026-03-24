import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import { RootStackParamList } from '../navigation/AppNavigator';
import { theme } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'NativeActions'>;

type ActionItem = {
  title: string;
  description: string;
  screen: keyof RootStackParamList;
  params?: object;
  implemented: boolean;
};

const ITEMS: ActionItem[] = [
  {
    title: 'Call Phone',
    description: 'Dial a number via native dialer',
    screen: 'ComingSoon',
    params: { title: 'Call Phone' },
    implemented: false,
  },
  {
    title: 'Send Email',
    description: 'Open native email composer',
    screen: 'ComingSoon',
    params: { title: 'Send Email' },
    implemented: false,
  },
  {
    title: 'Open Maps',
    description: 'Navigate to an address',
    screen: 'ComingSoon',
    params: { title: 'Open Maps' },
    implemented: false,
  },
  {
    title: 'OTP / Clipboard',
    description: 'Copy and paste from clipboard',
    screen: 'ComingSoon',
    params: { title: 'OTP / Clipboard' },
    implemented: false,
  },
  {
    title: 'Share',
    description: 'Native share sheet',
    screen: 'ComingSoon',
    params: { title: 'Share' },
    implemented: false,
  },
  {
    title: 'Image Picker',
    description: 'Camera and gallery picker',
    screen: 'ComingSoon',
    params: { title: 'Image Picker' },
    implemented: false,
  },
  {
    title: 'File Picker',
    description: 'Document selection',
    screen: 'ComingSoon',
    params: { title: 'File Picker' },
    implemented: false,
  },
  {
    title: 'Haptics',
    description: 'Vibration feedback patterns',
    screen: 'ComingSoon',
    params: { title: 'Haptics' },
    implemented: false,
  },
  {
    title: 'Biometrics',
    description: 'Face ID and fingerprint auth',
    screen: 'ComingSoon',
    params: { title: 'Biometrics' },
    implemented: false,
  },
];

export default function NativeActionsScreen({ navigation }: Props) {
  const renderItem = ({ item }: { item: ActionItem }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate(item.screen as any, item.params as any)
      }
      activeOpacity={0.7}
    >
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardDescription}>{item.description}</Text>
      {!item.implemented && (
        <View style={styles.soonBadge}>
          <Text style={styles.soonText}>Soon</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Native Actions" />
      <FlatList
        data={ITEMS}
        keyExtractor={item => item.title}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  listContent: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  card: {
    padding: theme.spacing.lg,
    borderRadius: 8,
    backgroundColor: theme.colors.surface,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardTitle: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.textPrimary,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  cardDescription: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.textSecondary,
  },
  soonBadge: {
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    marginTop: theme.spacing.xs,
  },
  soonText: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
});
