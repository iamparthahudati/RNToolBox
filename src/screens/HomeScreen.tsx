import Icon from '@react-native-vector-icons/material-design-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { SafeAreaView } from 'react-native-safe-area-context';
import Badge from '../components/atoms/Badge';
import SectionHeader from '../components/molecules/SectionHeader';
import { RootStackParamList } from '../navigation/types';
import { useTheme } from '../theme';
import { MenuItem } from '../types/menu';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const MENU_ITEMS: MenuItem[] = [
  {
    title: 'UI Components',
    description: 'Buttons, inputs, selection, lists, images',
    screen: 'Components',
    implemented: true,
    icon: 'palette-outline',
  },
  {
    title: 'Native Actions',
    description: 'Call, email, maps, share, camera, haptics',
    screen: 'NativeActions',
    implemented: true,
    icon: 'cellphone',
  },
  {
    title: 'Permissions',
    description: 'Camera, location, microphone, contacts',
    screen: 'Permissions',
    implemented: true,
    icon: 'shield-check-outline',
  },
  {
    title: 'Hooks & Utilities',
    description: 'Custom hooks and helpers',
    screen: 'Hooks',
    implemented: true,
    icon: 'hook',
  },
  {
    title: 'System & Device',
    description: 'Device info, network, dark mode, localization',
    screen: 'System',
    implemented: true,
    icon: 'monitor-cellphone',
  },
  {
    title: 'Forms',
    description: 'Validation, React Hook Form, date picker, search',
    screen: 'Forms',
    implemented: false,
    icon: 'form-select',
  },
  {
    title: 'Animations',
    description: 'Animated API, Reanimated, gestures, Lottie',
    screen: 'Animations',
    implemented: false,
    icon: 'animation-play-outline',
  },
  {
    title: 'Navigation Patterns',
    description: 'Tabs, drawer, modal stack, deep linking, auth flow',
    screen: 'NavigationPatterns',
    implemented: false,
    icon: 'compass-outline',
  },
  {
    title: 'Storage',
    description: 'AsyncStorage, MMKV, secure storage, SQLite',
    screen: 'Storage',
    implemented: false,
    icon: 'database-outline',
  },
  {
    title: 'Security',
    description: 'App masking, jailbreak detection, certificate pinning',
    screen: 'Security',
    implemented: true,
    icon: 'shield-lock-outline',
  },
  {
    title: 'Authentication',
    description: 'Firebase Auth — email, Google, Apple sign-in',
    screen: 'Auth',
    implemented: false,
    icon: 'lock-outline',
  },
  {
    title: 'Networking',
    description: 'Fetch, Axios, interceptors, offline, WebSocket',
    screen: 'Networking',
    implemented: false,
    icon: 'wifi',
  },
  {
    title: 'Testing',
    description: 'Unit, component and E2E test patterns',
    screen: 'Testing',
    implemented: false,
    icon: 'test-tube',
  },
  {
    title: 'Code Refactoring',
    description: 'Folder structure, hooks, services, types, performance',
    screen: 'Refactoring',
    implemented: false,
    icon: 'wrench-outline',
  },
];

// ---------------------------------------------------------------------------
// Deep search index — every leaf item across all categories
// ---------------------------------------------------------------------------

interface SearchItem {
  title: string;
  description: string;
  screen: keyof RootStackParamList;
  icon: string;
  implemented: boolean;
  category: string;
  categoryIcon: string;
}

