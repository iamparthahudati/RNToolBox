import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../../components/Header';
import { RootStackParamList } from '../../../navigation/types';
import { openMaps } from '../../../services/maps';
import { theme } from '../../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'NativeMapsOpen'>;

const PAPER_THEME = {
  colors: {
    primary: theme.colors.primary,
    background: theme.colors.white,
    error: '#DC2626',
  },
};

const SUGGESTIONS = [
  'Times Square, New York',
  'Golden Gate Bridge, San Francisco',
  'Eiffel Tower, Paris',
];

export default function OpenInMapsScreen(_props: Props) {
  const [address, setAddress] = useState('');

  const isDisabled = address.trim().length === 0;

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Open in Maps" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.iconBadge}>
            <Text style={styles.pinIcon}>{'\u{1F4CD}'}</Text>
          </View>
          <Text style={styles.heroTitle}>Open in Maps</Text>
          <Text style={styles.heroSubtitle}>
            Enter any address or landmark to open it directly in your device's
            maps application.
          </Text>
        </View>

        {/* Address Input */}
        <TextInput
          mode="outlined"
          label="Address or place"
          value={address}
          onChangeText={setAddress}
          left={<TextInput.Icon icon="map-marker-outline" />}
          right={
            address.length > 0 ? (
              <TextInput.Icon
                icon="close-circle"
                onPress={() => setAddress('')}
              />
            ) : undefined
          }
          style={styles.input}
          theme={PAPER_THEME}
          autoCorrect={false}
          autoCapitalize="words"
          returnKeyType="search"
          onSubmitEditing={() => {
            if (!isDisabled) openMaps(address.trim());
          }}
        />

        {/* Suggestions */}
        <Text style={styles.sectionLabel}>Suggestions</Text>
        <View style={styles.chipsColumn}>
          {SUGGESTIONS.map(suggestion => {
            const isActive = address === suggestion;
            return (
              <TouchableOpacity
                key={suggestion}
                style={[styles.chip, isActive && styles.chipActive]}
                onPress={() => setAddress(suggestion)}
                activeOpacity={0.7}
              >
                <Text
                  style={[styles.chipText, isActive && styles.chipTextActive]}
                >
                  {suggestion}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Open in Maps Button */}
        <TouchableOpacity
          style={[styles.button, isDisabled && styles.buttonDisabled]}
          onPress={() => openMaps(address.trim())}
          disabled={isDisabled}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Open in Maps</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },

  // Hero
  hero: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    marginTop: theme.spacing.sm,
  },
  iconBadge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  pinIcon: {
    fontSize: 32,
  },
  heroTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  heroSubtitle: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },

  // Input
  input: {
    marginBottom: theme.spacing.lg,
    backgroundColor: theme.colors.white,
  },

  // Suggestions
  sectionLabel: {
    fontSize: theme.typography.sizes.xs,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: theme.spacing.sm,
  },
  chipsColumn: {
    flexDirection: 'column',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xl,
  },
  chip: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  chipActive: {
    borderColor: theme.colors.primary,
    backgroundColor: '#EFF6FF',
  },
  chipText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textPrimary,
  },
  chipTextActive: {
    color: theme.colors.primary,
    fontWeight: '600',
  },

  // Button
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
    paddingVertical: theme.spacing.md + 2,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.45,
  },
  buttonText: {
    fontSize: theme.typography.sizes.md,
    fontWeight: '700',
    color: theme.colors.white,
  },
});
