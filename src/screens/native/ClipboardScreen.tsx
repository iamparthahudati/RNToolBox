import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { HelperText, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/Header';
import { RootStackParamList } from '../../navigation/types';
import { copyToClipboard, getFromClipboard } from '../../services/clipboard';
import { theme } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'NativeClipboard'>;

const PAPER_THEME = {
  colors: {
    primary: theme.colors.primary,
    background: theme.colors.white,
    error: '#DC2626',
  },
};

export default function ClipboardScreen(_props: Props) {
  const [copyText, setCopyText] = useState('');
  const [pastedText, setPastedText] = useState('');
  const [pasteAttempted, setPasteAttempted] = useState(false);
  const [otpValue, setOtpValue] = useState('');

  const handleCopy = () => {
    copyToClipboard(copyText);
  };

  const handlePaste = async () => {
    setPasteAttempted(true);
    const text = await getFromClipboard();
    setPastedText(text);
  };

  const showNothingHelper = pasteAttempted && pastedText === '';

  return (
    <SafeAreaView style={styles.root}>
      <Header title="OTP / Clipboard" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.heroContainer}>
          <View style={styles.heroCircle}>
            <Text style={styles.heroIcon}>{'⧉'}</Text>
          </View>
          <Text style={styles.heroTitle}>Clipboard Manager</Text>
          <Text style={styles.heroSubtitle}>
            Copy text to the clipboard or paste content from it
          </Text>
        </View>

        {/* COPY Section */}
        <Text style={styles.sectionLabel}>Copy</Text>
        <TextInput
          mode="outlined"
          label="Text to Copy"
          value={copyText}
          onChangeText={setCopyText}
          left={<TextInput.Icon icon="content-copy" />}
          right={
            copyText.length > 0 ? (
              <TextInput.Icon icon="close" onPress={() => setCopyText('')} />
            ) : undefined
          }
          style={styles.input}
          theme={PAPER_THEME}
        />
        <TouchableOpacity
          style={[
            styles.button,
            copyText.trim() === '' && styles.buttonDisabled,
          ]}
          onPress={handleCopy}
          disabled={copyText.trim() === ''}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Copy to Clipboard</Text>
        </TouchableOpacity>

        {/* PASTE Section */}
        <Text style={[styles.sectionLabel, styles.sectionLabelSpaced]}>
          Paste
        </Text>
        <TextInput
          mode="outlined"
          label="Clipboard Content"
          value={pastedText}
          editable={false}
          style={[styles.input, styles.readOnlyInput]}
          theme={PAPER_THEME}
        />
        {showNothingHelper && (
          <HelperText type="info" visible style={styles.helperText}>
            Nothing in clipboard
          </HelperText>
        )}
        <TouchableOpacity
          style={styles.outlineButton}
          onPress={handlePaste}
          activeOpacity={0.8}
        >
          <Text style={styles.outlineButtonText}>Paste from Clipboard</Text>
        </TouchableOpacity>

        {/* OTP DEMO Section */}
        <Text style={[styles.sectionLabel, styles.sectionLabelSpaced]}>
          OTP Auto-fill Demo
        </Text>
        <TextInput
          mode="outlined"
          label="Enter OTP"
          value={otpValue}
          onChangeText={text => setOtpValue(text.replace(/[^0-9]/g, ''))}
          keyboardType="number-pad"
          maxLength={6}
          textContentType="oneTimeCode"
          autoComplete="sms-otp"
          left={<TextInput.Icon icon="shield-key-outline" />}
          style={styles.input}
          theme={PAPER_THEME}
        />
        <HelperText type="info" visible style={styles.helperText}>
          OTP from SMS will appear in keyboard toolbar
        </HelperText>
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
  sectionLabelSpaced: {
    marginTop: theme.spacing.xl,
  },

  // Input
  input: {
    marginBottom: theme.spacing.lg,
    backgroundColor: theme.colors.white,
  },
  readOnlyInput: {
    backgroundColor: theme.colors.surface,
    marginBottom: theme.spacing.xs,
  },
  helperText: {
    marginBottom: theme.spacing.sm,
    paddingHorizontal: 0,
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

  // Outline button
  outlineButton: {
    borderWidth: 1,
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.white,
    borderRadius: 10,
    paddingVertical: theme.spacing.md + 2,
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  outlineButtonText: {
    color: theme.colors.primary,
    fontSize: theme.typography.sizes.md,
    fontWeight: '700',
  },
});