const SEARCH_INDEX: SearchItem[] = [
  // ── UI Components ──────────────────────────────────────────────────────────
  {
    category: 'UI Components',
    categoryIcon: 'palette-outline',
    title: 'Buttons',
    description: 'Primary, outline, loading, icon variants',
    screen: 'ComponentButtons',
    icon: 'gesture-tap-button',
    implemented: true,
  },
  {
    category: 'UI Components',
    categoryIcon: 'palette-outline',
    title: 'Inputs',
    description: 'Text fields, password, multiline',
    screen: 'ComponentInputs',
    icon: 'form-textbox',
    implemented: true,
  },
  {
    category: 'UI Components',
    categoryIcon: 'palette-outline',
    title: 'Selection Controls',
    description: 'Switch, checkbox, radio',
    screen: 'ComponentSelection',
    icon: 'checkbox-marked-outline',
    implemented: true,
  },
  {
    category: 'UI Components',
    categoryIcon: 'palette-outline',
    title: 'Typography',
    description: 'Font sizes, weights, line heights',
    screen: 'ComponentTypography',
    icon: 'format-text',
    implemented: true,
  },
  {
    category: 'UI Components',
    categoryIcon: 'palette-outline',
    title: 'Cards',
    description: 'Basic, image, action cards',
    screen: 'ComponentCards',
    icon: 'card-outline',
    implemented: false,
  },
  {
    category: 'UI Components',
    categoryIcon: 'palette-outline',
    title: 'Badges & Tags',
    description: 'Status indicators, labels',
    screen: 'ComponentBadges',
    icon: 'tag-outline',
    implemented: true,
  },
  {
    category: 'UI Components',
    categoryIcon: 'palette-outline',
    title: 'Modals & Alerts',
    description: 'Custom modal, bottom sheet, confirmation dialog',
    screen: 'ComponentModals',
    icon: 'alert-box-outline',
    implemented: false,
  },
  {
    category: 'UI Components',
    categoryIcon: 'palette-outline',
    title: 'Toast / Snackbar',
    description: 'Success, error, info notifications',
    screen: 'ComponentToast',
    icon: 'message-outline',
    implemented: false,
  },
  {
    category: 'UI Components',
    categoryIcon: 'palette-outline',
    title: 'Loading States',
    description: 'Skeleton screens, spinners, progress bars',
    screen: 'ComponentLoading',
    icon: 'loading',
    implemented: true,
  },
  {
    category: 'UI Components',
    categoryIcon: 'palette-outline',
    title: 'Lists',
    description: 'FlatList, SectionList, pull-to-refresh, infinite scroll',
    screen: 'ComponentLists',
    icon: 'format-list-bulleted',
    implemented: false,
  },
  {
    category: 'UI Components',
    categoryIcon: 'palette-outline',
    title: 'Images',
    description: 'Image, ImageBackground, lazy loading, placeholder',
    screen: 'ComponentImages',
    icon: 'image-outline',
    implemented: false,
  },
  {
    category: 'UI Components',
    categoryIcon: 'palette-outline',
    title: 'Icons',
    description: 'Vector icons showcase and usage patterns',
    screen: 'ComponentIcons',
    icon: 'emoticon-outline',
    implemented: false,
  },
  {
    category: 'UI Components',
    categoryIcon: 'palette-outline',
    title: 'Avatar',
    description: 'Image avatar, initials fallback, sizes',
    screen: 'ComponentAvatar',
    icon: 'account-circle-outline',
    implemented: false,
  },
  {
    category: 'UI Components',
    categoryIcon: 'palette-outline',
    title: 'Empty State',
    description: 'No data placeholder patterns',
    screen: 'ComponentEmptyState',
    icon: 'tray-remove',
    implemented: false,
  },

  // ── Forms ──────────────────────────────────────────────────────────────────
  {
    category: 'Forms',
    categoryIcon: 'form-select',
    title: 'Form Validation',
    description: 'Required fields, regex, real-time vs on-submit',
    screen: 'FormsValidation',
    icon: 'check-circle-outline',
    implemented: false,
  },
  {
    category: 'Forms',
    categoryIcon: 'form-select',
    title: 'React Hook Form',
    description: 'The standard RN form library',
    screen: 'FormsHookForm',
    icon: 'hook',
    implemented: false,
  },
  {
    category: 'Forms',
    categoryIcon: 'form-select',
    title: 'Date Picker',
    description: 'Native date and time picker',
    screen: 'FormsDatePicker',
    icon: 'calendar-outline',
    implemented: false,
  },
  {
    category: 'Forms',
    categoryIcon: 'form-select',
    title: 'Dropdown / Select',
    description: 'Picker and custom dropdown component',
    screen: 'FormsDropdown',
    icon: 'chevron-down-circle-outline',
    implemented: false,
  },
  {
    category: 'Forms',
    categoryIcon: 'form-select',
    title: 'Search Input',
    description: 'Debounced search with clear button',
    screen: 'FormsSearch',
    icon: 'magnify',
    implemented: false,
  },

  // ── Animations ─────────────────────────────────────────────────────────────
  {
    category: 'Animations',
    categoryIcon: 'animation-play-outline',
    title: 'Animated API',
    description: 'Fade, slide, scale basics with Animated',
    screen: 'AnimationsBasic',
    icon: 'play-circle-outline',
    implemented: false,
  },
  {
    category: 'Animations',
    categoryIcon: 'animation-play-outline',
    title: 'LayoutAnimation',
    description: 'Auto-animate layout changes',
    screen: 'AnimationsLayout',
    icon: 'view-grid-outline',
    implemented: false,
  },
  {
    category: 'Animations',
    categoryIcon: 'animation-play-outline',
    title: 'Reanimated',
    description: 'useSharedValue, useAnimatedStyle',
    screen: 'AnimationsReanimated',
    icon: 'lightning-bolt-outline',
    implemented: false,
  },
  {
    category: 'Animations',
    categoryIcon: 'animation-play-outline',
    title: 'Gesture Handler',
    description: 'Swipe, pan, pinch gestures',
    screen: 'AnimationsGesture',
    icon: 'gesture-swipe',
    implemented: false,
  },
  {
    category: 'Animations',
    categoryIcon: 'animation-play-outline',
    title: 'Lottie',
    description: 'JSON animation playback',
    screen: 'AnimationsLottie',
    icon: 'animation',
    implemented: false,
  },

  // ── Navigation Patterns ────────────────────────────────────────────────────
  {
    category: 'Navigation Patterns',
    categoryIcon: 'compass-outline',
    title: 'Tab Navigator',
    description: 'Bottom tab navigation pattern',
    screen: 'NavigationTabs',
    icon: 'tab',
    implemented: false,
  },
  {
    category: 'Navigation Patterns',
    categoryIcon: 'compass-outline',
    title: 'Drawer Navigator',
    description: 'Side menu drawer pattern',
    screen: 'NavigationDrawer',
    icon: 'menu',
    implemented: false,
  },
  {
    category: 'Navigation Patterns',
    categoryIcon: 'compass-outline',
    title: 'Modal Stack',
    description: 'Presenting screens as modals',
    screen: 'NavigationModal',
    icon: 'layers-outline',
    implemented: false,
  },
  {
    category: 'Navigation Patterns',
    categoryIcon: 'compass-outline',
    title: 'Deep Linking',
    description: 'URL scheme and universal link handling',
    screen: 'NavigationDeepLink',
    icon: 'link-variant',
    implemented: false,
  },
  {
    category: 'Navigation Patterns',
    categoryIcon: 'compass-outline',
    title: 'Auth Flow',
    description: 'Conditional stack for logged in vs logged out',
    screen: 'NavigationAuthFlow',
    icon: 'account-arrow-right-outline',
    implemented: false,
  },

  // ── Native Actions ─────────────────────────────────────────────────────────
  {
    category: 'Native Actions',
    categoryIcon: 'cellphone',
    title: 'Call Phone',
    description: 'Dial a number via native dialer',
    screen: 'NativeCallPhone',
    icon: 'phone-outline',
    implemented: true,
  },
  {
    category: 'Native Actions',
    categoryIcon: 'cellphone',
    title: 'Send Email',
    description: 'Open native email composer',
    screen: 'NativeSendEmail',
    icon: 'email-outline',
    implemented: true,
  },
  {
    category: 'Native Actions',
    categoryIcon: 'cellphone',
    title: 'Open Maps',
    description: 'Navigate to an address',
    screen: 'NativeMaps',
    icon: 'map-outline',
    implemented: true,
  },
  {
    category: 'Native Actions',
    categoryIcon: 'cellphone',
    title: 'OTP / Clipboard',
    description: 'Copy and paste from clipboard',
    screen: 'NativeClipboard',
    icon: 'clipboard-outline',
    implemented: true,
  },
  {
    category: 'Native Actions',
    categoryIcon: 'cellphone',
    title: 'Share',
    description: 'Native share sheet',
    screen: 'NativeShare',
    icon: 'share-variant-outline',
    implemented: true,
  },
  {
    category: 'Native Actions',
    categoryIcon: 'cellphone',
    title: 'Image Picker',
    description: 'Camera and gallery picker',
    screen: 'NativeImagePicker',
    icon: 'image-plus',
    implemented: false,
  },
  {
    category: 'Native Actions',
    categoryIcon: 'cellphone',
    title: 'File Picker',
    description: 'Document selection',
    screen: 'NativeFilePicker',
    icon: 'file-outline',
    implemented: false,
  },
  {
    category: 'Native Actions',
    categoryIcon: 'cellphone',
    title: 'Haptics',
    description: 'Vibration feedback patterns',
    screen: 'NativeHaptics',
    icon: 'vibrate',
    implemented: true,
  },
  {
    category: 'Native Actions',
    categoryIcon: 'cellphone',
    title: 'Biometrics',
    description: 'Face ID, Touch ID and fingerprint authentication',
    screen: 'NativeBiometrics',
    icon: 'fingerprint',
    implemented: true,
  },
  {
    category: 'Native Actions',
    categoryIcon: 'cellphone',
    title: 'Camera',
    description: 'Live camera preview and capture',
    screen: 'NativeCamera',
    icon: 'camera-outline',
    implemented: false,
  },
  {
    category: 'Native Actions',
    categoryIcon: 'cellphone',
    title: 'Barcode / QR Scanner',
    description: 'Scan barcodes and QR codes',
    screen: 'NativeBarcode',
    icon: 'qrcode-scan',
    implemented: false,
  },
  {
    category: 'Native Actions',
    categoryIcon: 'cellphone',
    title: 'FCM Push Notifications',
    description: 'Firebase Cloud Messaging token and notifications',
    screen: 'NativeFCMPushNotifications',
    icon: 'bell-outline',
    implemented: false,
  },
  {
    category: 'Native Actions',
    categoryIcon: 'cellphone',
    title: 'Background Tasks',
    description: 'Run tasks when app is in background',
    screen: 'NativeBackgroundTasks',
    icon: 'timer-sand',
    implemented: false,
  },

  // ── Maps ───────────────────────────────────────────────────────────────────
  {
    category: 'Maps',
    categoryIcon: 'map-outline',
    title: 'Open in Maps',
    description: 'Launch native maps app with an address',
    screen: 'NativeMapsOpen',
    icon: 'map-marker-outline',
    implemented: true,
  },
  {
    category: 'Maps',
    categoryIcon: 'map-outline',
    title: 'Basic Map',
    description: 'Embedded interactive map with zoom and pan',
    screen: 'NativeMapsBasic',
    icon: 'map-outline',
    implemented: true,
  },
  {
    category: 'Maps',
    categoryIcon: 'map-outline',
    title: 'My Location',
    description: 'Show current GPS position on the map',
    screen: 'NativeMapsLocation',
    icon: 'crosshairs-gps',
    implemented: true,
  },
  {
    category: 'Maps',
    categoryIcon: 'map-outline',
    title: 'Markers',
    description: 'Drop and customize pins on the map',
    screen: 'NativeMapsMarkers',
    icon: 'map-marker-multiple-outline',
    implemented: true,
  },
  {
    category: 'Maps',
    categoryIcon: 'map-outline',
    title: 'Directions',
    description: 'Draw a route polyline between two points',
    screen: 'NativeMapsDirections',
    icon: 'road-variant',
    implemented: true,
  },
  {
    category: 'Maps',
    categoryIcon: 'map-outline',
    title: 'Polygon',
    description: 'Draw filled shapes and overlays on the map',
    screen: 'NativeMapsPolygon',
    icon: 'vector-polygon',
    implemented: true,
  },
  {
    category: 'Maps',
    categoryIcon: 'map-outline',
    title: 'Geofence',
    description: 'Define a radius circle around a coordinate',
    screen: 'NativeMapsGeofence',
    icon: 'circle-outline',
    implemented: true,
  },
  {
    category: 'Maps',
    categoryIcon: 'map-outline',
    title: 'Draw Area',
    description: 'Tap to draw a polygon and measure area',
    screen: 'NativeMapsDrawArea',
    icon: 'draw',
    implemented: true,
  },
  {
    category: 'Maps',
    categoryIcon: 'map-outline',
    title: 'Animated Marker',
    description: 'Simulate a vehicle moving along a polyline route',
    screen: 'NativeMapsAnimatedMarker',
    icon: 'car-arrow-right',
    implemented: true,
  },
  {
    category: 'Maps',
    categoryIcon: 'map-outline',
    title: 'Custom Map Style',
    description: 'Apply dark, retro and minimal map themes',
    screen: 'NativeMapsCustomStyle',
    icon: 'palette-outline',
    implemented: true,
  },
  {
    category: 'Maps',
    categoryIcon: 'map-outline',
    title: 'Heatmap',
    description: 'Visualize data density with a heatmap overlay',
    screen: 'NativeMapsHeatmap',
    icon: 'fire',
    implemented: true,
  },
  {
    category: 'Maps',
    categoryIcon: 'map-outline',
    title: 'Cluster Markers',
    description: 'Group nearby pins into dynamic clusters',
    screen: 'NativeMapsCluster',
    icon: 'map-marker-multiple',
    implemented: true,
  },
  {
    category: 'Maps',
    categoryIcon: 'map-outline',
    title: 'Search Place',
    description: 'Search any address or place with autocomplete',
    screen: 'NativeMapsSearchPlace',
    icon: 'magnify',
    implemented: true,
  },

  // ── Permissions ────────────────────────────────────────────────────────────
  {
    category: 'Permissions',
    categoryIcon: 'shield-check-outline',
    title: 'Camera Permission',
    description: 'Camera access permission',
    screen: 'PermissionsCamera',
    icon: 'camera-outline',
    implemented: false,
  },
  {
    category: 'Permissions',
    categoryIcon: 'shield-check-outline',
    title: 'Location Permission',
    description: 'GPS and location access',
    screen: 'PermissionsLocation',
    icon: 'map-marker-outline',
    implemented: false,
  },
  {
    category: 'Permissions',
    categoryIcon: 'shield-check-outline',
    title: 'Notifications Permission',
    description: 'Push notification permission',
    screen: 'PermissionsNotifications',
    icon: 'bell-outline',
    implemented: false,
  },
  {
    category: 'Permissions',
    categoryIcon: 'shield-check-outline',
    title: 'Microphone Permission',
    description: 'Audio recording access',
    screen: 'PermissionsMicrophone',
    icon: 'microphone-outline',
    implemented: false,
  },
  {
    category: 'Permissions',
    categoryIcon: 'shield-check-outline',
    title: 'Contacts Permission',
    description: 'Address book access',
    screen: 'PermissionsContacts',
    icon: 'contacts-outline',
    implemented: false,
  },
  {
    category: 'Permissions',
    categoryIcon: 'shield-check-outline',
    title: 'Photo Library Permission',
    description: 'Photos and media access',
    screen: 'PermissionsPhotoLibrary',
    icon: 'image-multiple-outline',
    implemented: false,
  },
  {
    category: 'Permissions',
    categoryIcon: 'shield-check-outline',
    title: 'Bluetooth Permission',
    description: 'Bluetooth device access',
    screen: 'PermissionsBluetooth',
    icon: 'bluetooth',
    implemented: false,
  },

  // ── Hooks & Utilities ──────────────────────────────────────────────────────
  {
    category: 'Hooks & Utilities',
    categoryIcon: 'hook',
    title: 'useDebounce',
    description: 'Debounced value hook',
    screen: 'HooksDebounce',
    icon: 'timer-outline',
    implemented: false,
  },
  {
    category: 'Hooks & Utilities',
    categoryIcon: 'hook',
    title: 'useLocalStorage',
    description: 'AsyncStorage wrapper hook',
    screen: 'HooksLocalStorage',
    icon: 'harddisk',
    implemented: false,
  },
  {
    category: 'Hooks & Utilities',
    categoryIcon: 'hook',
    title: 'useNetworkStatus',
    description: 'Online and offline detection',
    screen: 'HooksNetworkStatus',
    icon: 'wifi',
    implemented: false,
  },
  {
    category: 'Hooks & Utilities',
    categoryIcon: 'hook',
    title: 'useAppState',
    description: 'Foreground and background detection',
    screen: 'HooksAppState',
    icon: 'cellphone-check',
    implemented: false,
  },
  {
    category: 'Hooks & Utilities',
    categoryIcon: 'hook',
    title: 'useKeyboard',
    description: 'Keyboard height and visibility',
    screen: 'HooksKeyboard',
    icon: 'keyboard-outline',
    implemented: false,
  },
  {
    category: 'Hooks & Utilities',
    categoryIcon: 'hook',
    title: 'useTimer',
    description: 'Countdown and stopwatch',
    screen: 'HooksTimer',
    icon: 'clock-outline',
    implemented: false,
  },

  // ── Storage ────────────────────────────────────────────────────────────────
  {
    category: 'Storage',
    categoryIcon: 'database-outline',
    title: 'AsyncStorage',
    description: 'Read, write and delete key-value pairs',
    screen: 'StorageAsyncStorage',
    icon: 'archive-outline',
    implemented: true,
  },
  {
    category: 'Storage',
    categoryIcon: 'database-outline',
    title: 'MMKV',
    description: 'Fast synchronous key-value storage',
    screen: 'StorageMMKV',
    icon: 'flash-outline',
    implemented: false,
  },
  {
    category: 'Storage',
    categoryIcon: 'database-outline',
    title: 'Secure Storage',
    description: 'Encrypted storage for sensitive data',
    screen: 'StorageSecure',
    icon: 'lock-outline',
    implemented: false,
  },
  {
    category: 'Storage',
    categoryIcon: 'database-outline',
    title: 'SQLite',
    description: 'Structured local relational data',
    screen: 'StorageSQLite',
    icon: 'table',
    implemented: false,
  },
  {
    category: 'Storage',
    categoryIcon: 'database-outline',
    title: 'Firebase Storage',
    description: 'Upload, download and manage files in Firebase Storage',
    screen: 'StorageFirebase',
    icon: 'firebase',
    implemented: false,
  },

  // ── Networking ─────────────────────────────────────────────────────────────
  {
    category: 'Networking',
    categoryIcon: 'wifi',
    title: 'Fetch API',
    description: 'GET, POST, headers and error handling',
    screen: 'NetworkingFetch',
    icon: 'cloud-download-outline',
    implemented: false,
  },
  {
    category: 'Networking',
    categoryIcon: 'wifi',
    title: 'Axios',
    description: 'Axios instance, requests and responses',
    screen: 'NetworkingAxios',
    icon: 'arrow-decision-outline',
    implemented: false,
  },
  {
    category: 'Networking',
    categoryIcon: 'wifi',
    title: 'Interceptors',
    description: 'Auth token injection and response handling',
    screen: 'NetworkingInterceptors',
    icon: 'transit-connection-variant',
    implemented: false,
  },
  {
    category: 'Networking',
    categoryIcon: 'wifi',
    title: 'Offline Detection',
    description: 'NetInfo and retry logic',
    screen: 'NetworkingOffline',
    icon: 'wifi-off',
    implemented: false,
  },
  {
    category: 'Networking',
    categoryIcon: 'wifi',
    title: 'WebSocket',
    description: 'Real-time connection demo',
    screen: 'NetworkingWebSocket',
    icon: 'connection',
    implemented: false,
  },
  {
    category: 'Networking',
    categoryIcon: 'wifi',
    title: 'Firestore',
    description: 'Cloud Firestore read, write, query and real-time updates',
    screen: 'NetworkingFirestore',
    icon: 'firebase',
    implemented: false,
  },
  {
    category: 'Networking',
    categoryIcon: 'wifi',
    title: 'Realtime Database',
    description: 'Firebase Realtime Database read, write and listeners',
    screen: 'NetworkingRealtimeDB',
    icon: 'database-sync-outline',
    implemented: false,
  },
  {
    category: 'Networking',
    categoryIcon: 'wifi',
    title: 'Remote Config',
    description: 'Fetch and activate Firebase Remote Config values',
    screen: 'NetworkingRemoteConfig',
    icon: 'tune-variant',
    implemented: true,
  },

  // ── System & Device ────────────────────────────────────────────────────────
  {
    category: 'System & Device',
    categoryIcon: 'monitor-cellphone',
    title: 'Device Info',
    description: 'Model, OS version, screen dimensions',
    screen: 'SystemDeviceInfo',
    icon: 'information-outline',
    implemented: true,
  },
  {
    category: 'System & Device',
    categoryIcon: 'monitor-cellphone',
    title: 'Push Notifications',
    description: 'Push notification setup and handling',
    screen: 'SystemPushNotifications',
    icon: 'bell-ring-outline',
    implemented: false,
  },
  {
    category: 'System & Device',
    categoryIcon: 'monitor-cellphone',
    title: 'Network Info',
    description: 'Connection type and IP address',
    screen: 'SystemNetwork',
    icon: 'network-outline',
    implemented: false,
  },
  {
    category: 'System & Device',
    categoryIcon: 'monitor-cellphone',
    title: 'Environment Config',
    description: 'Dev, staging and prod config',
    screen: 'SystemEnvironment',
    icon: 'cog-outline',
    implemented: false,
  },
  {
    category: 'System & Device',
    categoryIcon: 'monitor-cellphone',
    title: 'Dark Mode',
    description: 'useColorScheme and theme switching',
    screen: 'SystemDarkMode',
    icon: 'theme-light-dark',
    implemented: false,
  },
  {
    category: 'System & Device',
    categoryIcon: 'monitor-cellphone',
    title: 'Localization',
    description: 'i18n, translations and RTL support',
    screen: 'SystemLocalization',
    icon: 'translate',
    implemented: false,
  },
  {
    category: 'System & Device',
    categoryIcon: 'monitor-cellphone',
    title: 'Accessibility',
    description: 'accessibilityLabel, roles, screen reader',
    screen: 'SystemAccessibility',
    icon: 'human',
    implemented: false,
  },
  {
    category: 'System & Device',
    categoryIcon: 'monitor-cellphone',
    title: 'Analytics',
    description: 'Firebase Analytics event logging and screen tracking',
    screen: 'SystemAnalytics',
    icon: 'chart-line',
    implemented: false,
  },
  {
    category: 'System & Device',
    categoryIcon: 'monitor-cellphone',
    title: 'Crashlytics',
    description: 'Crash reporting and non-fatal error logging',
    screen: 'SystemCrashlytics',
    icon: 'bug-outline',
    implemented: false,
  },

  // ── Testing ────────────────────────────────────────────────────────────────
  {
    category: 'Testing',
    categoryIcon: 'test-tube',
    title: 'Unit Tests',
    description: 'Jest tests for services and hooks',
    screen: 'TestingUnit',
    icon: 'test-tube',
    implemented: false,
  },
  {
    category: 'Testing',
    categoryIcon: 'test-tube',
    title: 'Component Tests',
    description: 'React Native Testing Library patterns',
    screen: 'TestingComponent',
    icon: 'puzzle-outline',
    implemented: false,
  },
  {
    category: 'Testing',
    categoryIcon: 'test-tube',
    title: 'E2E Tests',
    description: 'Detox setup and example flows',
    screen: 'TestingE2E',
    icon: 'robot-outline',
    implemented: false,
  },

  // ── Authentication ─────────────────────────────────────────────────────────
  {
    category: 'Authentication',
    categoryIcon: 'lock-outline',
    title: 'Email Auth',
    description: 'Email and password authentication',
    screen: 'AuthEmail',
    icon: 'email-outline',
    implemented: true,
  },
  {
    category: 'Authentication',
    categoryIcon: 'lock-outline',
    title: 'Google Sign In',
    description: 'Sign in with Google account',
    screen: 'AuthGoogle',
    icon: 'google',
    implemented: true,
  },
  {
    category: 'Authentication',
    categoryIcon: 'lock-outline',
    title: 'Apple Sign In',
    description: 'Sign in with Apple ID',
    screen: 'AuthApple',
    icon: 'apple',
    implemented: true,
  },
  {
    category: 'Authentication',
    categoryIcon: 'lock-outline',
    title: 'Phone OTP',
    description: 'SMS OTP verification via Firebase Auth',
    screen: 'AuthPhoneOTP',
    icon: 'phone-message-outline',
    implemented: true,
  },
  {
    category: 'Authentication',
    categoryIcon: 'lock-outline',
    title: 'Anonymous',
    description: 'Anonymous sign-in session',
    screen: 'AuthAnonymous',
    icon: 'incognito',
    implemented: true,
  },

  // ── Security ───────────────────────────────────────────────────────────────
  {
    category: 'Security',
    categoryIcon: 'shield-lock-outline',
    title: 'App Masking',
    description: 'Hide sensitive content when app enters background',
    screen: 'SecurityAppMasking',
    icon: 'eye-off-outline',
    implemented: true,
  },
  {
    category: 'Security',
    categoryIcon: 'shield-lock-outline',
    title: 'Jailbreak & Root Detection',
    description: 'Detect compromised devices at runtime',
    screen: 'SecurityJailbreak',
    icon: 'shield-alert-outline',
    implemented: true,
  },
  {
    category: 'Security',
    categoryIcon: 'shield-lock-outline',
    title: 'Screenshot Prevention',
    description: 'Block screenshots and screen recordings',
    screen: 'SecurityScreenshot',
    icon: 'camera-off-outline',
    implemented: true,
  },
  {
    category: 'Security',
    categoryIcon: 'shield-lock-outline',
    title: 'Certificate Pinning',
    description: 'Prevent MITM attacks by pinning TLS certificates',
    screen: 'SecurityCertPinning',
    icon: 'certificate-outline',
    implemented: true,
  },
  {
    category: 'Security',
    categoryIcon: 'shield-lock-outline',
    title: 'Obfuscation & Debug Detection',
    description: 'Detect debuggers, emulators and reverse engineering attempts',
    screen: 'SecurityObfuscation',
    icon: 'bug-check-outline',
    implemented: true,
  },

  // ── Code Refactoring ───────────────────────────────────────────────────────
  {
    category: 'Code Refactoring',
    categoryIcon: 'wrench-outline',
    title: 'Folder Structure',
    description: 'Scalable directory layout, barrel exports, module boundaries',
    screen: 'RefactoringFolderStructure',
    icon: 'folder-outline',
    implemented: false,
  },
  {
    category: 'Code Refactoring',
    categoryIcon: 'wrench-outline',
    title: 'Atomic Design',
    description:
      'Atoms, molecules, organisms — splitting and composing components',
    screen: 'RefactoringAtomicDesign',
    icon: 'atom',
    implemented: false,
  },
  {
    category: 'Code Refactoring',
    categoryIcon: 'wrench-outline',
    title: 'Custom Hooks',
    description: 'Extract logic from components into reusable, testable hooks',
    screen: 'RefactoringCustomHooks',
    icon: 'hook',
    implemented: false,
  },
  {
    category: 'Code Refactoring',
    categoryIcon: 'wrench-outline',
    title: 'Service Layer',
    description: 'Isolate API calls, native bridges and side effects from UI',
    screen: 'RefactoringServiceLayer',
    icon: 'layers-outline',
    implemented: false,
  },
  {
    category: 'Code Refactoring',
    categoryIcon: 'wrench-outline',
    title: 'State Management',
    description: 'Context vs Zustand vs Redux — when and how to refactor',
    screen: 'RefactoringStateManagement',
    icon: 'database-cog-outline',
    implemented: false,
  },
  {
    category: 'Code Refactoring',
    categoryIcon: 'wrench-outline',
    title: 'Type Safety',
    description: 'Strict TypeScript, discriminated unions, eliminating any',
    screen: 'RefactoringTypeSafety',
    icon: 'shield-check-outline',
    implemented: false,
  },
  {
    category: 'Code Refactoring',
    categoryIcon: 'wrench-outline',
    title: 'Performance',
    description:
      'memo, useCallback, useMemo, FlatList optimizations, profiling',
    screen: 'RefactoringPerformance',
    icon: 'speedometer-outline',
    implemented: false,
  },
  {
    category: 'Code Refactoring',
    categoryIcon: 'wrench-outline',
    title: 'Error Boundaries',
    description: 'Graceful error handling, fallback UI, crash reporting hooks',
    screen: 'RefactoringErrorBoundaries',
    icon: 'alert-circle-outline',
    implemented: false,
  },
  {
    category: 'Code Refactoring',
    categoryIcon: 'wrench-outline',
    title: 'Code Splitting',
    description: 'Lazy screens, dynamic imports and bundle size reduction',
    screen: 'RefactoringCodeSplitting',
    icon: 'scissors-cutting',
    implemented: false,
  },
];

