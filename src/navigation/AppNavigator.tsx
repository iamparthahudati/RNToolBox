import AnimationsScreen from '../screens/AnimationsScreen';
import AppMaskingScreen from '../screens/security/AppMaskingScreen';
import BadgesScreen from '../screens/components/BadgesScreen';
import BasicMapScreen from '../screens/native/maps/BasicMapScreen';
import ButtonsScreen from '../screens/components/ButtonsScreen';
import CallPhoneScreen from '../screens/native/CallPhoneScreen';
import CertificatePinningScreen from '../screens/security/CertificatePinningScreen';
import ClipboardScreen from '../screens/native/ClipboardScreen';
import ComingSoonScreen from '../screens/ComingSoonScreen';
import ComponentsScreen from '../screens/ComponentsScreen';
import DeviceInfoScreen from '../screens/system/DeviceInfoScreen';
import DirectionsScreen from '../screens/native/maps/DirectionsScreen';
import FormsScreen from '../screens/FormsScreen';
import GeofenceScreen from '../screens/native/maps/GeofenceScreen';
import HapticsScreen from '../screens/native/HapticsScreen';
import HomeScreen from '../screens/HomeScreen';
import HooksScreen from '../screens/HooksScreen';
import InputsScreen from '../screens/components/InputsScreen';
import JailbreakScreen from '../screens/security/JailbreakScreen';
import LoadingScreen from '../screens/components/LoadingScreen';
import MapsScreen from '../screens/native/MapsScreen';
import MarkersScreen from '../screens/native/maps/MarkersScreen';
import MyLocationScreen from '../screens/native/maps/MyLocationScreen';
import NativeActionsScreen from '../screens/NativeActionsScreen';
import { NavigationContainer } from '@react-navigation/native';
import NavigationPatternsScreen from '../screens/NavigationPatternsScreen';
import NetworkingScreen from '../screens/NetworkingScreen';
import ObfuscationScreen from '../screens/security/ObfuscationScreen';
import OpenInMapsScreen from '../screens/native/maps/OpenInMapsScreen';
import PermissionsScreen from '../screens/PermissionsScreen';
import PolygonScreen from '../screens/native/maps/PolygonScreen';
import React from 'react';
import RefactoringScreen from '../screens/RefactoringScreen';
import RemoteConfigScreen from '../screens/networking/RemoteConfigScreen';
import RemoteConfigSetupScreen from '../screens/networking/RemoteConfigSetupScreen';
import { RootStackParamList } from './types';
import ScreenshotPreventionScreen from '../screens/security/ScreenshotPreventionScreen';
import SecurityScreen from '../screens/SecurityScreen';
import SelectionScreen from '../screens/components/SelectionScreen';
import SendEmailScreen from '../screens/native/SendEmailScreen';
import ShareScreen from '../screens/native/ShareScreen';
import StorageScreen from '../screens/StorageScreen';
import SystemScreen from '../screens/SystemScreen';
import TestingScreen from '../screens/TestingScreen';
import TypographyScreen from '../screens/components/TypographyScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

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
        <Stack.Screen name="ComponentTypography" component={TypographyScreen} />
        <Stack.Screen name="ComponentCards" component={ComingSoonScreen} />
        <Stack.Screen name="ComponentBadges" component={BadgesScreen} />
        <Stack.Screen name="ComponentModals" component={ComingSoonScreen} />
        <Stack.Screen name="ComponentToast" component={ComingSoonScreen} />
        <Stack.Screen name="ComponentLoading" component={LoadingScreen} />
        <Stack.Screen name="ComponentLists" component={ComingSoonScreen} />
        <Stack.Screen name="ComponentImages" component={ComingSoonScreen} />
        <Stack.Screen name="ComponentIcons" component={ComingSoonScreen} />
        <Stack.Screen name="ComponentAvatar" component={ComingSoonScreen} />
        <Stack.Screen name="ComponentEmptyState" component={ComingSoonScreen} />

        {/* Forms */}
        <Stack.Screen name="Forms" component={FormsScreen} />
        <Stack.Screen name="FormsValidation" component={ComingSoonScreen} />
        <Stack.Screen name="FormsHookForm" component={ComingSoonScreen} />
        <Stack.Screen name="FormsDatePicker" component={ComingSoonScreen} />
        <Stack.Screen name="FormsDropdown" component={ComingSoonScreen} />
        <Stack.Screen name="FormsSearch" component={ComingSoonScreen} />

        {/* Animations */}
        <Stack.Screen name="Animations" component={AnimationsScreen} />
        <Stack.Screen name="AnimationsBasic" component={ComingSoonScreen} />
        <Stack.Screen name="AnimationsLayout" component={ComingSoonScreen} />
        <Stack.Screen
          name="AnimationsReanimated"
          component={ComingSoonScreen}
        />
        <Stack.Screen name="AnimationsGesture" component={ComingSoonScreen} />
        <Stack.Screen name="AnimationsLottie" component={ComingSoonScreen} />

        {/* Navigation Patterns */}
        <Stack.Screen
          name="NavigationPatterns"
          component={NavigationPatternsScreen}
        />
        <Stack.Screen name="NavigationTabs" component={ComingSoonScreen} />
        <Stack.Screen name="NavigationDrawer" component={ComingSoonScreen} />
        <Stack.Screen name="NavigationModal" component={ComingSoonScreen} />
        <Stack.Screen name="NavigationDeepLink" component={ComingSoonScreen} />
        <Stack.Screen name="NavigationAuthFlow" component={ComingSoonScreen} />

        {/* Native Actions */}
        <Stack.Screen name="NativeActions" component={NativeActionsScreen} />
        <Stack.Screen name="NativeCallPhone" component={CallPhoneScreen} />
        <Stack.Screen name="NativeSendEmail" component={SendEmailScreen} />
        <Stack.Screen name="NativeClipboard" component={ClipboardScreen} />
        <Stack.Screen name="NativeShare" component={ShareScreen} />
        <Stack.Screen name="NativeImagePicker" component={ComingSoonScreen} />
        <Stack.Screen name="NativeFilePicker" component={ComingSoonScreen} />
        <Stack.Screen name="NativeHaptics" component={HapticsScreen} />
        <Stack.Screen name="NativeBiometrics" component={ComingSoonScreen} />
        <Stack.Screen name="NativeCamera" component={ComingSoonScreen} />
        <Stack.Screen name="NativeBarcode" component={ComingSoonScreen} />
        <Stack.Screen
          name="NativeFCMPushNotifications"
          component={ComingSoonScreen}
        />
        <Stack.Screen
          name="NativeBackgroundTasks"
          component={ComingSoonScreen}
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
        <Stack.Screen name="PermissionsCamera" component={ComingSoonScreen} />
        <Stack.Screen name="PermissionsLocation" component={ComingSoonScreen} />
        <Stack.Screen
          name="PermissionsNotifications"
          component={ComingSoonScreen}
        />
        <Stack.Screen
          name="PermissionsMicrophone"
          component={ComingSoonScreen}
        />
        <Stack.Screen name="PermissionsContacts" component={ComingSoonScreen} />
        <Stack.Screen
          name="PermissionsPhotoLibrary"
          component={ComingSoonScreen}
        />
        <Stack.Screen
          name="PermissionsBluetooth"
          component={ComingSoonScreen}
        />

        {/* Hooks & Utilities */}
        <Stack.Screen name="Hooks" component={HooksScreen} />
        <Stack.Screen name="HooksDebounce" component={ComingSoonScreen} />
        <Stack.Screen name="HooksLocalStorage" component={ComingSoonScreen} />
        <Stack.Screen name="HooksNetworkStatus" component={ComingSoonScreen} />
        <Stack.Screen name="HooksAppState" component={ComingSoonScreen} />
        <Stack.Screen name="HooksKeyboard" component={ComingSoonScreen} />
        <Stack.Screen name="HooksTimer" component={ComingSoonScreen} />

        {/* Storage */}
        <Stack.Screen name="Storage" component={StorageScreen} />
        <Stack.Screen name="StorageAsyncStorage" component={ComingSoonScreen} />
        <Stack.Screen name="StorageMMKV" component={ComingSoonScreen} />
        <Stack.Screen name="StorageSecure" component={ComingSoonScreen} />
        <Stack.Screen name="StorageSQLite" component={ComingSoonScreen} />
        <Stack.Screen name="StorageFirebase" component={ComingSoonScreen} />

        {/* Networking */}
        <Stack.Screen name="Networking" component={NetworkingScreen} />
        <Stack.Screen name="NetworkingFetch" component={ComingSoonScreen} />
        <Stack.Screen name="NetworkingAxios" component={ComingSoonScreen} />
        <Stack.Screen
          name="NetworkingInterceptors"
          component={ComingSoonScreen}
        />
        <Stack.Screen name="NetworkingOffline" component={ComingSoonScreen} />
        <Stack.Screen name="NetworkingWebSocket" component={ComingSoonScreen} />
        <Stack.Screen name="NetworkingFirestore" component={ComingSoonScreen} />
        <Stack.Screen
          name="NetworkingRealtimeDB"
          component={ComingSoonScreen}
        />
        <Stack.Screen
          name="NetworkingRemoteConfig"
          component={RemoteConfigScreen}
        />
        <Stack.Screen
          name="NetworkingRemoteConfigSetup"
          component={RemoteConfigSetupScreen}
        />

        {/* System & Device */}
        <Stack.Screen name="System" component={SystemScreen} />
        <Stack.Screen name="SystemDeviceInfo" component={DeviceInfoScreen} />
        <Stack.Screen name="SystemNetwork" component={ComingSoonScreen} />
        <Stack.Screen name="SystemEnvironment" component={ComingSoonScreen} />
        <Stack.Screen name="SystemDarkMode" component={ComingSoonScreen} />
        <Stack.Screen name="SystemLocalization" component={ComingSoonScreen} />
        <Stack.Screen name="SystemAccessibility" component={ComingSoonScreen} />
        <Stack.Screen
          name="SystemPushNotifications"
          component={ComingSoonScreen}
        />
        <Stack.Screen name="SystemAnalytics" component={ComingSoonScreen} />
        <Stack.Screen name="SystemCrashlytics" component={ComingSoonScreen} />

        {/* Testing */}
        <Stack.Screen name="Testing" component={TestingScreen} />
        <Stack.Screen name="TestingUnit" component={ComingSoonScreen} />
        <Stack.Screen name="TestingComponent" component={ComingSoonScreen} />
        <Stack.Screen name="TestingE2E" component={ComingSoonScreen} />

        {/* Authentication */}
        <Stack.Screen name="Auth" component={ComingSoonScreen} />
        <Stack.Screen name="AuthEmail" component={ComingSoonScreen} />
        <Stack.Screen name="AuthGoogle" component={ComingSoonScreen} />
        <Stack.Screen name="AuthApple" component={ComingSoonScreen} />
        <Stack.Screen name="AuthPhoneOTP" component={ComingSoonScreen} />
        <Stack.Screen name="AuthAnonymous" component={ComingSoonScreen} />

        {/* Security */}
        <Stack.Screen name="Security" component={SecurityScreen} />
        <Stack.Screen name="SecurityAppMasking" component={AppMaskingScreen} />
        <Stack.Screen name="SecurityJailbreak" component={JailbreakScreen} />
        <Stack.Screen
          name="SecurityScreenshot"
          component={ScreenshotPreventionScreen}
        />
        <Stack.Screen
          name="SecurityCertPinning"
          component={CertificatePinningScreen}
        />
        <Stack.Screen
          name="SecurityObfuscation"
          component={ObfuscationScreen}
        />

        {/* Code Refactoring */}
        <Stack.Screen name="Refactoring" component={RefactoringScreen} />
        <Stack.Screen
          name="RefactoringFolderStructure"
          component={ComingSoonScreen}
        />
        <Stack.Screen
          name="RefactoringAtomicDesign"
          component={ComingSoonScreen}
        />
        <Stack.Screen
          name="RefactoringCustomHooks"
          component={ComingSoonScreen}
        />
        <Stack.Screen
          name="RefactoringServiceLayer"
          component={ComingSoonScreen}
        />
        <Stack.Screen
          name="RefactoringStateManagement"
          component={ComingSoonScreen}
        />
        <Stack.Screen
          name="RefactoringTypeSafety"
          component={ComingSoonScreen}
        />
        <Stack.Screen
          name="RefactoringPerformance"
          component={ComingSoonScreen}
        />
        <Stack.Screen
          name="RefactoringErrorBoundaries"
          component={ComingSoonScreen}
        />
        <Stack.Screen
          name="RefactoringCodeSplitting"
          component={ComingSoonScreen}
        />

        {/* Catch-all for unimplemented screens */}
        <Stack.Screen name="ComingSoon" component={ComingSoonScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
