import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/Header';
import { RootStackParamList } from '../../navigation/types';
import { theme } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'NativeShare'>;

const PAPER_THEME = {
  colors: {
    primary: theme.colors.primary,
    background: theme.colors.white,
    error: '#DC2626',
  },
};

export default function ShareScreen(_props: Props) {
  const [message, setMessage] = useState('');
  const [url, setUrl] = useState('');

  const isDisabled = message.trim() === '' && url.trim() === '';

  const handleShare = async () => {
    const shareMessage = message.trim() + (url.trim() ? '\n' + url.trim() : '');
    try {
      const result = await Share.share({ message: shareMessage });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          Alert.alert('Shared', `Shared via ${result.activityType}`);
        }
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unexpected error occurred';
      Alert.alert('Error', errorMessage);
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <Header title="Share" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.heroContainer}>
          <View style={styles.heroCircle}>
            <Text style={styles.heroIcon}>{'⤴'}</Text>
          </View>
          <Text style={styles.heroTitle}>Share Content</Text>
          <Text style={styles.heroSubtitle}>
            Share a message or link using the native share sheet
          </Text>
        </View>

        {/* Message Input */}
        <Text style={styles.sectionLabel}>Message</Text>
        <TextInput
          mode="outlined"
          label="Message"
          value={message}
          onChangeText={setMessage}
          multiline
          numberOfLines={3}
          left={<TextInput.Icon icon="text-box-outline" />}
          style={styles.input}
          theme={PAPER_THEME}
        />

        {/* URL Input */}
        <Text style={styles.sectionLabel}>URL</Text>
        <TextInput
          mode="outlined"
          label="URL"
          value={url}
          onChangeText={setUrl}
          autoCapitalize="none"
          keyboardType="url"
          left={<TextInput.Icon icon="link-variant" />}
          style={styles.input}
          theme={PAPER_THEME}
        />

        {/* Share Button */}
        <TouchableOpacity
          style={[styles.button, isDisabled && styles.buttonDisabled]}
          onPress={handleShare}
          disabled={isDisabled}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Share</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },

  // Hero
  heroContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    paddingTop: theme.spacing.md,
  },
  heroCircle: {
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
  heroIcon: {
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

  // Section label
  sectionLabel: {
    fontSize: theme.typography.sizes.xs,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: theme.spacing.sm,
  },

  // Input
  input: {
    marginBottom: theme.spacing.lg,
    backgroundColor: theme.colors.white,
  },

  // Primary button
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
    color: theme.colors.white,
    fontSize: theme.typography.sizes.md,
    fontWeight: '700',
  },
});
