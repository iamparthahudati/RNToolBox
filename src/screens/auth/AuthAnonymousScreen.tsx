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

import Header from '../../components/atoms/Header/Header';
import InfoRow from '../../components/molecules/InfoRow/InfoRow';
import SectionHeader from '../../components/molecules/SectionHeader/SectionHeader';
import { RootStackParamList } from '../../navigation/types';
import {
  AuthUser,
  deleteAccount,
  getCurrentUser,
  linkAnonymousWithEmail,
  signInAnonymously,
  signOut,
} from '../../services/auth';
import { theme } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'AuthAnonymous'>;

export default function AuthAnonymousScreen(_props: Props): React.JSX.Element {
  const [user, setUser] = useState<AuthUser | null>(getCurrentUser());
  const [loading, setLoading] = useState(false);
  const [linkEmail, setLinkEmail] = useState('');
  const [linkPassword, setLinkPassword] = useState('');
  const [linkLoading, setLinkLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  function clearMessages() {
    setError(null);
    setSuccess(null);
  }

  async function handleSignInAnonymously() {
    clearMessages();
    setLoading(true);
    try {
      const result = await signInAnonymously();
      setUser(result);
      setSuccess(
        'Signed in anonymously. A temporary account has been created.',
      );
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Anonymous sign-in failed.');
    } finally {
      setLoading(false);
    }
  }

  async function handleLinkAccount() {
    if (!linkEmail.trim() || !linkPassword.trim()) {
      setError('Please enter both email and password to link your account.');
      return;
    }
    clearMessages();
    setLinkLoading(true);
    try {
      const result = await linkAnonymousWithEmail(
        linkEmail.trim(),
        linkPassword,
      );
      setUser(result);
      setLinkEmail('');
      setLinkPassword('');
      setSuccess('Account linked successfully. Your UID has been preserved.');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to link account.');
    } finally {
      setLinkLoading(false);
    }
  }

  async function handleSignOut() {
    clearMessages();
    setLoading(true);
    try {
      await signOut();
      setUser(null);
      setSuccess('Signed out successfully.');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Sign-out failed.');
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
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to delete account.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.root}>
      <Header title="Anonymous Auth" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
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

          {/* ── NOT SIGNED IN ── */}
          {!user && (
            <>
              <SectionHeader title="ANONYMOUS SIGN-IN" />

              <View style={styles.infoCard}>
                <Text style={styles.infoCardTitle}>
                  What is Anonymous Auth?
                </Text>
                <Text style={styles.infoCardBody}>
                  Anonymous authentication creates a temporary Firebase account
                  with no credentials required — no email, no password, no phone
                  number. The generated UID persists across app restarts until
                  the user signs out or deletes the account. At any point, the
                  anonymous account can be upgraded to a permanent one by
                  linking an email/password, Google, or other provider,
                  preserving the same UID and any associated data.
                </Text>
              </View>

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleSignInAnonymously}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator color={theme.colors.white} />
                ) : (
                  <Text style={styles.primaryButtonText}>
                    Sign In Anonymously
                  </Text>
                )}
              </TouchableOpacity>
            </>
          )}

          {/* ── SIGNED IN — ANONYMOUS ── */}
          {user && user.isAnonymous && (
            <>
              <SectionHeader title="USER" />

              <View style={styles.card}>
                <View style={styles.cardRow}>
                  <Text style={styles.cardLabel}>Status</Text>
                  <View style={styles.anonymousBadge}>
                    <Text style={styles.anonymousBadgeText}>Anonymous</Text>
                  </View>
                </View>
                <InfoRow label="UID" value={user.uid} />
                <InfoRow label="Type" value="Anonymous" />
                <InfoRow label="Provider" value={user.providerId} />
              </View>

              <SectionHeader title="UPGRADE ACCOUNT" />

              <View style={styles.upgradeCard}>
                <Text style={styles.upgradeCardText}>
                  Link a permanent email/password to keep this account. Your UID
                  and all associated data will be preserved after linking.
                </Text>
              </View>

              <TextInput
                style={styles.input}
                placeholder="Email address"
                placeholderTextColor={theme.colors.textDisabled}
                value={linkEmail}
                onChangeText={setLinkEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!linkLoading}
              />

              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={theme.colors.textDisabled}
                value={linkPassword}
                onChangeText={setLinkPassword}
                secureTextEntry
                editable={!linkLoading}
              />

              <TouchableOpacity
                style={styles.outlineButton}
                onPress={handleLinkAccount}
                disabled={linkLoading}
                activeOpacity={0.8}
              >
                {linkLoading ? (
                  <ActivityIndicator color={theme.colors.primary} />
                ) : (
                  <Text style={styles.outlineButtonText}>Link Account</Text>
                )}
              </TouchableOpacity>

              <SectionHeader title="ACTIONS" />

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={handleSignOut}
                disabled={loading}
                activeOpacity={0.8}
              >
                <Text style={styles.secondaryButtonText}>Sign Out</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.dangerButton}
                onPress={handleDeleteAccount}
                disabled={loading}
                activeOpacity={0.8}
              >
                <Text style={styles.dangerButtonText}>Delete Account</Text>
              </TouchableOpacity>
            </>
          )}

          {/* ── SIGNED IN — PERMANENT ── */}
          {user && !user.isAnonymous && (
            <>
              <SectionHeader title="USER" />

              <View style={styles.card}>
                <InfoRow label="UID" value={user.uid} />
                <InfoRow label="Email" value={user.email ?? '—'} />
                <InfoRow label="Type" value="Permanent" />
                <InfoRow label="Provider" value={user.providerId} />
              </View>

              <SectionHeader title="ACTIONS" />

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={handleSignOut}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator color={theme.colors.primary} />
                ) : (
                  <Text style={styles.secondaryButtonText}>Sign Out</Text>
                )}
              </TouchableOpacity>
            </>
          )}

          {/* ── HOW IT WORKS ── */}
          <SectionHeader title="HOW IT WORKS" />

          <View style={styles.howCard}>
            <Text style={styles.howTitle}>Anonymous Authentication</Text>
            <Text style={styles.howBody}>
              <Text style={styles.howBold}>Temporary account: </Text>
              Firebase creates a real user record with a unique UID — no
              credentials are required. The account is indistinguishable from
              any other Firebase user in terms of Firestore rules and data
              access.
            </Text>
            <Text style={styles.howBody}>
              <Text style={styles.howBold}>Persistence: </Text>
              The UID persists across app restarts as long as the user remains
              signed in. Signing out or deleting the account permanently removes
              the record.
            </Text>
            <Text style={styles.howBody}>
              <Text style={styles.howBold}>Upgrading: </Text>
              Calling <Text style={styles.howCode}>
                linkWithCredential()
              </Text>{' '}
              attaches a permanent provider (email/password, Google, etc.) to
              the anonymous account. The UID stays the same, so all existing
              data is automatically associated with the now-permanent account.
            </Text>
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

  // Info card (sign-in page)
  infoCard: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  infoCardTitle: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.semibold as '600',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  infoCardBody: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },

  // User card
  card: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    backgroundColor: theme.colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  cardLabel: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
  },

  // Anonymous badge
  anonymousBadge: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    backgroundColor: '#F3F4F6',
    borderRadius: 999,
  },
  anonymousBadgeText: {
    fontSize: theme.typography.sizes.xs,
    fontWeight: theme.typography.weights.medium as '500',
    color: theme.colors.textSecondary,
  },

  // Upgrade card
  upgradeCard: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.md,
    backgroundColor: '#FFFBEB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  upgradeCardText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },

  // TextInput
  input: {
    marginHorizontal: theme.spacing.lg,
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

  // Buttons
  primaryButton: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
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
  outlineButton: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: theme.colors.white,
  },
  outlineButtonText: {
    color: theme.colors.primary,
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.semibold as '600',
  },
  secondaryButton: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: theme.colors.white,
  },
  secondaryButtonText: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium as '500',
  },
  dangerButton: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
  },
  dangerButtonText: {
    color: theme.colors.error,
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium as '500',
  },

  // How it works
  howCard: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: theme.spacing.sm,
  },
  howTitle: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.semibold as '600',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  howBody: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  howBold: {
    fontWeight: theme.typography.weights.semibold as '600',
    color: theme.colors.textPrimary,
  },
  howCode: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.primary,
    backgroundColor: '#EFF6FF',
  },
});
