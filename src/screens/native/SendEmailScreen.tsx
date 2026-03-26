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
import Header from '../../components/Header';
import { RootStackParamList } from '../../navigation/types';
import { sendEmail } from '../../services/email';
import { theme } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'NativeSendEmail'>;

const PAPER_THEME = {
  colors: {
    primary: theme.colors.primary,
    background: theme.colors.white,
    error: '#DC2626',
  },
};

const SendEmailScreen = ({}: Props) => {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  const handleSend = () => {
    sendEmail({ to: to.trim(), subject: subject.trim(), body: body.trim() });
  };

  return (
    <SafeAreaView style={styles.root}>
      <Header title="Send Email" />
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.heroContainer}>
          <View style={styles.heroCircle}>
            <Text style={styles.heroIcon}>{'✉️'}</Text>
          </View>
          <Text style={styles.heroTitle}>Send Email</Text>
          <Text style={styles.heroSubtitle}>
            Compose and send an email using your default mail app
          </Text>
        </View>

        {/* To */}
        <TextInput
          mode="outlined"
          label="To"
          value={to}
          onChangeText={setTo}
          keyboardType="email-address"
          autoCapitalize="none"
          left={<TextInput.Icon icon="email-outline" />}
          style={styles.input}
          theme={PAPER_THEME}
        />

        {/* Subject */}
        <TextInput
          mode="outlined"
          label="Subject"
          value={subject}
          onChangeText={setSubject}
          left={<TextInput.Icon icon="text-subject" />}
          style={styles.input}
          theme={PAPER_THEME}
        />

        {/* Body */}
        <TextInput
          mode="outlined"
          label="Body"
          value={body}
          onChangeText={setBody}
          multiline
          numberOfLines={4}
          left={<TextInput.Icon icon="pencil-outline" />}
          style={[styles.input, styles.bodyInput]}
          theme={PAPER_THEME}
        />

        {/* Send Button */}
        <TouchableOpacity
          style={[
            styles.button,
            to.trim().length === 0 && styles.buttonDisabled,
          ]}
          onPress={handleSend}
          disabled={to.trim().length === 0}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Send Email</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SendEmailScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },

  // Hero
  heroContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    marginTop: theme.spacing.sm,
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

  // Inputs
  input: {
    marginBottom: theme.spacing.lg,
    backgroundColor: theme.colors.white,
  },
  bodyInput: {
    minHeight: 100,
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
    color: theme.colors.white,
    fontSize: theme.typography.sizes.md,
    fontWeight: '700',
  },
});
