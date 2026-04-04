import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
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
import SectionHeader from '../../components/molecules/SectionHeader';
import { RootStackParamList } from '../../navigation/types';
import {
  AuthUser,
  deleteAccount,
  getCurrentUser,
  sendPasswordReset,
  signInWithEmail,
  signOut,
  signUpWithEmail,
} from '../../services/auth/auth';
import { theme } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'AuthEmail'>;

type Mode = 'signin' | 'signup';

export default function AuthEmailScreen(_props: Props): React.JSX.Element {
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(getCurrentUser());
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showResetInput, setShowResetInput] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  function clearMessages() {
    setError(null);
    setSuccess(null);
  }

  async function handleAuth() {
    clearMessages();
    if (!email.trim() || !password.trim()) {
      setError('Email and password are required.');
      return;
    }
    setLoading(true);
    try {
      const authUser =
        mode === 'signin'
          ? await signInWithEmail(email.trim(), password)
          : await signUpWithEmail(email.trim(), password);
      setUser(authUser);
      setSuccess(
        mode === 'signin'
          ? 'Signed in successfully.'
          : 'Account created successfully.',
      );
      setEmail('');
      setPassword('');
    } catch (e: any) {
      setError(e?.message ?? 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSignOut() {
    clearMessages();
    setLoading(true);
    try {
      await signOut();
      setUser(null);
      setSuccess('Signed out successfully.');
    } catch (e: any) {
      setError(e?.message ?? 'Sign out failed.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteAccount() {
    clearMessages();
    setLoading(true);
    try {
      await deleteAccount();
      setUser(null);
      setSuccess('Account deleted successfully.');
    } catch (e: any) {
      setError(e?.message ?? 'Account deletion failed.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSendReset() {
    clearMessages();
    if (!resetEmail.trim()) {
      setError('Please enter your email address.');
      return;
    }
    setResetLoading(true);
    try {
      await sendPasswordReset(resetEmail.trim());
      setSuccess('Password reset email sent. Check your inbox.');
      setResetEmail('');
      setShowResetInput(false);
    } catch (e: any) {
      setError(e?.message ?? 'Failed to send reset email.');
    } finally {
      setResetLoading(false);
    }
  }

  function handleModeSwitch(next: Mode) {
    clearMessages();
    setMode(next);
    setEmail('');
    setPassword('');
    setShowResetInput(false);
  }

  return (
    <SafeAreaView style={styles.root}>
      <Header title="Email Auth" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
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

          {user ? (
            <>
              {/* USER INFO */}
              <SectionHeader title="USER INFO" />
              <View style={styles.card}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>UID</Text>
                  <Text
                    style={styles.infoValue}
                    numberOfLines={1}
                    ellipsizeMode="middle"
                  >
                    {user.uid}
                  </Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Email</Text>
                  <Text style={styles.infoValue}>{user.email ?? '—'}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Display Name</Text>
                  <Text style={styles.infoValue}>
                    {user.displayName ?? '—'}
                  </Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Provider</Text>
                  <Text style={styles.infoValue}>{user.providerId}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Anonymous</Text>
                  <Text style={styles.infoValue}>
                    {user.isAnonymous ? 'Yes' : 'No'}
                  </Text>
                </View>
              </View>

              {/* ACTIONS */}
              <SectionHeader title="ACTIONS" />
              <TouchableOpacity
                style={[styles.primaryButton, loading && styles.buttonDisabled]}
                onPress={handleSignOut}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator color={theme.colors.white} />
                ) : (
                  <Text style={styles.primaryButtonText}>Sign Out</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.dangerButton, loading && styles.buttonDisabled]}
                onPress={handleDeleteAccount}
                disabled={loading}
                activeOpacity={0.8}
              >
                <Text style={styles.dangerButtonText}>Delete Account</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              {/* Mode Tabs */}
              <View style={styles.tabRow}>
                <TouchableOpacity
                  style={[styles.tab, mode === 'signin' && styles.tabActive]}
                  onPress={() => handleModeSwitch('signin')}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.tabText,
                      mode === 'signin' && styles.tabTextActive,
                    ]}
                  >
                    Sign In
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.tab, mode === 'signup' && styles.tabActive]}
                  onPress={() => handleModeSwitch('signup')}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.tabText,
                      mode === 'signup' && styles.tabTextActive,
                    ]}
                  >
                    Sign Up
                  </Text>
                </TouchableOpacity>
              </View>

              {/* EMAIL / PASSWORD */}
              <SectionHeader title="EMAIL / PASSWORD" />

              <TextInput
                style={styles.input}
                placeholder="Email address"
                placeholderTextColor={theme.colors.textDisabled}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />

              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Password"
                  placeholderTextColor={theme.colors.textDisabled}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loading}
                />
                <TouchableOpacity
                  style={styles.toggleButton}
                  onPress={() => setShowPassword(prev => !prev)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.toggleText}>
                    {showPassword ? 'Hide' : 'Show'}
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[styles.primaryButton, loading && styles.buttonDisabled]}
                onPress={handleAuth}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator color={theme.colors.white} />
                ) : (
                  <Text style={styles.primaryButtonText}>
                    {mode === 'signin' ? 'Sign In' : 'Create Account'}
                  </Text>
                )}
              </TouchableOpacity>

              {/* Forgot Password */}
              {mode === 'signin' && (
                <View style={styles.resetSection}>
                  <TouchableOpacity
                    onPress={() => {
                      clearMessages();
                      setShowResetInput(prev => !prev);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.forgotText}>Forgot Password?</Text>
                  </TouchableOpacity>

                  {showResetInput && (
                    <View style={styles.resetInputGroup}>
                      <TextInput
                        style={styles.input}
                        placeholder="Enter your email"
                        placeholderTextColor={theme.colors.textDisabled}
                        value={resetEmail}
                        onChangeText={setResetEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        editable={!resetLoading}
                      />
                      <TouchableOpacity
                        style={[
                          styles.primaryButton,
                          resetLoading && styles.buttonDisabled,
                        ]}
                        onPress={handleSendReset}
                        disabled={resetLoading}
                        activeOpacity={0.8}
                      >
                        {resetLoading ? (
                          <ActivityIndicator color={theme.colors.white} />
                        ) : (
                          <Text style={styles.primaryButtonText}>
                            Send Reset Email
                          </Text>
                        )}
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              )}
            </>
          )}
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
  scroll: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },

  // Banners
  errorBanner: {
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

  // User Info Card
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.lg,
    overflow: 'hidden',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm + 2,
  },
  infoLabel: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.weights.medium as '500',
    flex: 1,
  },
  infoValue: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textPrimary,
    fontWeight: theme.typography.weights.regular as '400',
    flex: 2,
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginHorizontal: theme.spacing.md,
  },

  // Tabs
  tabRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.white,
  },
  tabActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  tabText: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium as '500',
    color: theme.colors.textSecondary,
  },
  tabTextActive: {
    color: theme.colors.white,
  },

  // Inputs
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textPrimary,
    backgroundColor: theme.colors.white,
    marginBottom: theme.spacing.md,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    backgroundColor: theme.colors.white,
    marginBottom: theme.spacing.md,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textPrimary,
  },
  toggleButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
  },
  toggleText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.primary,
    fontWeight: theme.typography.weights.medium as '500',
  },

  // Buttons
  primaryButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  primaryButtonText: {
    color: theme.colors.white,
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.semibold as '600',
  },
  dangerButton: {
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.error,
    backgroundColor: theme.colors.white,
    marginBottom: theme.spacing.md,
  },
  dangerButtonText: {
    color: theme.colors.error,
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.semibold as '600',
  },
  buttonDisabled: {
    opacity: 0.6,
  },

  // Forgot Password / Reset
  resetSection: {
    marginTop: theme.spacing.xs,
  },
  forgotText: {
    color: theme.colors.primary,
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium as '500',
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  resetInputGroup: {
    marginTop: theme.spacing.xs,
  },
});
