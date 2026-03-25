import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme';

const DeviceScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Push Notifications</Text>
      <Text style={styles.subtitle}>Coming Soon</Text>
    </View>
  );
};

export default DeviceScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
  },
});
