import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Header from '../components/Header';
import { RootStackParamList } from '../navigation/AppNavigator';
import { theme } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'ComingSoon'>;

const ComingSoonScreen = ({ route }: Props) => {
  return (
    <SafeAreaView style={styles.root}>
      <Header title={route.params.title} />
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

export default ComingSoonScreen;
