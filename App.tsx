import React, { useEffect } from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { setBackgroundHandler } from './src/services/notifications';
const App = () => {
  useEffect(() => {
    setBackgroundHandler();
  }, []);
  return <AppNavigator />;
};




export default App;
