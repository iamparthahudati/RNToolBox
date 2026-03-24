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

type Props = NativeStackScreenProps<RootStackParamList, 'Permissions'>;

type MenuItem = {
  title: string;
  description: string;
  screen: keyof RootStackParamList;
  params: { title: string };
  implemented: boolean;
};

const MENU_ITEMS: MenuItem[] = [
  {
    title: 'Camera',
    description: 'Camera access permission',
    screen: 'ComingSoon',
    params: { title: 'Camera Permission' },
    implemented: false,
  },
  {
    title: 'Location',
    description: 'GPS and location access',
    screen: 'ComingSoon',
    params: { title: 'Location Permission' },
    implemented: false,
  },
  {
    title: 'Notifications',
    description: 'Push notification permission',
    screen: 'ComingSoon',
    params: { title: 'Notifications Permission' },
    implemented: false,
  },
  {
    title: 'Microphone',
    description: 'Audio recording access',
    screen: 'ComingSoon',
    params: { title: 'Microphone Permission' },
    implemented: false,
  },
  {
    title: 'Contacts',
    description: 'Address book access',
    screen: 'ComingSoon',
    params: { title: 'Contacts Permission' },
    implemented: false,
  },
  {
    title: 'Photo Library',
    description: 'Photos and media access',
    screen: 'ComingSoon',
    params: { title: 'Photo Library Permission' },
    implemented: false,
  },
  {
    title: 'Bluetooth',
    description: 'Bluetooth device access',
    screen: 'ComingSoon',
    params: { title: 'Bluetooth Permission' },
    implemented: false,
  },
];

const PermissionsScreen = ({ navigation }: Props) => {
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
      <Header title="Permissions" />
      <FlatList
        data={MENU_ITEMS}
        keyExtractor={item => item.title}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
};

export default PermissionsScreen;

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
