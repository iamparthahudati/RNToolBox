import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/Button';
import Header from '../../components/Header';
import { theme } from '../../theme';

export default function ButtonsScreen() {
  const [loading, setLoading] = useState(false);

  return (
    <SafeAreaView style={styles.root}>
      <Header title="Buttons" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.sectionTitle, styles.firstSection]}>Variants</Text>
        <Button title="Primary" onPress={() => {}} />
        <Button title="Outline" variant="outline" onPress={() => {}} />
        <Button title="Secondary" variant="secondary" onPress={() => {}} />

        <Text style={styles.sectionTitle}>States</Text>
        <Button
          title="Tap to Load"
          loading={loading}
          onPress={() => {
            setLoading(true);
            setTimeout(() => setLoading(false), 1500);
          }}
        />
        <Button title="Disabled" disabled />

        <Text style={styles.sectionTitle}>Width</Text>
        <Button title="Full Width (default)" onPress={() => {}} />
        <Button title="Auto Width" fullWidth={false} onPress={() => {}} />

        <Text style={styles.sectionTitle}>With Icon</Text>
        <Button
          title="Icon Left"
          icon={<Text style={styles.icon}>★</Text>}
          iconPosition="left"
          onPress={() => {}}
        />
        <Button
          title="Icon Right"
          icon={<Text style={styles.icon}>★</Text>}
          iconPosition="right"
          onPress={() => {}}
        />

        <Text style={styles.sectionTitle}>Debounce</Text>
        <Button
          title="Debounced (1s)"
          debounceMs={1000}
          onPress={() => console.log('debounced press')}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
    marginTop: theme.spacing.lg,
  },
  firstSection: {
    marginTop: 0,
  },
  icon: {
    fontSize: 16,
  },
});