const IMPLEMENTED_COUNT = MENU_ITEMS.filter(i => i.implemented).length;
const TOTAL_COUNT = MENU_ITEMS.length;
const SEARCH_TOTAL = SEARCH_INDEX.length;

// ---------------------------------------------------------------------------
// GridCard
// ---------------------------------------------------------------------------

interface GridCardProps {
  item: MenuItem;
  onPress: () => void;
}

const GridCard = ({ item, onPress }: GridCardProps) => {
  const { colors, spacing, typography, shadows, isDark } = useTheme();
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 30,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 6,
    }).start();
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={{ flex: 1, marginVertical: spacing.sm }}
    >
      <Animated.View
        style={{
          transform: [{ scale }],
          flex: 1,
          padding: spacing.md,
          borderRadius: spacing.radii.lg,
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
          alignItems: 'center',
          minHeight: 140,
          justifyContent: 'space-between',
          ...shadows.sm,
        }}
      >
        {/* Icon circle */}
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: isDark ? colors.primary900 : colors.primary50,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: spacing.sm,
          }}
        >
          <Icon name={item.icon as any} size={24} color={colors.primary} />
        </View>

        {/* Title */}
        <Text
          style={{
            ...typography.presets.label,
            color: colors.textPrimary,
            marginTop: spacing.sm,
            textAlign: 'center',
          }}
          numberOfLines={2}
        >
          {item.title}
        </Text>

        {/* Description */}
        <Text
          style={{
            ...typography.presets.caption,
            color: colors.textSecondary,
            textAlign: 'center',
            marginTop: 2,
            flexGrow: 1,
          }}
          numberOfLines={2}
        >
          {item.description}
        </Text>

        {/* Status indicator */}
        <View style={{ marginTop: spacing.sm, alignItems: 'center' }}>
          {item.implemented ? (
            <View
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: colors.successMain,
              }}
            />
          ) : (
            <Badge label="Soon" variant="comingSoon" />
          )}
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

