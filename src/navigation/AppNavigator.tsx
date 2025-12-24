import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import ComponentsScreen from '../screens/ComponentsScreen';
import NativeActionsScreen from '../screens/NativeActionsScreen';
import PermissionsScreen from '../screens/PermissionsScreen';
import HooksScreen from '../screens/HooksScreen';
import SystemScreen from '../screens/SystemScreen';

export type RootStackParamList = {
  Home: undefined;
  Components: undefined;
  NativeActions: undefined;
  Permissions: undefined;
  Hooks: undefined;
  System: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Components" component={ComponentsScreen} />
        <Stack.Screen name="NativeActions" component={NativeActionsScreen} />
        <Stack.Screen name="Permissions" component={PermissionsScreen} />
        <Stack.Screen name="Hooks" component={HooksScreen} />
        <Stack.Screen name="System" component={SystemScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
