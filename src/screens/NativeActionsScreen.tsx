import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import Button from '../components/Button';
import { theme } from '../theme';

import { callPhoneNumber } from '../services/phone';
import { sendEmail } from '../services/email';
import { openMaps } from '../services/maps';
import { copyToClipboard, getFromClipboard } from '../services/clipboard';

const NativeActionsScreen = () => {
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
const [otp, setOtp] = useState('');

  return (
    <View style={styles.container}>
      {/* Call */}
      <Text style={styles.sectionTitle}>Call Phone</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter phone number"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />
      <Button
        title="Call Now"
        onPress={() => callPhoneNumber(phone)}
      />

      {/* Email */}
      <Text style={styles.sectionTitle}>Send Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter email address"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <Button
        title="Send Email"
        onPress={() =>
          sendEmail({
            to: email,
            subject: 'RNToolbox Test',
            body: 'This email was sent from RNToolbox',
          })
        }
      />

      {/* Maps */}
      <Text style={styles.sectionTitle}>Open Maps</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter address"
        value={address}
        onChangeText={setAddress}
      />
      <Button
        title="Open in Maps"
        onPress={() => openMaps(address)}
      />

      <Text style={styles.sectionTitle}>OTP / Clipboard</Text>

<TextInput
  style={styles.input}
  placeholder="Enter OTP"
  keyboardType="number-pad"
  value={otp}
  onChangeText={setOtp}
/>

<Button
  title="Copy OTP"
  onPress={() => copyToClipboard(otp)}
/>

<Button
  title="Paste OTP"
  variant="outline"
  onPress={async () => {
    const value = await getFromClipboard();
    setOtp(value);
  }}
/>
    </View>
  );
};

export default NativeActionsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: '700',
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
    color: theme.colors.textPrimary,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
});
