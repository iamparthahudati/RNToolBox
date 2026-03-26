import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { RootStackParamList } from './types';

import AnimationsScreen from '../screens/AnimationsScreen';
import ComingSoonScreen from '../screens/ComingSoonScreen';
import ButtonsScreen from '../screens/components/ButtonsScreen';
import InputsScreen from '../screens/components/InputsScreen';
import SelectionScreen from '../screens/components/SelectionScreen';
import ComponentsScreen from '../screens/ComponentsScreen';
import FormsScreen from '../screens/FormsScreen';
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
import NavigationPatternsScreen from '../screens/NavigationPatternsScreen';
import NetworkingScreen from '../screens/NetworkingScreen';
import PermissionsScreen from '../screens/PermissionsScreen';
import StorageScreen from '../screens/StorageScreen';
import DeviceInfoScreen from '../screens/system/DeviceInfoScreen';
import SystemScreen from '../screens/SystemScreen';
import TestingScreen from '../screens/TestingScreen';

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
        <Stack.Screen
          name="ComponentTypography"
          component={ComingSoonScreen}
          initialParams={{ title: 'Typography' }}
        />
        <Stack.Screen
          name="ComponentCards"
          component={ComingSoonScreen}
          initialParams={{ title: 'Cards' }}
        />
        <Stack.Screen
          name="ComponentBadges"
          component={ComingSoonScreen}
          initialParams={{ title: 'Badges & Tags' }}
        />
        <Stack.Screen
          name="ComponentModals"
          component={ComingSoonScreen}
          initialParams={{ title: 'Modals & Alerts' }}
        />
        <Stack.Screen
          name="ComponentToast"
          component={ComingSoonScreen}
          initialParams={{ title: 'Toast / Snackbar' }}
        />
        <Stack.Screen
          name="ComponentLoading"
          component={ComingSoonScreen}
          initialParams={{ title: 'Loading States' }}
        />
        <Stack.Screen
          name="ComponentLists"
          component={ComingSoonScreen}
          initialParams={{ title: 'Lists' }}
        />
        <Stack.Screen
          name="ComponentImages"
          component={ComingSoonScreen}
          initialParams={{ title: 'Images' }}
        />
        <Stack.Screen
          name="ComponentIcons"
          component={ComingSoonScreen}
          initialParams={{ title: 'Icons' }}
        />
        <Stack.Screen
          name="ComponentAvatar"
          component={ComingSoonScreen}
          initialParams={{ title: 'Avatar' }}
        />
        <Stack.Screen
          name="ComponentEmptyState"
          component={ComingSoonScreen}
          initialParams={{ title: 'Empty State' }}
        />

        {/* Forms */}
        <Stack.Screen name="Forms" component={FormsScreen} />
        <Stack.Screen
          name="FormsValidation"
          component={ComingSoonScreen}
          initialParams={{ title: 'Form Validation' }}
        />
        <Stack.Screen
          name="FormsHookForm"
          component={ComingSoonScreen}
          initialParams={{ title: 'React Hook Form' }}
        />
        <Stack.Screen
          name="FormsDatePicker"
          component={ComingSoonScreen}
          initialParams={{ title: 'Date Picker' }}
        />
        <Stack.Screen
          name="FormsDropdown"
          component={ComingSoonScreen}
          initialParams={{ title: 'Dropdown / Select' }}
        />
        <Stack.Screen
          name="FormsSearch"
          component={ComingSoonScreen}
          initialParams={{ title: 'Search Input' }}
        />

        {/* Animations */}
        <Stack.Screen name="Animations" component={AnimationsScreen} />
        <Stack.Screen
          name="AnimationsBasic"
          component={ComingSoonScreen}
          initialParams={{ title: 'Animated API' }}
        />
        <Stack.Screen
          name="AnimationsLayout"
          component={ComingSoonScreen}
          initialParams={{ title: 'LayoutAnimation' }}
        />
        <Stack.Screen
          name="AnimationsReanimated"
          component={ComingSoonScreen}
          initialParams={{ title: 'Reanimated' }}
        />
        <Stack.Screen
          name="AnimationsGesture"
          component={ComingSoonScreen}
          initialParams={{ title: 'Gesture Handler' }}
        />
        <Stack.Screen
          name="AnimationsLottie"
          component={ComingSoonScreen}
          initialParams={{ title: 'Lottie' }}
        />

        {/* Navigation Patterns */}
        <Stack.Screen
          name="NavigationPatterns"
          component={NavigationPatternsScreen}
        />
        <Stack.Screen
          name="NavigationTabs"
          component={ComingSoonScreen}
          initialParams={{ title: 'Tab Navigator' }}
        />
        <Stack.Screen
          name="NavigationDrawer"
          component={ComingSoonScreen}
          initialParams={{ title: 'Drawer Navigator' }}
        />
        <Stack.Screen
          name="NavigationModal"
          component={ComingSoonScreen}
          initialParams={{ title: 'Modal Stack' }}
        />
        <Stack.Screen
          name="NavigationDeepLink"
          component={ComingSoonScreen}
          initialParams={{ title: 'Deep Linking' }}
        />
        <Stack.Screen
          name="NavigationAuthFlow"
          component={ComingSoonScreen}
          initialParams={{ title: 'Auth Flow' }}
        />

        {/* Native Actions */}
        <Stack.Screen name="NativeActions" component={NativeActionsScreen} />
        <Stack.Screen name="NativeCallPhone" component={CallPhoneScreen} />
        <Stack.Screen name="NativeSendEmail" component={SendEmailScreen} />
        <Stack.Screen name="NativeClipboard" component={ClipboardScreen} />
        <Stack.Screen name="NativeShare" component={ShareScreen} />
        <Stack.Screen
          name="NativeImagePicker"
          component={ComingSoonScreen}
          initialParams={{ title: 'Image Picker' }}
        />
        <Stack.Screen
          name="NativeFilePicker"
          component={ComingSoonScreen}
          initialParams={{ title: 'File Picker' }}
        />
        <Stack.Screen
          name="NativeHaptics"
          component={ComingSoonScreen}
          initialParams={{ title: 'Haptics' }}
        />
        <Stack.Screen
          name="NativeBiometrics"
          component={ComingSoonScreen}
          initialParams={{ title: 'Biometrics' }}
        />
        <Stack.Screen
          name="NativeCamera"
          component={ComingSoonScreen}
          initialParams={{ title: 'Camera' }}
        />
        <Stack.Screen
          name="NativeBarcode"
          component={ComingSoonScreen}
          initialParams={{ title: 'Barcode / QR Scanner' }}
        />
        <Stack.Screen
          name="NativePushNotifications"
          component={ComingSoonScreen}
          initialParams={{ title: 'Push Notifications' }}
        />
        <Stack.Screen
          name="NativeBackgroundTasks"
          component={ComingSoonScreen}
          initialParams={{ title: 'Background Tasks' }}
        />

        {/* Native - Maps */}
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

        {/* Permissions */}
        <Stack.Screen name="Permissions" component={PermissionsScreen} />
        <Stack.Screen
          name="PermissionsCamera"
          component={ComingSoonScreen}
          initialParams={{ title: 'Camera Permission' }}
        />
        <Stack.Screen
          name="PermissionsLocation"
          component={ComingSoonScreen}
          initialParams={{ title: 'Location Permission' }}
        />
        <Stack.Screen
          name="PermissionsNotifications"
          component={ComingSoonScreen}
          initialParams={{ title: 'Notifications Permission' }}
        />
        <Stack.Screen
          name="PermissionsMicrophone"
          component={ComingSoonScreen}
          initialParams={{ title: 'Microphone Permission' }}
        />
        <Stack.Screen
          name="PermissionsContacts"
          component={ComingSoonScreen}
          initialParams={{ title: 'Contacts Permission' }}
        />
        <Stack.Screen
          name="PermissionsPhotoLibrary"
          component={ComingSoonScreen}
          initialParams={{ title: 'Photo Library Permission' }}
        />
        <Stack.Screen
          name="PermissionsBluetooth"
          component={ComingSoonScreen}
          initialParams={{ title: 'Bluetooth Permission' }}
        />

        {/* Hooks & Utilities */}
        <Stack.Screen name="Hooks" component={HooksScreen} />
        <Stack.Screen
          name="HooksDebounce"
          component={ComingSoonScreen}
          initialParams={{ title: 'useDebounce' }}
        />
        <Stack.Screen
          name="HooksLocalStorage"
          component={ComingSoonScreen}
          initialParams={{ title: 'useLocalStorage' }}
        />
        <Stack.Screen
          name="HooksNetworkStatus"
          component={ComingSoonScreen}
          initialParams={{ title: 'useNetworkStatus' }}
        />
        <Stack.Screen
          name="HooksAppState"
          component={ComingSoonScreen}
          initialParams={{ title: 'useAppState' }}
        />
        <Stack.Screen
          name="HooksKeyboard"
          component={ComingSoonScreen}
          initialParams={{ title: 'useKeyboard' }}
        />
        <Stack.Screen
          name="HooksTimer"
          component={ComingSoonScreen}
          initialParams={{ title: 'useTimer' }}
        />

        {/* Storage */}
        <Stack.Screen name="Storage" component={StorageScreen} />
        <Stack.Screen
          name="StorageAsyncStorage"
          component={ComingSoonScreen}
          initialParams={{ title: 'AsyncStorage' }}
        />
        <Stack.Screen
          name="StorageMMKV"
          component={ComingSoonScreen}
          initialParams={{ title: 'MMKV' }}
        />
        <Stack.Screen
          name="StorageSecure"
          component={ComingSoonScreen}
          initialParams={{ title: 'Secure Storage' }}
        />
        <Stack.Screen
          name="StorageSQLite"
          component={ComingSoonScreen}
          initialParams={{ title: 'SQLite' }}
        />

        {/* Networking */}
        <Stack.Screen name="Networking" component={NetworkingScreen} />
        <Stack.Screen
          name="NetworkingFetch"
          component={ComingSoonScreen}
          initialParams={{ title: 'Fetch API' }}
        />
        <Stack.Screen
          name="NetworkingAxios"
          component={ComingSoonScreen}
          initialParams={{ title: 'Axios' }}
        />
        <Stack.Screen
          name="NetworkingInterceptors"
          component={ComingSoonScreen}
          initialParams={{ title: 'Interceptors' }}
        />
        <Stack.Screen
          name="NetworkingOffline"
          component={ComingSoonScreen}
          initialParams={{ title: 'Offline Detection' }}
        />
        <Stack.Screen
          name="NetworkingWebSocket"
          component={ComingSoonScreen}
          initialParams={{ title: 'WebSocket' }}
        />

        {/* System & Device */}
        <Stack.Screen name="System" component={SystemScreen} />
        <Stack.Screen name="SystemDeviceInfo" component={DeviceInfoScreen} />
        <Stack.Screen
          name="SystemNetwork"
          component={ComingSoonScreen}
          initialParams={{ title: 'Network Info' }}
        />
        <Stack.Screen
          name="SystemEnvironment"
          component={ComingSoonScreen}
          initialParams={{ title: 'Environment Config' }}
        />
        <Stack.Screen
          name="SystemDarkMode"
          component={ComingSoonScreen}
          initialParams={{ title: 'Dark Mode' }}
        />
        <Stack.Screen
          name="SystemLocalization"
          component={ComingSoonScreen}
          initialParams={{ title: 'Localization' }}
        />
        <Stack.Screen
          name="SystemAccessibility"
          component={ComingSoonScreen}
          initialParams={{ title: 'Accessibility' }}
        />
        <Stack.Screen
          name="SystemPushNotifications"
          component={ComingSoonScreen}
          initialParams={{ title: 'Push Notifications' }}
        />

        {/* Testing */}
        <Stack.Screen name="Testing" component={TestingScreen} />
        <Stack.Screen
          name="TestingUnit"
          component={ComingSoonScreen}
          initialParams={{ title: 'Unit Tests' }}
        />
        <Stack.Screen
          name="TestingComponent"
          component={ComingSoonScreen}
          initialParams={{ title: 'Component Tests' }}
        />
        <Stack.Screen
          name="TestingE2E"
          component={ComingSoonScreen}
          initialParams={{ title: 'E2E Tests' }}
        />

        {/* Catch-all for unimplemented screens */}
        <Stack.Screen name="ComingSoon" component={ComingSoonScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
