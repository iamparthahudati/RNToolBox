import {
  appleAuth,
  AppleRequestOperation,
  AppleRequestScope,
} from '@invertase/react-native-apple-authentication';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Platform } from 'react-native';

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
  await auth().signOut();
}

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
  const credential = auth.GoogleAuthProvider.credential(data?.idToken ?? null);
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
