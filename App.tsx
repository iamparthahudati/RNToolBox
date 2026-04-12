import { GoogleSignin } from '@react-native-google-signin/google-signin';
import React from 'react';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppMask from './src/components/AppMask';
import appConfig from './src/config';
import AppNavigator from './src/navigation/AppNavigator';

// Configure Google Sign-In once at app startup so it is ready before any
// auth screen mounts. The webClientId is sourced from environment config and
// must match the OAuth 2.0 Web client ID in your Firebase Console.
GoogleSignin.configure({
  webClientId: appConfig.GOOGLE_WEB_CLIENT_ID,
});

const App = () => {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <AppNavigator />
        <AppMask />
      </PaperProvider>
    </SafeAreaProvider>
  );
};

export default App;
