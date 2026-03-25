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

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

type MenuItem = {
  title: string;
  description: string;
  screen: keyof RootStackParamList;
  params?: Record<string, any>;
  implemented?: boolean;
};

const MENU_ITEMS: MenuItem[] = [
  {
    title: 'UI Components',
    description: 'Buttons, Inputs, Selection controls',
    screen: 'Components',
    implemented: true,
  },
  {
    title: 'Native Actions',
    description: 'Call, Email, Maps, Share',
    screen: 'NativeActions',
    implemented: true,
  },
  {
    title: 'Permissions',
    description: 'Camera, Location, Storage',
    screen: 'Permissions',
    implemented: true,
  },
  {
    title: 'Hooks & Utilities',
    description: 'Custom hooks and helpers',
    screen: 'Hooks',
    implemented: true,
  },
  {
    title: 'System & Device',
    description: 'App state, network, settings',
    screen: 'System',
    implemented: true,
  },
  {
    title: 'Animations',
    description: 'FadeIn, SlideIn, spring, Reanimated basics',
    screen: 'ComingSoon',
    params: { title: 'Animations' },
    implemented: false,
  },
  {
    title: 'Forms',
    description: 'Validation, error states, form submission',
    screen: 'ComingSoon',
    params: { title: 'Forms' },
    implemented: false,
  },
  {
    title: 'Navigation Patterns',
    description: 'Tabs, drawer, modal stack demo',
    screen: 'ComingSoon',
    params: { title: 'Navigation Patterns' },
    implemented: false,
  },
];

const HomeScreen = ({ navigation }: Props) => {
  const renderItem = ({ item }: { item: MenuItem }) => {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate(item.screen as any, item.params as any)
        }
      >
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
        {item.implemented === false && (
          <View style={styles.soonBadge}>
            <Text style={styles.soonText}>Coming Soon</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="RNToolbox" />
      <FlatList
        data={MENU_ITEMS}
        keyExtractor={item => item.title}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  list: {
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
  title: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
    fontWeight: '600',
  },
  description: {
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
