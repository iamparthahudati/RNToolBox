import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
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
  isAppleAuthAvailable,
  signInWithApple,
  signOut,
} from '../../services/auth';
import { theme } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'AuthApple'>;

export default function AuthAppleScreen(_props: Props): React.JSX.Element {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  const handleSignIn = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const signedInUser = await signInWithApple();
      setUser(signedInUser);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Apple Sign-In failed.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await signOut();
      setUser(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Sign-out failed.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <Header title="Apple Sign-In" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Platform notice — shown when not on iOS */}
        {!isAppleAuthAvailable && (
          <View style={styles.section}>
            <View style={styles.noticeCard}>
              <View style={styles.noticeIconCircle}>
                <Text style={styles.noticeIcon}></Text>
              </View>
              <Text style={styles.noticeTitle}>iOS Only</Text>
              <Text style={styles.noticeBody}>
                Apple Sign-In is only available on iOS 13 and later. This
                feature is not supported on Android or other platforms.
              </Text>
              <View style={styles.noticePlatformBadge}>
                <Text style={styles.noticePlatformText}>
                  Current platform: {Platform.OS.toUpperCase()}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Signed-in state */}
        {isAppleAuthAvailable && user && (
          <>
            <SectionHeader title="STATUS" />
            <View style={styles.card}>
              <InfoRow label="UID" value={user.uid} />
              <InfoRow label="Email" value={user.email ?? '—'} />
              <InfoRow label="Display Name" value={user.displayName ?? '—'} />
              <InfoRow
                label="Provider"
                value={user.providerId ?? 'apple.com'}
              />
            </View>

            <SectionHeader title="ACTIONS" />
            <View style={styles.section}>
              {error && (
                <View style={styles.errorBanner}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}
              <TouchableOpacity
                style={styles.primaryButton}
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
            </View>
          </>
        )}

        {/* Sign-in card — shown on iOS when not signed in */}
        {isAppleAuthAvailable && !user && (
          <View style={styles.section}>
            <View style={styles.signInCard}>
              <View style={styles.appleLogoCircle}>
                <Text style={styles.appleLogoText}></Text>
              </View>

              <Text style={styles.signInTitle}>Sign in with Apple</Text>
              <Text style={styles.signInSubtitle}>
                Use your Apple ID to authenticate securely and privately via
                Firebase.
              </Text>

              {error && (
                <View style={styles.errorBanner}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              <TouchableOpacity
                style={styles.appleButton}
                onPress={handleSignIn}
                disabled={loading}
                activeOpacity={0.85}
              >
                {loading ? (
                  <ActivityIndicator color={theme.colors.white} />
                ) : (
                  <>
                    <Text style={styles.appleButtonIcon}></Text>
                    <Text style={styles.appleButtonText}>
                      Continue with Apple
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* HOW IT WORKS — always visible */}
        <SectionHeader title="HOW IT WORKS" />
        <View style={styles.card}>
          <View style={styles.stepRow}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeText}>1</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>performRequest</Text>
              <Text style={styles.stepDescription}>
                appleAuth.performRequest() triggers the native Apple Sign-In
                sheet, requesting the user's email and full name scopes.
              </Text>
            </View>
          </View>

          <View style={styles.stepDivider} />

          <View style={styles.stepRow}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeText}>2</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>identityToken</Text>
              <Text style={styles.stepDescription}>
                On success, Apple returns a signed JWT identityToken. This token
                is used to prove the user's identity to Firebase.
              </Text>
            </View>
          </View>

          <View style={styles.stepDivider} />

          <View style={styles.stepRow}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeText}>3</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>AppleAuthProvider.credential</Text>
              <Text style={styles.stepDescription}>
                The identityToken and nonce are wrapped into a Firebase
                OAuthCredential via auth.AppleAuthProvider.credential().
              </Text>
            </View>
          </View>

          <View style={styles.stepDivider} />

          <View style={styles.stepRow}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeText}>4</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>signInWithCredential</Text>
              <Text style={styles.stepDescription}>
                auth().signInWithCredential(credential) completes Firebase
                authentication. Note: email is only returned on the very first
                sign-in — subsequent logins will return null for email.
              </Text>
            </View>
          </View>
        </View>
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
    paddingBottom: theme.spacing.xxl,
  },

  // Layout
  section: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  card: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },

  // Platform notice card
  noticeCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  noticeIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
  },
  noticeIcon: {
    fontSize: 36,
    color: theme.colors.textSecondary,
  },
  noticeTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold as '600',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  noticeBody: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: theme.spacing.lg,
  },
  noticePlatformBadge: {
    backgroundColor: theme.colors.surface,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
  },
  noticePlatformText: {
    fontSize: theme.typography.sizes.xs,
    fontWeight: theme.typography.weights.medium as '500',
    color: theme.colors.textSecondary,
  },

  // Sign-in card
  signInCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  appleLogoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: theme.colors.black,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
  },
  appleLogoText: {
    fontSize: 38,
    color: theme.colors.white,
    lineHeight: 46,
  },
  signInTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold as '600',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  signInSubtitle: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: theme.spacing.lg,
  },

  // Apple button
  appleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.black,
    borderRadius: 8,
    paddingVertical: 14,
    width: '100%',
  },
  appleButtonIcon: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.white,
    marginRight: theme.spacing.sm,
    lineHeight: 22,
  },
  appleButtonText: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.semibold as '600',
    color: theme.colors.white,
  },

  // Primary button (sign out)
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

  // Error banner
  errorBanner: {
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FECACA',
    width: '100%',
  },
  errorText: {
    color: theme.colors.error,
    fontSize: theme.typography.sizes.sm,
  },

  // How it works steps
  stepRow: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    alignItems: 'flex-start',
  },
  stepBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
    marginTop: 1,
    flexShrink: 0,
  },
  stepBadgeText: {
    fontSize: theme.typography.sizes.xs,
    fontWeight: theme.typography.weights.bold as '700',
    color: theme.colors.white,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.semibold as '600',
    color: theme.colors.textPrimary,
    marginBottom: 2,
  },
  stepDescription: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
  stepDivider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginHorizontal: theme.spacing.md,
  },
});
