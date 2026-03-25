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
import { RootStackParamList } from '../navigation/types';
import { theme } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Components'>;

type MenuItem = {
  title: string;
  description: string;
  screen: keyof RootStackParamList;
  params?: Record<string, any>;
  implemented: boolean;
};

const ITEMS: MenuItem[] = [
  {
    title: 'Buttons',
    description: 'Primary, outline, loading, icon variants',
    screen: 'ComponentButtons',
    implemented: true,
  },
  {
    title: 'Inputs',
    description: 'Text fields, password, multiline',
    screen: 'ComponentInputs',
    implemented: true,
  },
  {
    title: 'Selection Controls',
    description: 'Switch, checkbox, radio',
    screen: 'ComponentSelection',
    implemented: true,
  },
  {
    title: 'Typography',
    description: 'Font sizes, weights, line heights',
    screen: 'ComingSoon',
    params: { title: 'Typography' },
    implemented: false,
  },
  {
    title: 'Cards',
    description: 'Basic, image, action cards',
    screen: 'ComingSoon',
    params: { title: 'Cards' },
    implemented: false,
  },
  {
    title: 'Badges & Tags',
    description: 'Status indicators, labels',
    screen: 'ComingSoon',
    params: { title: 'Badges & Tags' },
    implemented: false,
  },
  {
    title: 'Modals & Alerts',
    description: 'Custom modal, bottom sheet, confirmation dialog',
    screen: 'ComingSoon',
    params: { title: 'Modals & Alerts' },
    implemented: false,
  },
  {
    title: 'Toast / Snackbar',
    description: 'Success, error, info notifications',
    screen: 'ComingSoon',
    params: { title: 'Toast / Snackbar' },
    implemented: false,
  },
  {
    title: 'Loading States',
    description: 'Skeleton screens, spinners, progress bars',
    screen: 'ComingSoon',
    params: { title: 'Loading States' },
    implemented: false,
  },
];

export default function ComponentsScreen({ navigation }: Props) {
  const renderItem = ({ item }: { item: MenuItem }) => (
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
          <Text style={styles.soonText}>Coming Soon</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Components" />
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
    backgroundColor: '#FEF2F2',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    marginTop: theme.spacing.xs,
  },
  soonText: {
    fontSize: 10,
    color: '#DC2626',
    fontWeight: '600',
  },
});
