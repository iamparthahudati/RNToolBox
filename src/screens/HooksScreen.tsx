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

type Props = NativeStackScreenProps<RootStackParamList, 'Hooks'>;

type MenuItem = {
  title: string;
  description: string;
  screen: keyof RootStackParamList;
  params: { title: string };
  implemented: boolean;
};

const MENU_ITEMS: MenuItem[] = [
  {
    title: 'useDebounce',
    description: 'Debounced value hook',
    screen: 'ComingSoon',
    params: { title: 'useDebounce' },
    implemented: false,
  },
  {
    title: 'useLocalStorage',
    description: 'AsyncStorage wrapper hook',
    screen: 'ComingSoon',
    params: { title: 'useLocalStorage' },
    implemented: false,
  },
  {
    title: 'useNetworkStatus',
    description: 'Online and offline detection',
    screen: 'ComingSoon',
    params: { title: 'useNetworkStatus' },
    implemented: false,
  },
  {
    title: 'useAppState',
    description: 'Foreground and background detection',
    screen: 'ComingSoon',
    params: { title: 'useAppState' },
    implemented: false,
  },
  {
    title: 'useKeyboard',
    description: 'Keyboard height and visibility',
    screen: 'ComingSoon',
    params: { title: 'useKeyboard' },
    implemented: false,
  },
  {
    title: 'useTimer',
    description: 'Countdown and stopwatch',
    screen: 'ComingSoon',
    params: { title: 'useTimer' },
    implemented: false,
  },
];

const HooksScreen = ({ navigation }: Props) => {
  const renderItem = ({ item }: { item: MenuItem }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate(item.screen as 'ComingSoon', item.params)
      }
      activeOpacity={0.7}
    >
      <Text style={styles.itemTitle}>{item.title}</Text>
      <Text style={styles.itemDescription}>{item.description}</Text>
      {!item.implemented && (
        <View style={styles.soonBadge}>
          <Text style={styles.soonText}>Coming Soon</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Hooks & Utilities" />
      <FlatList
        data={MENU_ITEMS}
        keyExtractor={item => item.title}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
};

export default HooksScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  list: {
    padding: theme.spacing.lg,
  },
  card: {
    padding: theme.spacing.lg,
    borderRadius: 8,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.md,
  },
  itemTitle: {
    fontSize: theme.typography.sizes.md,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  itemDescription: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
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
