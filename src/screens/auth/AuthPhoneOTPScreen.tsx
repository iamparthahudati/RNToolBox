import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/atoms/Header';
import InfoRow from '../../components/molecules/InfoRow';
import SectionHeader from '../../components/molecules/SectionHeader';
import { RootStackParamList } from '../../navigation/types';
import {
  AuthUser,
  getCurrentUser,
  sendPhoneOTP,
  signOut,
  verifyPhoneOTP,
} from '../../services/auth';
import { theme } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'AuthPhoneOTP'>;

type Step = 'phone' | 'otp' | 'done';

export default function AuthPhoneOTPScreen(_: Props): React.JSX.Element {
  const [step, setStep] = useState<Step>('phone');
  const [phoneNumber, setPhoneNumber] = useState('+1');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(getCurrentUser());
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const handleSendOTP = async () => {
    clearMessages();
    const trimmed = phoneNumber.trim();
    if (!trimmed || trimmed === '+1' || trimmed.length < 8) {
      setError('Please enter a valid phone number with country code.');
      return;
    }
    setLoading(true);
    try {
      await sendPhoneOTP(trimmed);
      setSuccess('OTP sent successfully. Check your SMS.');
      setStep('otp');
    } catch (err: any) {
      setError(err?.message ?? 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    clearMessages();
    if (otp.trim().length !== 6) {
      setError('Please enter the 6-digit OTP code.');
      return;
    }
    setLoading(true);
    try {
      const verified = await verifyPhoneOTP(otp.trim());
      setUser(verified);
      setSuccess('Phone number verified successfully.');
      setStep('done');
    } catch (err: any) {
      setError(err?.message ?? 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    clearMessages();
    setOtp('');
    setLoading(true);
    try {
      await sendPhoneOTP(phoneNumber.trim());
      setSuccess('OTP resent. Check your SMS.');
    } catch (err: any) {
      setError(err?.message ?? 'Failed to resend OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    clearMessages();
    setLoading(true);
    try {
      await signOut();
      setUser(null);
      setStep('phone');
      setPhoneNumber('+1');
      setOtp('');
      setSuccess('Signed out successfully.');
    } catch (err: any) {
      setError(err?.message ?? 'Failed to sign out.');
    } finally {
      setLoading(false);
    }
  };

  const activeStep = user ? 'done' : step;

  return (
    <SafeAreaView style={styles.root}>
      <Header title="Phone OTP Auth" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Step Indicator */}
          {activeStep !== 'done' && (
            <View style={styles.stepContainer}>
              <View style={styles.dotsRow}>
                <View
                  style={[
                    styles.dot,
                    activeStep === 'phone'
                      ? styles.dotActive
                      : styles.dotComplete,
                  ]}
                />
                <View style={styles.dotConnector} />
                <View
                  style={[
                    styles.dot,
                    activeStep === 'otp'
                      ? styles.dotActive
                      : styles.dotInactive,
                  ]}
                />
              </View>
              <Text style={styles.stepLabel}>
                {activeStep === 'phone'
                  ? 'Step 1 of 2: Enter Phone Number'
                  : 'Step 2 of 2: Enter OTP Code'}
              </Text>
            </View>
          )}

          {/* Error Banner */}
          {error !== null && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Success Banner */}
          {success !== null && (
            <View style={styles.successBanner}>
              <Text style={styles.successText}>{success}</Text>
            </View>
          )}

          {/* Phone Step */}
          {activeStep === 'phone' && (
            <View style={styles.card}>
              <SectionHeader title="Enter Phone Number" />
              <Text style={styles.hint}>
                Enter your phone number with country code to receive a one-time
                password via SMS.
              </Text>

              <Text style={styles.label}>Phone Number</Text>
              <View style={styles.phoneRow}>
                <View style={styles.prefixBox}>
                  <Text style={styles.prefixText}>+</Text>
                </View>
                <TextInput
                  style={styles.phoneInput}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  placeholder="+1 555 000 0000"
                  placeholderTextColor={theme.colors.textDisabled}
                  keyboardType="phone-pad"
                  textContentType="telephoneNumber"
                  autoComplete="tel"
                  autoFocus
                  editable={!loading}
                />
              </View>

              <TouchableOpacity
                style={[styles.primaryButton, loading && styles.buttonDisabled]}
                onPress={handleSendOTP}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator color={theme.colors.white} />
                ) : (
                  <Text style={styles.primaryButtonText}>Send OTP</Text>
                )}
              </TouchableOpacity>
            </View>
          )}

          {/* OTP Step */}
          {activeStep === 'otp' && (
            <View style={styles.card}>
              <SectionHeader title="Enter OTP Code" />
              <Text style={styles.hint}>
                A 6-digit code was sent to{' '}
                <Text style={styles.hintBold}>{phoneNumber}</Text>. Enter it
                below.
              </Text>

              <Text style={styles.label}>One-Time Password</Text>
              <TextInput
                style={styles.otpInput}
                value={otp}
                onChangeText={text =>
                  setOtp(text.replace(/[^0-9]/g, '').slice(0, 6))
                }
                placeholder="------"
                placeholderTextColor={theme.colors.textDisabled}
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                autoComplete="sms-otp"
                maxLength={6}
                autoFocus
                editable={!loading}
              />

              <TouchableOpacity
                style={[styles.primaryButton, loading && styles.buttonDisabled]}
                onPress={handleVerifyOTP}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator color={theme.colors.white} />
                ) : (
                  <Text style={styles.primaryButtonText}>Verify OTP</Text>
                )}
              </TouchableOpacity>

              <View style={styles.resendRow}>
                <Text style={styles.resendLabel}>
                  Did not receive the code?{' '}
                </Text>
                <TouchableOpacity onPress={handleResendOTP} disabled={loading}>
                  <Text style={styles.resendLink}>Resend OTP</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.backLink}
                onPress={() => {
                  clearMessages();
                  setStep('phone');
                }}
                disabled={loading}
              >
                <Text style={styles.backLinkText}>Change phone number</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Done / Signed In */}
          {activeStep === 'done' && user && (
            <View style={styles.card}>
              <SectionHeader title="Signed In" />
              <Text style={styles.hint}>
                Phone authentication successful. Your account details are shown
                below.
              </Text>

              <InfoRow label="UID" value={user.uid} />
              <InfoRow
                label="Phone Number"
                value={phoneNumber !== '+1' ? phoneNumber : 'N/A'}
              />
              <InfoRow label="Provider" value={user.providerId} />
              <InfoRow
                label="Anonymous"
                value={user.isAnonymous ? 'Yes' : 'No'}
              />

              <TouchableOpacity
                style={[styles.signOutButton, loading && styles.buttonDisabled]}
                onPress={handleSignOut}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator color={theme.colors.error} />
                ) : (
                  <Text style={styles.signOutText}>Sign Out</Text>
                )}
              </TouchableOpacity>
            </View>
          )}

          {/* How It Works */}
          <View style={styles.card}>
            <SectionHeader title="How It Works" />

            <Text style={styles.howTitle}>
              Firebase Phone Authentication Flow
            </Text>
            <Text style={styles.howBody}>
              1. <Text style={styles.howBold}>Send OTP</Text> — Calls{' '}
              <Text style={styles.code}>
                auth().signInWithPhoneNumber(phoneNumber)
              </Text>
              , which triggers Firebase to send an SMS containing a 6-digit code
              to the provided number.
            </Text>
            <Text style={styles.howBody}>
              2. <Text style={styles.howBold}>Verify OTP</Text> — Calls{' '}
              <Text style={styles.code}>confirmation.confirm(code)</Text> with
              the code the user received. On success, Firebase returns a
              signed-in user credential.
            </Text>
            <Text style={styles.howBody}>
              3. <Text style={styles.howBold}>Session</Text> — Firebase persists
              the auth session automatically. Subsequent app launches will
              restore the signed-in state via{' '}
              <Text style={styles.code}>auth().currentUser</Text>.
            </Text>

            <View style={styles.noteBanner}>
              <Text style={styles.noteTitle}>Device Requirement</Text>
              <Text style={styles.noteBody}>
                SMS delivery requires a real physical device. Simulators and
                emulators cannot receive SMS messages. For development, add test
                phone numbers and static OTP codes in the Firebase Console under
                Authentication &gt; Sign-in method &gt; Phone &gt; Phone numbers
                for testing.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: theme.spacing.xxl,
  },

  // Step indicator
  stepContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  dotActive: {
    backgroundColor: theme.colors.primary,
  },
  dotComplete: {
    backgroundColor: theme.colors.success,
  },
  dotInactive: {
    backgroundColor: theme.colors.border,
  },
  dotConnector: {
    width: 40,
    height: 2,
    backgroundColor: theme.colors.border,
    marginHorizontal: theme.spacing.xs,
  },
  stepLabel: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.weights.medium as '500',
  },

  // Banners
  errorBanner: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  errorText: {
    color: theme.colors.error,
    fontSize: theme.typography.sizes.sm,
  },
  successBanner: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  successText: {
    color: theme.colors.success,
    fontSize: theme.typography.sizes.sm,
  },

  // Card
  card: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  // Labels & hints
  label: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium as '500',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  hint: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
    lineHeight: 20,
  },
  hintBold: {
    fontWeight: theme.typography.weights.semibold as '600',
    color: theme.colors.textPrimary,
  },

  // Phone input row
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    backgroundColor: theme.colors.white,
    overflow: 'hidden',
  },
  prefixBox: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderRightWidth: 1,
    borderRightColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  prefixText: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.semibold as '600',
    color: theme.colors.textPrimary,
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textPrimary,
  },

  // OTP input
  otpInput: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    fontSize: theme.typography.sizes.xl,
    color: theme.colors.textPrimary,
    backgroundColor: theme.colors.white,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
    letterSpacing: 8,
    fontWeight: theme.typography.weights.bold as '700',
  },

  // Buttons
  primaryButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: theme.colors.white,
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.semibold as '600',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  signOutButton: {
    marginTop: theme.spacing.md,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.error,
    backgroundColor: '#FEF2F2',
  },
  signOutText: {
    color: theme.colors.error,
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.semibold as '600',
  },

  // Resend / back links
  resendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  resendLabel: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
  },
  resendLink: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.primary,
    fontWeight: theme.typography.weights.semibold as '600',
  },
  backLink: {
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  backLinkText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    textDecorationLine: 'underline',
  },

  // How it works
  howTitle: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.semibold as '600',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  howBody: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    marginBottom: theme.spacing.sm,
  },
  howBold: {
    fontWeight: theme.typography.weights.semibold as '600',
    color: theme.colors.textPrimary,
  },
  code: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.primary,
    backgroundColor: '#EFF6FF',
  },
  noteBanner: {
    marginTop: theme.spacing.sm,
    padding: theme.spacing.md,
    backgroundColor: '#FFFBEB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  noteTitle: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.semibold as '600',
    color: '#92400E',
    marginBottom: theme.spacing.xs,
  },
  noteBody: {
    fontSize: theme.typography.sizes.xs,
    color: '#78350F',
    lineHeight: 18,
  },
});
