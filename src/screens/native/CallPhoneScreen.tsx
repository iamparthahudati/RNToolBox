import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Chip, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/atoms/Header';
import { RootStackParamList } from '../../navigation/types';
import { callPhoneNumber } from '../../services/phone';
import { theme } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'NativeCallPhone'>;

const PAPER_THEME = {
  colors: {
    primary: theme.colors.primary,
    background: theme.colors.white,
    error: '#DC2626',
  },
};

const QUICK_DIALS = [
  { label: 'Apple Support', number: '+1-800-275-2273' },
  { label: 'Google Support', number: '+1-650-253-0000' },
  { label: 'Emergency', number: '911' },
];

const CallPhoneScreen = ({}: Props) => {
  const [phone, setPhone] = useState('');

  const handleCall = () => {
    callPhoneNumber(phone.trim());
  };

  return (
    <SafeAreaView style={styles.root}>
      <Header title="Call Phone" />
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.heroContainer}>
          <View style={styles.heroCircle}>
            <Text style={styles.heroIcon}>{'📞'}</Text>
          </View>
          <Text style={styles.heroTitle}>Call Phone</Text>
          <Text style={styles.heroSubtitle}>
            Enter a number or pick a quick-dial to place a call
          </Text>
        </View>

        {/* Phone Input */}
        <TextInput
          mode="outlined"
          label="Phone Number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          left={<TextInput.Icon icon="phone-outline" />}
          right={
            phone.length > 0 ? (
              <TextInput.Icon
                icon="close-circle"
                onPress={() => setPhone('')}
              />
            ) : undefined
          }
          style={styles.input}
          theme={PAPER_THEME}
        />

        {/* Quick-dial chips */}
        <View style={styles.chipsContainer}>
          {QUICK_DIALS.map(item => (
            <Chip
              key={item.label}
              label={item.label}
              sublabel={item.number}
              active={phone === item.number}
              onPress={() => setPhone(item.number)}
            />
          ))}
        </View>

        {/* Call Button */}
        <TouchableOpacity
          style={[
            styles.button,
            phone.trim().length === 0 && styles.buttonDisabled,
          ]}
          onPress={handleCall}
          disabled={phone.trim().length === 0}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Call Now</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CallPhoneScreen;

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

  // Input
  input: {
    marginBottom: theme.spacing.lg,
    backgroundColor: theme.colors.white,
  },

  // Chips
  chipsContainer: {
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xl,
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
