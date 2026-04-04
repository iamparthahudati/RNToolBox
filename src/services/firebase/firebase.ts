/**
 * Firebase implementation.
 *
 * Native initialization is handled at the platform level:
 *   - iOS:     AppDelegate.swift (FirebaseApp.configure())
 *   - Android: google-services Gradle plugin (auto-initialized on app start)
 *
 * This module simply exposes the already-initialized default Firebase app
 * instance provided by @react-native-firebase/app.
 *
 * Environment → Firebase project mapping:
 *   - dev / prod  → rntollbox    (google-services.json / GoogleService-Info.plist)
 *   - staging     → rntoolbox-qa (google-services.json / GoogleService-Info.plist)
 */

import firebase from '@react-native-firebase/app';

/**
 * The default Firebase app instance for the current environment.
 */
export const firebaseApp = firebase.app();

export default firebaseApp;
