import { useRoute } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Header from '../components/atoms/Header';
import { theme } from '../theme';

// Derives a readable title from a route name like "NativeImagePicker" → "Image Picker"
const routeNameToTitle = (name: string): string =>
  name
    .replace(
      /^(ComingSoon|Component|Native|Forms|Animations|Navigation|Hooks|Storage|Networking|System|Permissions|Testing)/,
      '',
    )
    .replace(/([A-Z])/g, ' $1')
    .trim() || name;

const ComingSoonScreen = () => {
  const route = useRoute();
  const params = route.params as { title?: string } | undefined;
  const title = params?.title ?? routeNameToTitle(route.name);

  return (
    <SafeAreaView style={styles.root}>
      <Header title={title} />
      <View style={styles.content}>
        <View style={styles.badge}>
          <Text style={styles.title}>Coming Soon</Text>
          <Text style={styles.subtitle}>
            This section is under construction
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ComingSoonScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
    alignItems: 'center',
  },
  title: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});
