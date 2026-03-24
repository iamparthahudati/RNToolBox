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

type Props = NativeStackScreenProps<RootStackParamList, 'System'>;

type MenuItem = {
  title: string;
  description: string;
  screen: keyof RootStackParamList;
  params: { title: string };
  implemented: boolean;
};

const MENU_ITEMS: MenuItem[] = [
  {
    title: 'Push Notifications',
    description: 'FCM token and notification setup',
    screen: 'ComingSoon',
    params: { title: 'Push Notifications' },
    implemented: false,
  },
  {
    title: 'Device Info',
    description: 'Model, OS version, screen dimensions',
    screen: 'ComingSoon',
    params: { title: 'Device Info' },
    implemented: false,
  },
  {
    title: 'Network Info',
    description: 'Connection type and IP address',
    screen: 'ComingSoon',
    params: { title: 'Network Info' },
    implemented: false,
  },
  {
    title: 'AsyncStorage',
    description: 'Read, write and delete demo',
    screen: 'ComingSoon',
    params: { title: 'AsyncStorage' },
    implemented: false,
  },
  {
    title: 'Secure Store',
    description: 'Encrypted key-value storage',
    screen: 'ComingSoon',
    params: { title: 'Secure Store' },
    implemented: false,
  },
  {
    title: 'Environment',
    description: 'Dev, staging and prod config',
    screen: 'ComingSoon',
    params: { title: 'Environment' },
    implemented: false,
  },
];

const SystemScreen = ({ navigation }: Props) => {
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
          <Text style={styles.soonText}>Soon</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header title="System & Device" />
      <FlatList
        data={MENU_ITEMS}
        keyExtractor={item => item.title}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
};

export default SystemScreen;

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
