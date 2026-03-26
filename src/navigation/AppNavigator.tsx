import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { RootStackParamList } from './types';

import ComingSoonScreen from '../screens/ComingSoonScreen';
import ButtonsScreen from '../screens/components/ButtonsScreen';
import InputsScreen from '../screens/components/InputsScreen';
import SelectionScreen from '../screens/components/SelectionScreen';
import ComponentsScreen from '../screens/ComponentsScreen';
import HomeScreen from '../screens/HomeScreen';
import HooksScreen from '../screens/HooksScreen';
import CallPhoneScreen from '../screens/native/CallPhoneScreen';
import ClipboardScreen from '../screens/native/ClipboardScreen';
import BasicMapScreen from '../screens/native/maps/BasicMapScreen';
import DirectionsScreen from '../screens/native/maps/DirectionsScreen';
import GeofenceScreen from '../screens/native/maps/GeofenceScreen';
import MarkersScreen from '../screens/native/maps/MarkersScreen';
import MyLocationScreen from '../screens/native/maps/MyLocationScreen';
import OpenInMapsScreen from '../screens/native/maps/OpenInMapsScreen';
import PolygonScreen from '../screens/native/maps/PolygonScreen';
import MapsScreen from '../screens/native/MapsScreen';
import SendEmailScreen from '../screens/native/SendEmailScreen';
import ShareScreen from '../screens/native/ShareScreen';
import NativeActionsScreen from '../screens/NativeActionsScreen';
import PermissionsScreen from '../screens/PermissionsScreen';
import DeviceInfoScreen from '../screens/system/DeviceInfoScreen';
import SystemScreen from '../screens/SystemScreen';

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

        {/* Native - Actions */}
        <Stack.Screen name="NativeCallPhone" component={CallPhoneScreen} />
        <Stack.Screen name="NativeSendEmail" component={SendEmailScreen} />
        <Stack.Screen name="NativeClipboard" component={ClipboardScreen} />
        <Stack.Screen name="NativeShare" component={ShareScreen} />

        {/* Native */}
        <Stack.Screen name="NativeMaps" component={MapsScreen} />
        <Stack.Screen name="NativeMapsBasic" component={BasicMapScreen} />
        <Stack.Screen name="NativeMapsLocation" component={MyLocationScreen} />
        <Stack.Screen name="NativeMapsMarkers" component={MarkersScreen} />
        <Stack.Screen
          name="NativeMapsDirections"
          component={DirectionsScreen}
        />
        <Stack.Screen name="NativeMapsPolygon" component={PolygonScreen} />
        <Stack.Screen name="NativeMapsGeofence" component={GeofenceScreen} />
        <Stack.Screen name="NativeMapsOpen" component={OpenInMapsScreen} />

        {/* Catch-all for unimplemented screens */}
        <Stack.Screen name="ComingSoon" component={ComingSoonScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
