import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import ComingSoonScreen from '../screens/ComingSoonScreen';
import ButtonsScreen from '../screens/components/ButtonsScreen';
import InputsScreen from '../screens/components/InputsScreen';
import SelectionScreen from '../screens/components/SelectionScreen';
import ComponentsScreen from '../screens/ComponentsScreen';
import HomeScreen from '../screens/HomeScreen';
import HooksScreen from '../screens/HooksScreen';
import NativeActionsScreen from '../screens/NativeActionsScreen';
import PermissionsScreen from '../screens/PermissionsScreen';
import DeviceInfoScreen from '../screens/system/DeviceInfoScreen';
import SystemScreen from '../screens/SystemScreen';

export type RootStackParamList = {
  Home: undefined;
  ComingSoon: { title: string };

  // UI Components
  Components: undefined;
  ComponentButtons: undefined;
  ComponentInputs: undefined;
  ComponentSelection: undefined;

  // Top-level sections
  NativeActions: undefined;
  Permissions: undefined;
  Hooks: undefined;
  System: undefined;
  SystemDeviceInfo: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />

        {/* UI Components */}
        <Stack.Screen name="Components" component={ComponentsScreen} />
        <Stack.Screen name="ComponentButtons" component={ButtonsScreen} />
        <Stack.Screen name="ComponentInputs" component={InputsScreen} />
        <Stack.Screen name="ComponentSelection" component={SelectionScreen} />

        {/* Top-level sections */}
        <Stack.Screen name="NativeActions" component={NativeActionsScreen} />
        <Stack.Screen name="Permissions" component={PermissionsScreen} />
        <Stack.Screen name="Hooks" component={HooksScreen} />
        <Stack.Screen name="System" component={SystemScreen} />
        <Stack.Screen name="SystemDeviceInfo" component={DeviceInfoScreen} />

        {/* Catch-all for unimplemented screens */}
        <Stack.Screen name="ComingSoon" component={ComingSoonScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