// ---------------------------------------------------------------------------
// SearchResultCard
// ---------------------------------------------------------------------------

interface SearchResultCardProps {
  item: SearchItem;
  query: string;
  onPress: () => void;
}

const SearchResultCard = ({ item, query, onPress }: SearchResultCardProps) => {
  const { colors, spacing, typography, isDark } = useTheme();
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () =>
    Animated.spring(scale, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 40,
      bounciness: 0,
    }).start();
  const handlePressOut = () =>
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 30,
      bounciness: 4,
    }).start();

  // Highlight matching text segments
  const highlight = (text: string) => {
    if (!query.trim()) return <Text>{text}</Text>;
    const lower = text.toLowerCase();
    const q = query.toLowerCase().trim();
    const idx = lower.indexOf(q);
    if (idx === -1)
      return <Text style={{ color: colors.textPrimary }}>{text}</Text>;
    return (
      <Text>
        <Text style={{ color: colors.textPrimary }}>{text.slice(0, idx)}</Text>
        <Text
          style={{
            color: colors.primary,
            fontWeight: '700',
            backgroundColor: isDark ? colors.primary900 : colors.primary50,
          }}
        >
          {text.slice(idx, idx + q.length)}
        </Text>
        <Text style={{ color: colors.textPrimary }}>
          {text.slice(idx + q.length)}
        </Text>
      </Text>
    );
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        style={[
          searchStyles.card,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            marginHorizontal: spacing.lg,
            marginBottom: spacing.sm,
            borderRadius: spacing.radii.lg,
            padding: spacing.md,
            transform: [{ scale }],
          },
        ]}
      >
        <View style={searchStyles.cardRow}>
          {/* Icon */}
          <View
            style={[
              searchStyles.iconWrap,
              {
                backgroundColor: isDark ? colors.primary900 : colors.primary50,
                borderRadius: spacing.radii.md,
                width: 40,
                height: 40,
                marginRight: spacing.md,
              },
            ]}
          >
            <Icon name={item.icon as any} size={20} color={colors.primary} />
          </View>

          {/* Text */}
          <View style={{ flex: 1 }}>
            <Text
              style={[typography.presets.label, { color: colors.textPrimary }]}
              numberOfLines={1}
            >
              {highlight(item.title)}
            </Text>
            <Text
              style={[
                typography.presets.caption,
                { color: colors.textSecondary, marginTop: 2 },
              ]}
              numberOfLines={2}
            >
              {highlight(item.description)}
            </Text>

            {/* Breadcrumb */}
            <View style={[searchStyles.breadcrumb, { marginTop: spacing.xs }]}>
              <Icon
                name={item.categoryIcon as any}
                size={11}
                color={colors.textTertiary}
              />
              <Text
                style={[
                  typography.presets.caption,
                  { color: colors.textTertiary, marginLeft: 3, fontSize: 11 },
                ]}
              >
                {item.category}
              </Text>
            </View>
          </View>

          {/* Status dot + chevron */}
          <View style={searchStyles.cardRight}>
            <View
              style={[
                searchStyles.dot,
                {
                  backgroundColor: item.implemented
                    ? colors.successMain
                    : colors.neutral300,
                },
              ]}
            />
            <Icon
              name="chevron-right"
              size={16}
              color={colors.textTertiary}
              style={{ marginTop: spacing.xs }}
            />
          </View>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const searchStyles = StyleSheet.create({
  card: {
    borderWidth: 1,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  breadcrumb: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardRight: {
    alignItems: 'center',
    marginLeft: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});

// ---------------------------------------------------------------------------
// HomeScreen
// ---------------------------------------------------------------------------

const HomeScreen = ({ navigation }: Props) => {
  const { colors, spacing, typography } = useTheme();
  const [query, setQuery] = useState('');

  const isSearching = query.trim().length > 0;
  const q = query.toLowerCase().trim();

  // Category grid — filter top-level items by title/description
  const filteredCategories = isSearching
    ? MENU_ITEMS.filter(
        item =>
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q),
      )
    : MENU_ITEMS;

  // Deep search — search across all leaf items
  const searchResults = isSearching
    ? SEARCH_INDEX.filter(
        item =>
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q),
      )
    : [];

  const handleItemPress = (item: MenuItem) => {
    navigation.navigate(item.screen as any, item.params as any);
  };

  const handleSearchResultPress = (item: SearchItem) => {
    navigation.navigate(item.screen as any);
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
      edges={['top', 'left', 'right']}
    >
      {/* ------------------------------------------------------------------ */}
      {/* HEADER                                                               */}
      {/* ------------------------------------------------------------------ */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.xl,
          paddingBottom: spacing.md,
        }}
      >
        <View style={{ flex: 1 }}>
          <Text
            style={{
              ...typography.presets.h1,
              color: colors.textPrimary,
            }}
          >
            RNToolBox
          </Text>
          <Text
            style={{
              ...typography.presets.bodySmall,
              color: colors.textSecondary,
              marginTop: 2,
            }}
          >
            React Native Developer Toolkit
          </Text>
        </View>
        <Badge label={`v${DeviceInfo.getVersion()}`} variant="pro" />
      </View>

      {/* ------------------------------------------------------------------ */}
      {/* SEARCH BAR                                                           */}
      {/* ------------------------------------------------------------------ */}
      <View
        style={{
          paddingHorizontal: spacing.lg,
          paddingBottom: spacing.md,
          paddingTop: spacing.sm,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.surface,
            borderRadius: spacing.radii.xl,
            borderWidth: 1,
            borderColor: colors.border,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm,
          }}
        >
          <Icon
            name={'magnify' as any}
            size={20}
            color={colors.textTertiary}
            style={{ marginRight: spacing.sm }}
          />
          <TextInput
            style={{
              flex: 1,
              ...typography.presets.body,
              color: colors.textPrimary,
              padding: 0,
              margin: 0,
            }}
            placeholder="Search features..."
            placeholderTextColor={colors.textTertiary}
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
            clearButtonMode="never"
            autoCorrect={false}
            autoCapitalize="none"
          />
          {query.length > 0 && (
            <TouchableOpacity
              onPress={() => setQuery('')}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Icon
                name={'close-circle' as any}
                size={18}
                color={colors.textTertiary}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* ------------------------------------------------------------------ */}
      {/* STATS ROW                                                            */}
      {/* ------------------------------------------------------------------ */}
      <View
        style={{
          paddingHorizontal: spacing.lg,
          paddingBottom: spacing.sm,
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            ...typography.presets.overline,
            color: colors.textTertiary,
            textAlign: 'center',
          }}
        >
          {isSearching
            ? `${searchResults.length} result${
                searchResults.length !== 1 ? 's' : ''
              } across ${SEARCH_TOTAL} features`
            : `${TOTAL_COUNT} Categories  \u2022  ${IMPLEMENTED_COUNT} Implemented  \u2022  ${SEARCH_TOTAL} Features`}
        </Text>
      </View>

      {/* ------------------------------------------------------------------ */}
      {/* SEARCH RESULTS (deep) or CATEGORY GRID                               */}
      {/* ------------------------------------------------------------------ */}
      {isSearching ? (
        <FlatList
          data={searchResults}
          keyExtractor={item => item.screen + item.title}
          ListHeaderComponent={
            <SectionHeader
              title={
                searchResults.length > 0
                  ? `Results for "${query.trim()}"`
                  : 'No results'
              }
            />
          }
          ListEmptyComponent={
            <View style={{ alignItems: 'center', paddingTop: spacing.xxl }}>
              <Icon
                name="magnify-close"
                size={40}
                color={colors.textTertiary}
              />
              <Text
                style={{
                  ...typography.presets.body,
                  color: colors.textSecondary,
                  marginTop: spacing.md,
                }}
              >
                No features match your search
              </Text>
              <Text
                style={{
                  ...typography.presets.caption,
                  color: colors.textTertiary,
                  marginTop: spacing.xs,
                }}
              >
                Try "fingerprint", "certificate", "SQLite"...
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <SearchResultCard
              item={item}
              query={query}
              onPress={() => handleSearchResultPress(item)}
            />
          )}
          contentContainerStyle={{
            paddingTop: spacing.xs,
            paddingBottom: spacing.xxl,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        />
      ) : (
        <FlatList
          data={filteredCategories}
          keyExtractor={item => item.screen}
          numColumns={2}
          ListHeaderComponent={<SectionHeader title="Categories" />}
          renderItem={({ item }) => (
            <GridCard item={item} onPress={() => handleItemPress(item)} />
          )}
          contentContainerStyle={{
            paddingHorizontal: spacing.md,
            paddingBottom: spacing.xxl,
          }}
          columnWrapperStyle={{
            gap: spacing.sm,
            paddingHorizontal: spacing.sm,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        />
      )}
    </SafeAreaView>
  );
};

export default HomeScreen;
