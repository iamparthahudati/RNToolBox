import { GoogleSignin } from '@react-native-google-signin/google-signin';
import React from 'react';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppMask from './src/components/AppMask';
import AppNavigator from './src/navigation/AppNavigator';
// Configure Google Sign-In once at app startup so it is ready before any
// auth screen mounts. The webClientId must match the OAuth 2.0 Web client ID
// in your Firebase Console.
GoogleSignin.configure({
  webClientId: '75014116828-web.apps.googleusercontent.com',
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
