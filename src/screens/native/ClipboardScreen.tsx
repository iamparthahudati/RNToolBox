import Icon from '@react-native-vector-icons/material-design-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { HelperText, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import Button from '../../components/atoms/Button';
import Header from '../../components/atoms/Header';
import SectionHeader from '../../components/molecules/SectionHeader';
import { RootStackParamList } from '../../navigation/types';
import { copyToClipboard, getFromClipboard } from '../../services/clipboard';
import { useTheme } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'NativeClipboard'>;

export default function ClipboardScreen(_props: Props) {
  const { colors, spacing, typography, isDark } = useTheme();

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

  const paperTheme = {
    colors: {
      primary: colors.primary,
      background: colors.surface,
      error: colors.errorMain,
    },
  };

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]}>
      <Header title="OTP / Clipboard" />
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { padding: spacing.lg, paddingBottom: spacing.xxl },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View
          style={[
            styles.heroContainer,
            { marginBottom: spacing.xl, paddingTop: spacing.md },
          ]}
        >
          <View
            style={[
              styles.heroCircle,
              {
                backgroundColor: isDark ? colors.primary900 : colors.primary50,
                marginBottom: spacing.md,
              },
            ]}
          >
            <Icon
              name={'clipboard-outline' as any}
              size={32}
              color={colors.primary}
            />
          </View>
          <Text
            style={[
              typography.presets.h2,
              { color: colors.textPrimary, marginBottom: spacing.xs },
            ]}
          >
            Clipboard Manager
          </Text>
          <Text
            style={[
              typography.presets.bodySmall,
              styles.centered,
              { color: colors.textSecondary },
            ]}
          >
            Copy text to the clipboard or paste content from it
          </Text>
        </View>

        {/* COPY Section */}
        <SectionHeader title="Copy" />
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
          style={[
            styles.input,
            { marginBottom: spacing.lg, backgroundColor: colors.surface },
          ]}
          theme={paperTheme}
        />
        <Button
          title="Copy to Clipboard"
          variant="primary"
          onPress={handleCopy}
          disabled={copyText.trim() === ''}
          fullWidth
        />

        {/* PASTE Section */}
        <View style={{ marginTop: spacing.xl }}>
          <SectionHeader title="Paste" />
        </View>
        <TextInput
          mode="outlined"
          label="Clipboard Content"
          value={pastedText}
          editable={false}
          style={[
            styles.input,
            {
              marginBottom: spacing.xs,
              backgroundColor: colors.surface,
            },
          ]}
          theme={paperTheme}
        />
        {showNothingHelper && (
          <HelperText type="info" visible style={styles.helperText}>
            Nothing in clipboard
          </HelperText>
        )}
        <View style={{ marginTop: spacing.sm }}>
          <Button
            title="Paste from Clipboard"
            variant="outline"
            onPress={handlePaste}
            fullWidth
          />
        </View>

        {/* OTP DEMO Section */}
        <View style={{ marginTop: spacing.xl }}>
          <SectionHeader title="OTP Auto-fill Demo" />
        </View>
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
          style={[
            styles.input,
            { marginBottom: spacing.xs, backgroundColor: colors.surface },
          ]}
          theme={paperTheme}
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
  },
  scrollContent: {},
  heroContainer: {
    alignItems: 'center',
  },
  heroCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {},
  helperText: {
    paddingHorizontal: 0,
  },
  centered: {
    textAlign: 'center',
  },
});
