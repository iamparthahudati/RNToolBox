/**
 * Firebase implementation.
 *
 * Native initialization is handled at the platform level:
 *   - iOS:     AppDelegate.swift (FirebaseApp.configure())
 *   - Android: google-services Gradle plugin (auto-initialized on app start)
 *
 * This module simply exposes the already-initialized default Firebase app
 * instance provided by @react-native-firebase/app.
 */

import firebase from '@react-native-firebase/app';

/**
 * The default Firebase app instance.
 */
export const firebaseApp = firebase.app();

export default firebaseApp;
