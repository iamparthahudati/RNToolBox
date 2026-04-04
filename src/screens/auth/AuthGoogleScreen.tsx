import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
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
  signInWithGoogle,
  signOut,
} from '../../services/auth/auth';
import { theme } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'AuthGoogle'>;

export default function AuthGoogleScreen(_props: Props): React.JSX.Element {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Replace 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com' with the actual
    // web client ID from your Firebase Console (Project Settings > General > Web API Key
    // or Google Sign-In > Web client ID).
    GoogleSignin.configure({
      webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
    });

    setUser(getCurrentUser());
  }, []);

  const handleSignIn = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const signedInUser = await signInWithGoogle();
      setUser(signedInUser);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Google Sign-In failed.';
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
      <Header title="Google Sign-In" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {user ? (
          <>
            {/* STATUS */}
            <SectionHeader title="STATUS" />
            <View style={styles.card}>
              <InfoRow label="UID" value={user.uid} />
              <InfoRow label="Email" value={user.email ?? '—'} />
              <InfoRow label="Display Name" value={user.displayName ?? '—'} />
              <InfoRow
                label="Provider"
                value={user.providerId ?? 'google.com'}
              />
            </View>

            {/* ACTIONS */}
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
        ) : (
          <>
            {/* SIGN-IN CARD */}
            <View style={styles.section}>
              <View style={styles.signInCard}>
                {/* Google logo placeholder */}
                <View style={styles.googleLogoContainer}>
                  <Text style={styles.googleLogoText}>G</Text>
                </View>

                <Text style={styles.signInTitle}>Sign in with Google</Text>
                <Text style={styles.signInSubtitle}>
                  Use your Google account to authenticate securely via Firebase.
                </Text>

                {error && (
                  <View style={styles.errorBanner}>
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                )}

                {/* Google-styled button */}
                <TouchableOpacity
                  style={styles.googleButton}
                  onPress={handleSignIn}
                  disabled={loading}
                  activeOpacity={0.85}
                >
                  <View style={styles.gBadge}>
                    <Text style={styles.gBadgeText}>G</Text>
                  </View>
                  {loading ? (
                    <ActivityIndicator
                      color="#4285F4"
                      style={styles.googleButtonLoader}
                    />
                  ) : (
                    <Text style={styles.googleButtonText}>
                      Continue with Google
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}

        {/* HOW IT WORKS — always visible */}
        <SectionHeader title="HOW IT WORKS" />
        <View style={styles.card}>
          <View style={styles.stepRow}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeText}>1</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Configure webClientId</Text>
              <Text style={styles.stepDescription}>
                Call GoogleSignin.configure() with the web client ID from your
                Firebase Console before invoking sign-in.
              </Text>
            </View>
          </View>

          <View style={styles.stepDivider} />

          <View style={styles.stepRow}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeText}>2</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>GoogleSignin.signIn()</Text>
              <Text style={styles.stepDescription}>
                Triggers the native Google account picker. On success, returns
                an idToken representing the authenticated user.
              </Text>
            </View>
          </View>

          <View style={styles.stepDivider} />

          <View style={styles.stepRow}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeText}>3</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>
                Exchange for Firebase credential
              </Text>
              <Text style={styles.stepDescription}>
                Pass the idToken to GoogleAuthProvider.credential() to create a
                Firebase-compatible OAuth credential.
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
                Call auth().signInWithCredential(credential) to complete
                Firebase authentication and receive a UserCredential.
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

  // Sign-in card
  signInCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  googleLogoContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EAF1FB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
  },
  googleLogoText: {
    fontSize: 32,
    fontWeight: theme.typography.weights.bold as '700',
    color: '#4285F4',
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

  // Google button
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: '#DADCE0',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: theme.spacing.lg,
    width: '100%',
  },
  gBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#4285F4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  gBadgeText: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.bold as '700',
    color: theme.colors.white,
  },
  googleButtonText: {
    flex: 1,
    textAlign: 'center',
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.semibold as '600',
    color: '#4285F4',
  },
  googleButtonLoader: {
    flex: 1,
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
