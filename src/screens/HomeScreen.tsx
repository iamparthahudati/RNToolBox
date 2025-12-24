import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { theme } from '../theme';
type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

type MenuItem = {
  title: string;
  description: string;
  screen: keyof RootStackParamList;
};

const MENU_ITEMS: MenuItem[] = [
  {
    title: 'UI Components',
    description: 'Buttons, Inputs, Selection controls',
    screen: 'Components',
  },
  {
    title: 'Native Actions',
    description: 'Call, Email, Maps, Share',
    screen: 'NativeActions',
  },
  {
    title: 'Permissions',
    description: 'Camera, Location, Storage',
    screen: 'Permissions',
  },
  {
    title: 'Hooks & Utilities',
    description: 'Custom hooks and helpers',
    screen: 'Hooks',
  },
  {
    title: 'System & Device',
    description: 'App state, network, settings',
    screen: 'System',
  },
];

const HomeScreen = ({ navigation }: Props) => {
  const renderItem = ({ item }: { item: MenuItem }) => {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate(item.screen)}
      >
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>RNToolbox</Text>
      <Text style={styles.subHeader}>
        Personal React Native Reference
      </Text>

      <FlatList
        data={MENU_ITEMS}
        keyExtractor={(item) => item.title}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

export default HomeScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.lg,
     backgroundColor: theme.colors.background,
  },
  header: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  subHeader: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
  },
  list: {
     paddingBottom: theme.spacing.lg,
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
});
