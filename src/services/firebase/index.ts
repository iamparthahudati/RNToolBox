/**
 * Firebase service layer.
 *
 * Native initialization is handled at the platform level:
 *   - iOS:     AppDelegate.swift (FirebaseApp.configure())
 *   - Android: google-services Gradle plugin (auto-initialized on app start)
 *
 * JS/TS code only consumes the already-initialized default app instance.
 */

import { ReactNativeFirebase } from '@react-native-firebase/app';
import { firebaseApp } from './firebase';

type FirebaseApp = ReactNativeFirebase.FirebaseApp;

/**
 * Returns the default Firebase app instance.
 */
export const getFirebaseApp = (): FirebaseApp => firebaseApp;

/**
 * Typed Firebase service object providing access to the default app.
 */
export const FirebaseService: { readonly app: FirebaseApp } = {
  get app(): FirebaseApp {
    return firebaseApp;
  },
};

export { firebaseApp } from './firebase';
