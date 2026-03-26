import React, { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { HelperText, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/atoms/Header';
import { theme } from '../../theme';

const PAPER_THEME = {
  colors: {
    primary: theme.colors.primary,
    background: theme.colors.white,
    error: '#DC2626',
  },
};

const InputsScreen = () => {
  const [text, setText] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [phone, setPhone] = useState('');
  const [number, setNumber] = useState('');
  const [mfaPin, setMfaPin] = useState('');
  const [multiline, setMultiline] = useState('');

  const validateEmail = (val: string) => {
    setEmail(val);
    setEmailError(val.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val));
  };

  return (
    <SafeAreaView style={styles.root}>
      <Header title="Inputs" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Outlined Mode */}
        <TextInput
          label="Default (Outlined)"
          mode="outlined"
          placeholder="Enter text..."
          value={text}
          onChangeText={setText}
          style={styles.input}
          theme={PAPER_THEME}
        />

        <TextInput
          label="With Left Icon"
          mode="outlined"
          placeholder="Search..."
          style={styles.input}
          theme={PAPER_THEME}
          left={<TextInput.Icon icon="magnify" />}
        />

        <TextInput
          label="With Right Icon"
          mode="outlined"
          placeholder="Enter value..."
          style={styles.input}
          theme={PAPER_THEME}
          right={<TextInput.Icon icon="close-circle-outline" />}
        />

        {/* Flat Mode */}
        <TextInput
          label="Flat Mode"
          mode="flat"
          placeholder="Enter text..."
          style={styles.input}
          theme={PAPER_THEME}
        />

        <TextInput
          label="Flat with Icon"
          mode="flat"
          placeholder="Enter text..."
          style={styles.input}
          theme={PAPER_THEME}
          left={<TextInput.Icon icon="account-outline" />}
        />

        {/* Email with validation */}
        <TextInput
          label="Email"
          mode="outlined"
          placeholder="you@example.com"
          value={email}
          onChangeText={validateEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
          theme={PAPER_THEME}
          error={emailError}
          left={<TextInput.Icon icon="email-outline" />}
        />
        <HelperText type={emailError ? 'error' : 'info'} visible={true}>
          {emailError ? 'Enter a valid email address' : 'e.g. name@example.com'}
        </HelperText>

        {/* Password */}
        <TextInput
          label="Password"
          mode="outlined"
          placeholder="Enter password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!passwordVisible}
          style={styles.input}
          theme={PAPER_THEME}
          left={<TextInput.Icon icon="lock-outline" />}
          right={
            <TextInput.Icon
              icon={passwordVisible ? 'eye-off-outline' : 'eye-outline'}
              onPress={() => setPasswordVisible(v => !v)}
            />
          }
        />
        <HelperText
          type="info"
          visible={password.length > 0 && password.length < 8}
        >
          Password must be at least 8 characters
        </HelperText>

        {/* MFA PIN - auto-fills from SMS via keyboard toolbar */}
        <TextInput
          label="MFA PIN"
          mode="outlined"
          placeholder="Enter PIN from SMS"
          value={mfaPin}
          onChangeText={setMfaPin}
          keyboardType="default"
          textContentType="oneTimeCode"
          autoComplete="sms-otp"
          maxLength={6}
          style={styles.input}
          theme={PAPER_THEME}
          left={<TextInput.Icon icon="shield-key-outline" />}
          right={
            mfaPin.length > 0 ? (
              <TextInput.Icon
                icon="close-circle-outline"
                onPress={() => setMfaPin('')}
              />
            ) : undefined
          }
        />
        <HelperText type="info" visible={true}>
          PIN from your SMS will appear in the keyboard toolbar
        </HelperText>

        {/* Phone */}
        <TextInput
          label="Phone"
          mode="outlined"
          placeholder="+1 555 000 0000"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          style={styles.input}
          theme={PAPER_THEME}
          left={<TextInput.Icon icon="phone-outline" />}
        />

        {/* Number */}
        <TextInput
          label="Number"
          mode="outlined"
          placeholder="0"
          value={number}
          onChangeText={setNumber}
          keyboardType="numeric"
          style={styles.input}
          theme={PAPER_THEME}
          left={<TextInput.Icon icon="numeric" />}
        />

        {/* Multiline */}
        <TextInput
          label="Multiline"
          mode="outlined"
          placeholder="Write something..."
          value={multiline}
          onChangeText={setMultiline}
          multiline
          numberOfLines={4}
          style={styles.multilineInput}
          theme={PAPER_THEME}
        />

        {/* Disabled */}
        <TextInput
          label="Disabled"
          mode="outlined"
          value="Cannot edit this"
          disabled
          style={styles.input}
          theme={PAPER_THEME}
        />

        {/* Read Only */}
        <TextInput
          label="Read Only"
          mode="outlined"
          value="Read only value"
          editable={false}
          style={styles.input}
          theme={PAPER_THEME}
          right={
            <TextInput.Icon
              icon="lock-outline"
              color={theme.colors.textSecondary}
            />
          }
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default InputsScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },
  input: {
    marginBottom: theme.spacing.sm,
    backgroundColor: theme.colors.white,
  },
  multilineInput: {
    marginBottom: theme.spacing.sm,
    backgroundColor: theme.colors.white,
    minHeight: 100,
  },
});
