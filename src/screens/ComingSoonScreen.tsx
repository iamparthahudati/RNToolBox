import { useRoute } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Icon from '@react-native-vector-icons/material-design-icons';
import Badge from '../components/atoms/Badge';
import Header from '../components/atoms/Header';
import { useTheme } from '../theme';

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
  const { colors, spacing, typography, isDark } = useTheme();
  const params = route.params as { title?: string } | undefined;
  const title = params?.title ?? routeNameToTitle(route.name);

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]}>
      <Header title={title} />
      <View style={styles.content}>
        <View
          style={[
            styles.iconCircle,
            { backgroundColor: isDark ? colors.primary950 : colors.primary50 },
          ]}
        >
          <Icon
            name={'clock-time-four-outline' as any}
            size={36}
            color={colors.primary600}
          />
        </View>
        <Text
          style={[
            typography.presets.h2,
            {
              color: colors.textPrimary,
              marginTop: spacing.lg,
              textAlign: 'center',
            },
          ]}
        >
          Coming Soon
        </Text>
        <Text
          style={[
            typography.presets.body,
            {
              color: colors.textSecondary,
              textAlign: 'center',
              marginTop: spacing.sm,
              maxWidth: 260,
            },
          ]}
        >
          This feature is currently under construction and will be available in
          a future update.
        </Text>
        <View style={{ marginTop: spacing.md }}>
          <Badge label="Coming Soon" variant="comingSoon" />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ComingSoonScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
