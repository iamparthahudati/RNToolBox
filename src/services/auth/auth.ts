import {
  appleAuth,
  AppleRequestOperation,
  AppleRequestScope,
} from '@invertase/react-native-apple-authentication';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Platform } from 'react-native';

/**
 * Module-level confirmation result from a phone OTP request.
 * Only one OTP flow can be active at a time. A new call to sendPhoneOTP
 * will silently overwrite any in-progress confirmation.
 */
let _phoneConfirmation: FirebaseAuthTypes.ConfirmationResult | null = null;

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  phoneNumber: string | null;
  photoURL: string | null;
  providerId: string;
  isAnonymous: boolean;
}

function mapUser(
  user: ReturnType<typeof auth>['currentUser'],
): AuthUser | null {
  if (!user) return null;
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    phoneNumber: user.phoneNumber,
    photoURL: user.photoURL,
    providerId: user.providerData?.[0]?.providerId ?? 'firebase',
    isAnonymous: user.isAnonymous,
  };
}

export function getCurrentUser(): AuthUser | null {
  return mapUser(auth().currentUser);
}

export async function signInWithEmail(
  email: string,
  password: string,
): Promise<AuthUser> {
  const { user } = await auth().signInWithEmailAndPassword(email, password);
  return mapUser(user) as AuthUser;
}

export async function signUpWithEmail(
  email: string,
  password: string,
): Promise<AuthUser> {
  const { user } = await auth().createUserWithEmailAndPassword(email, password);
  return mapUser(user) as AuthUser;
}

export async function signOut(): Promise<void> {
  try {
    await GoogleSignin.revokeAccess();
    await GoogleSignin.signOut();
  } catch {
    // Google SDK sign-out is best-effort; Firebase sign-out must still proceed.
  }
  await auth().signOut();
}

/**
 * Permanently deletes the current user's Firebase account.
 *
 * Firebase requires the user to have authenticated recently before this
 * operation is permitted. If the user's session is stale, Firebase will throw
 * an error with code `auth/requires-recent-login`. Callers should catch that
 * error and prompt the user to re-authenticate before retrying.
 */
export async function deleteAccount(): Promise<void> {
  const user = auth().currentUser;
  if (!user) throw new Error('No authenticated user found.');
  await user.delete();
}

export async function sendPasswordReset(email: string): Promise<void> {
  await auth().sendPasswordResetEmail(email);
}

export async function signInWithGoogle(): Promise<AuthUser> {
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  const { data } = await GoogleSignin.signIn();
  if (!data || !data.idToken) {
    throw new Error('Google Sign-In failed: no ID token returned.');
  }
  const credential = auth.GoogleAuthProvider.credential(data.idToken);
  const result = await auth().signInWithCredential(credential);
  return mapUser(result.user) as AuthUser;
}

export async function sendPhoneOTP(phoneNumber: string): Promise<void> {
  _phoneConfirmation = await auth().signInWithPhoneNumber(phoneNumber);
}

export async function verifyPhoneOTP(code: string): Promise<AuthUser> {
  if (!_phoneConfirmation) {
    throw new Error('No OTP request in progress. Please send OTP first.');
  }
  const credential = await _phoneConfirmation.confirm(code);
  if (!credential || !credential.user) {
    throw new Error('Verification failed. Please try again.');
  }
  _phoneConfirmation = null;
  return mapUser(credential.user) as AuthUser;
}

export async function signInAnonymously(): Promise<AuthUser> {
  const { user } = await auth().signInAnonymously();
  return mapUser(user) as AuthUser;
}

export async function linkAnonymousWithEmail(
  email: string,
  password: string,
): Promise<AuthUser> {
  const currentUser = auth().currentUser;
  if (!currentUser) throw new Error('No authenticated user found.');
  const credential = auth.EmailAuthProvider.credential(email, password);
  const { user } = await currentUser.linkWithCredential(credential);
  return mapUser(user) as AuthUser;
}

export const isAppleAuthAvailable: boolean =
  Platform.OS === 'ios' && appleAuth.isSupported;

export async function signInWithApple(): Promise<AuthUser> {
  const appleAuthResponse = await appleAuth.performRequest({
    requestedOperation: AppleRequestOperation.LOGIN,
    requestedScopes: [AppleRequestScope.EMAIL, AppleRequestScope.FULL_NAME],
  });

  if (!appleAuthResponse.identityToken) {
    throw new Error('Apple Sign-In failed: no identity token returned.');
  }

  const { identityToken, nonce } = appleAuthResponse;
  const appleCredential = auth.AppleAuthProvider.credential(
    identityToken,
    nonce,
  );
  const result = await auth().signInWithCredential(appleCredential);
  return mapUser(result.user) as AuthUser;
}

const FIREBASE_AUTH_ERROR_MAP: Record<string, string> = {
  'auth/user-not-found': 'No account found with this email address.',
  'auth/wrong-password': 'Incorrect password. Please try again.',
  'auth/email-already-in-use': 'An account with this email already exists.',
  'auth/weak-password': 'Password must be at least 6 characters.',
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/too-many-requests': 'Too many attempts. Please try again later.',
  'auth/requires-recent-login':
    'Please sign out and sign back in before performing this action.',
  'auth/network-request-failed': 'Network error. Please check your connection.',
  'auth/user-disabled': 'This account has been disabled.',
  'auth/invalid-credential': 'Invalid credentials. Please try again.',
  'auth/account-exists-with-different-credential':
    'An account already exists with a different sign-in method.',
  'auth/operation-not-allowed': 'This sign-in method is not enabled.',
};

export function parseFirebaseAuthError(error: unknown): string {
  if (error !== null && typeof error === 'object') {
    const code = (error as Record<string, unknown>).code;
    if (typeof code === 'string' && code in FIREBASE_AUTH_ERROR_MAP) {
      return FIREBASE_AUTH_ERROR_MAP[code];
    }
    const message = (error as Record<string, unknown>).message;
    if (typeof message === 'string' && message.length > 0) {
      return message;
    }
  }
  return 'An unexpected error occurred. Please try again.';
}
