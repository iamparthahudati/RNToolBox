# RNToolBox

A React Native developer reference app built with TypeScript. It demonstrates real-world patterns for UI components, native device actions, permissions, system info, and more — all organized using an atomic design system.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Architecture](#architecture)
  - [Atomic Design](#atomic-design)
  - [Atoms](#atoms)
  - [Molecules](#molecules)
  - [Screens](#screens)
  - [Navigation](#navigation)
  - [Services](#services)
  - [Theme](#theme)
  - [Types](#types)
- [Feature Sections](#feature-sections)
  - [UI Components](#ui-components)
  - [Native Actions](#native-actions)
  - [Permissions](#permissions)
  - [Hooks & Utilities](#hooks--utilities)
  - [System & Device](#system--device)
  - [Forms](#forms)
  - [Animations](#animations)
  - [Navigation Patterns](#navigation-patterns)
  - [Storage](#storage)
  - [Networking](#networking)
  - [Testing](#testing)
- [Adding a New Screen](#adding-a-new-screen)
- [Adding a New Component](#adding-a-new-component)
- [Scripts](#scripts)

---

## Overview

RNToolBox is a living reference app — not a production app. Each section demonstrates a specific React Native capability with working, real code. Unimplemented sections show a "Coming Soon" placeholder so the navigation structure is always complete.

The app covers 11 major categories: UI Components, Native Actions, Permissions, Hooks & Utilities, System & Device, Forms, Animations, Navigation Patterns, Storage, Networking, and Testing.

---

## Tech Stack

| Package                             | Version | Purpose                    |
| ----------------------------------- | ------- | -------------------------- |
| `react-native`                      | 0.83.1  | Core framework             |
| `react`                             | 19.2.0  | UI library                 |
| `typescript`                        | ^5.8.3  | Type safety                |
| `@react-navigation/native`          | ^7.1.26 | Navigation container       |
| `@react-navigation/native-stack`    | ^7.9.0  | Stack navigator            |
| `react-native-paper`                | 5.15.0  | Material UI inputs         |
| `react-native-safe-area-context`    | ^5.6.2  | Safe area handling         |
| `react-native-screens`              | ^4.19.0 | Native screen optimization |
| `react-native-device-info`          | 15.0.2  | Device metadata            |
| `react-native-permissions`          | ^5.4.4  | Runtime permissions        |
| `@react-native-clipboard/clipboard` | ^1.16.3 | Clipboard read/write       |

---

## Project Structure

```
RNToolBox/
├── App.tsx                          # Root: SafeAreaProvider > PaperProvider > AppNavigator
├── src/
│   ├── components/
│   │   ├── index.ts                 # Barrel export for all atoms and molecules
│   │   ├── atoms/
│   │   │   ├── Badge/               # Status label (Coming Soon, success, error, warning)
│   │   │   ├── Button/              # Pressable button with variants, loading, debounce
│   │   │   ├── Chip/                # Selectable chip with optional sublabel
│   │   │   ├── Divider/             # Horizontal or vertical line separator
│   │   │   └── Header/              # Screen header with back navigation
│   │   └── molecules/
│   │       ├── Checkbox/            # Controlled and uncontrolled checkbox
│   │       ├── InfoRow/             # Label + value row for settings-style lists
│   │       ├── MenuCard/            # Tappable card with title, description, badge
│   │       ├── RadioGroup/          # Group of radio options
│   │       ├── ScreenLayout/        # Full-screen layout: Header + FlatList of MenuCards
│   │       └── SectionHeader/       # Uppercase section label bar
│   ├── navigation/
│   │   ├── AppNavigator.tsx         # All routes registered here
│   │   └── types.ts                 # RootStackParamList type
│   ├── screens/
│   │   ├── HomeScreen.tsx
│   │   ├── ComponentsScreen.tsx
│   │   ├── NativeActionsScreen.tsx
│   │   ├── PermissionsScreen.tsx
│   │   ├── HooksScreen.tsx
│   │   ├── SystemScreen.tsx
│   │   ├── FormsScreen.tsx
│   │   ├── AnimationsScreen.tsx
│   │   ├── NavigationPatternsScreen.tsx
│   │   ├── StorageScreen.tsx
│   │   ├── NetworkingScreen.tsx
│   │   ├── TestingScreen.tsx
│   │   ├── ComingSoonScreen.tsx
│   │   ├── components/
│   │   │   ├── ButtonsScreen.tsx
│   │   │   ├── InputsScreen.tsx
│   │   │   └── SelectionScreen.tsx
│   │   ├── native/
│   │   │   ├── CallPhoneScreen.tsx
│   │   │   ├── ClipboardScreen.tsx
│   │   │   ├── MapsScreen.tsx
│   │   │   ├── SendEmailScreen.tsx
│   │   │   ├── ShareScreen.tsx
│   │   │   └── maps/
│   │   │       ├── OpenInMapsScreen.tsx
│   │   │       ├── BasicMapScreen.tsx
│   │   │       ├── MyLocationScreen.tsx
│   │   │       ├── MarkersScreen.tsx
│   │   │       ├── DirectionsScreen.tsx
│   │   │       ├── PolygonScreen.tsx
│   │   │       └── GeofenceScreen.tsx
│   │   └── system/
│   │       └── DeviceInfoScreen.tsx
│   ├── services/
│   │   ├── phone.ts                 # callPhoneNumber()
│   │   ├── email.ts                 # sendEmail()
│   │   ├── maps.ts                  # openMaps()
│   │   ├── clipboard/
│   │   │   ├── clipboard.ts         # copyToClipboard(), getFromClipboard()
│   │   │   └── index.ts
│   │   └── permissions/
│   │       ├── permissions.ts       # checkPermission(), requestPermission(), openAppSettings()
│   │       └── index.ts
│   ├── theme/
│   │   ├── colors.ts
│   │   ├── spacing.ts
│   │   ├── typography.ts
│   │   └── index.ts                 # Exports: theme = { colors, spacing, typography }
│   ├── types/
│   │   └── menu.ts                  # Shared MenuItem type
│   └── utils/
│       └── helper.ts
```

---

## Getting Started

### Prerequisites

- Node.js >= 20
- Xcode (for iOS)
- Android Studio (for Android)
- CocoaPods (for iOS)

### Install

```bash
# Clone the repo
git clone <repo-url>
cd RNToolBox

# Install JS dependencies
yarn install

# Install iOS pods
npx pod-install
```

### Run

```bash
# iOS
yarn ios

# Android
yarn android

# Start Metro bundler with cache reset
yarn start
```

---

## Architecture

### Atomic Design

The component system follows atomic design principles with two layers:

```
Atoms      — smallest building blocks, no dependencies on other components
Molecules  — composed of atoms, represent a complete UI pattern
Screens    — composed of molecules and atoms, contain business logic
```

This keeps components focused, testable, and easy to reuse across screens.

---

### Atoms

Located in `src/components/atoms/`. Import from the barrel:

```ts
import { Button, Header, Badge, Chip, Divider } from '../components';
```

#### Button

```tsx
import Button from '../components/atoms/Button';

<Button title="Save" onPress={handleSave} />
<Button title="Cancel" variant="outline" onPress={handleCancel} />
<Button title="Delete" variant="secondary" loading={isDeleting} onPress={handleDelete} />
<Button title="Submit" disabled />
<Button title="Auto Width" fullWidth={false} onPress={handleSubmit} />
<Button
  title="With Icon"
  icon={<Icon name="check" />}
  iconPosition="left"
  onPress={handleSubmit}
/>
<Button title="Debounced" debounceMs={1000} onPress={handleSubmit} />
```

| Prop           | Type                                  | Default   | Description                     |
| -------------- | ------------------------------------- | --------- | ------------------------------- |
| `title`        | `string`                              | required  | Button label                    |
| `onPress`      | `function`                            | —         | Press handler                   |
| `variant`      | `primary` \| `secondary` \| `outline` | `primary` | Visual style                    |
| `loading`      | `boolean`                             | `false`   | Shows spinner, disables press   |
| `disabled`     | `boolean`                             | `false`   | Disables press, reduces opacity |
| `fullWidth`    | `boolean`                             | `true`    | Stretches to container width    |
| `icon`         | `ReactNode`                           | —         | Icon element to render          |
| `iconPosition` | `left` \| `right`                     | `left`    | Icon placement                  |
| `debounceMs`   | `number`                              | `0`       | Minimum ms between presses      |

---

#### Header

```tsx
import Header from '../components/atoms/Header';

<Header title="My Screen" />;
```

Automatically shows a back button with label when `navigation.canGoBack()` is true. Uses `useNavigation()` internally — no navigation prop needed.

| Prop    | Type     | Description                  |
| ------- | -------- | ---------------------------- |
| `title` | `string` | Text displayed in the center |

---

#### Badge

```tsx
import Badge from '../components/atoms/Badge';

<Badge label="Coming Soon" variant="comingSoon" />
<Badge label="Active" variant="success" />
<Badge label="Pending" variant="warning" />
<Badge label="Failed" variant="error" />
```

| Prop      | Type                                              | Default      | Description  |
| --------- | ------------------------------------------------- | ------------ | ------------ |
| `label`   | `string`                                          | required     | Badge text   |
| `variant` | `comingSoon` \| `success` \| `warning` \| `error` | `comingSoon` | Color scheme |

---

#### Chip

```tsx
import Chip from '../components/atoms/Chip';

<Chip label="Apple Support" sublabel="+1-800-275-2273" active={false} onPress={() => {}} />
<Chip label="Selected" active={true} onPress={() => {}} />
```

| Prop       | Type       | Default  | Description                      |
| ---------- | ---------- | -------- | -------------------------------- |
| `label`    | `string`   | required | Primary chip text                |
| `sublabel` | `string`   | —        | Secondary line below label       |
| `active`   | `boolean`  | `false`  | Highlights chip in primary color |
| `onPress`  | `function` | required | Press handler                    |

---

#### Divider

```tsx
import Divider from '../components/atoms/Divider';

<Divider />                      // horizontal (default)
<Divider horizontal={false} />   // vertical
```

| Prop         | Type      | Default | Description                   |
| ------------ | --------- | ------- | ----------------------------- |
| `horizontal` | `boolean` | `true`  | Direction of the divider line |

---

### Molecules

Located in `src/components/molecules/`. Import from the barrel:

```ts
import {
  MenuCard,
  ScreenLayout,
  SectionHeader,
  InfoRow,
  Checkbox,
  RadioGroup,
} from '../components';
```

---

#### MenuCard

A tappable card used in list screens. Automatically shows a `Badge` when `implemented` is false.

```tsx
import MenuCard from '../components/molecules/MenuCard';

<MenuCard
  title="Buttons"
  description="Primary, outline, loading, icon variants"
  implemented={true}
  onPress={() => navigation.navigate('ComponentButtons')}
/>;
```

| Prop          | Type       | Description                          |
| ------------- | ---------- | ------------------------------------ |
| `title`       | `string`   | Card heading                         |
| `description` | `string`   | Card subtext                         |
| `implemented` | `boolean`  | Shows "Coming Soon" badge when false |
| `onPress`     | `function` | Press handler                        |

---

#### ScreenLayout

Wraps an entire list screen — `SafeAreaView` + `Header` + `FlatList` of `MenuCard` items. Used by all top-level and section list screens.

```tsx
import ScreenLayout from '../components/molecules/ScreenLayout';
import { MenuItem } from '../types/menu';

const ITEMS: MenuItem[] = [
  {
    title: 'Buttons',
    description: '...',
    screen: 'ComponentButtons',
    implemented: true,
  },
  {
    title: 'Typography',
    description: '...',
    screen: 'ComingSoon',
    params: { title: 'Typography' },
    implemented: false,
  },
];

<ScreenLayout
  title="Components"
  items={ITEMS}
  onItemPress={item =>
    navigation.navigate(item.screen as any, item.params as any)
  }
/>;
```

| Prop          | Type                       | Description                  |
| ------------- | -------------------------- | ---------------------------- |
| `title`       | `string`                   | Passed to `Header`           |
| `items`       | `MenuItem[]`               | List of menu items to render |
| `onItemPress` | `(item: MenuItem) => void` | Called when a card is tapped |

---

#### SectionHeader

An uppercase label bar used to group rows in settings-style screens.

```tsx
import SectionHeader from '../components/molecules/SectionHeader';

<SectionHeader title="DEVICE" />;
```

| Prop    | Type     | Description                         |
| ------- | -------- | ----------------------------------- |
| `title` | `string` | Section label (displayed uppercase) |

---

#### InfoRow

A horizontal label + value row. Used in `DeviceInfoScreen`.

```tsx
import InfoRow from '../components/molecules/InfoRow';

<InfoRow label="Model" value="iPhone 15 Pro" />
<InfoRow label="OS Version" value="17.4" />
```

| Prop    | Type     | Description                          |
| ------- | -------- | ------------------------------------ |
| `label` | `string` | Left-side descriptor                 |
| `value` | `string` | Right-side value (truncated if long) |

---

#### Checkbox

Supports both uncontrolled (internal state) and controlled (external state) usage.

```tsx
import Checkbox from '../components/molecules/Checkbox';

// Uncontrolled
<Checkbox label="Accept Terms" />

// Controlled
<Checkbox label="Remember me" checked={rememberMe} onChange={setRememberMe} />
```

| Prop       | Type                         | Default  | Description              |
| ---------- | ---------------------------- | -------- | ------------------------ |
| `label`    | `string`                     | required | Checkbox label           |
| `checked`  | `boolean`                    | —        | Controlled checked state |
| `onChange` | `(checked: boolean) => void` | —        | Called on toggle         |

---

#### RadioGroup

Renders a list of radio options. Fully controlled.

```tsx
import RadioGroup from '../components/molecules/RadioGroup';

const OPTIONS = [
  { id: 'light', label: 'Light Mode' },
  { id: 'dark', label: 'Dark Mode' },
  { id: 'system', label: 'System Default' },
];

<RadioGroup
  options={OPTIONS}
  selected={selectedTheme}
  onSelect={setSelectedTheme}
/>;
```

| Prop       | Type                              | Description                     |
| ---------- | --------------------------------- | ------------------------------- |
| `options`  | `{ id: string; label: string }[]` | List of options                 |
| `selected` | `string`                          | Currently selected option id    |
| `onSelect` | `(id: string) => void`            | Called when an option is tapped |

---

### Screens

All screens live in `src/screens/`. They contain only data and navigation logic — no raw UI primitives. Layout and UI are delegated to molecules and atoms.

| Screen                     | Route                | Description                           |
| -------------------------- | -------------------- | ------------------------------------- |
| `HomeScreen`               | `Home`               | Root menu                             |
| `ComponentsScreen`         | `Components`         | UI component list                     |
| `ButtonsScreen`            | `ComponentButtons`   | Button variants demo                  |
| `InputsScreen`             | `ComponentInputs`    | Input field variants demo             |
| `SelectionScreen`          | `ComponentSelection` | Switch, Checkbox, Radio demo          |
| `NativeActionsScreen`      | `NativeActions`      | Native action list                    |
| `CallPhoneScreen`          | `NativeCallPhone`    | Phone dialer                          |
| `SendEmailScreen`          | `NativeSendEmail`    | Email composer                        |
| `MapsScreen`               | `NativeMaps`         | Maps sub-menu                         |
| `OpenInMapsScreen`         | `NativeMapsOpen`     | Open address in native maps           |
| `ClipboardScreen`          | `NativeClipboard`    | Clipboard copy/paste/OTP              |
| `ShareScreen`              | `NativeShare`        | Native share sheet                    |
| `PermissionsScreen`        | `Permissions`        | Permissions list                      |
| `HooksScreen`              | `Hooks`              | Hooks & utilities list                |
| `SystemScreen`             | `System`             | System & device list                  |
| `DeviceInfoScreen`         | `SystemDeviceInfo`   | Device metadata viewer                |
| `FormsScreen`              | `Forms`              | Forms section list                    |
| `AnimationsScreen`         | `Animations`         | Animations section list               |
| `NavigationPatternsScreen` | `NavigationPatterns` | Navigation patterns list              |
| `StorageScreen`            | `Storage`            | Storage section list                  |
| `NetworkingScreen`         | `Networking`         | Networking section list               |
| `TestingScreen`            | `Testing`            | Testing section list                  |
| `ComingSoonScreen`         | `ComingSoon`         | Placeholder for unimplemented screens |

---

### Navigation

All routes are registered in `src/navigation/AppNavigator.tsx` using `@react-navigation/native-stack`. The navigator is wrapped in `NavigationContainer` and all headers are hidden (`headerShown: false`) — each screen renders its own `Header` atom.

Route types are defined in `src/navigation/types.ts`:

```ts
export type RootStackParamList = {
  Home: undefined;
  ComingSoon: { title: string };
  Components: undefined;
  ComponentButtons: undefined;
  // ... all routes
};
```

To navigate to a screen:

```ts
navigation.navigate('ComponentButtons');
navigation.navigate('ComingSoon', { title: 'My Feature' });
```

---

### Services

Pure functions with no UI dependencies. Each service handles one native capability.

#### `services/phone.ts`

```ts
import { callPhoneNumber } from '../services/phone';

callPhoneNumber('+1-800-275-2273');
```

Builds a `tel:` URL, checks device support via `Linking.canOpenURL`, then opens the dialer.

---

#### `services/email.ts`

```ts
import { sendEmail } from '../services/email';

sendEmail({ to: 'hello@example.com', subject: 'Hi', body: 'Message body' });
```

Builds a `mailto:` URL with encoded subject and body, then opens the native email app.

---

#### `services/maps.ts`

```ts
import { openMaps } from '../services/maps';

openMaps('1 Infinite Loop, Cupertino, CA');
```

Uses `maps:` on iOS and `geo:` on Android. Falls back to Google Maps web URL if the native app is unavailable.

---

#### `services/clipboard/clipboard.ts`

```ts
import { copyToClipboard, getFromClipboard } from '../services/clipboard';

copyToClipboard('Hello world'); // Sets clipboard, shows Alert
const text = await getFromClipboard(); // Returns clipboard string
```

---

#### `services/permissions/permissions.ts`

```ts
import {
  checkPermission,
  requestPermission,
  openAppSettings,
} from '../services/permissions';

const status = await checkPermission('camera'); // 'granted' | 'denied' | 'blocked' | ...
const result = await requestPermission('location');
openAppSettings(); // Opens device settings for this app
```

Supported permission types: `camera`, `location`, `notification`.

Notification permission uses `PermissionsAndroid` on Android 13+. Camera and location use `react-native-permissions`.

---

### Theme

All design tokens are in `src/theme/`. Import the `theme` object anywhere:

```ts
import { theme } from '../theme';
```

#### Colors

| Token           | Value     | Usage                         |
| --------------- | --------- | ----------------------------- |
| `primary`       | `#2563EB` | Buttons, links, active states |
| `background`    | `#FFFFFF` | Screen backgrounds            |
| `surface`       | `#F9FAFB` | Cards, input backgrounds      |
| `border`        | `#E5E7EB` | Borders, dividers             |
| `textPrimary`   | `#111827` | Main text                     |
| `textSecondary` | `#6B7280` | Subtitles, labels             |
| `textDisabled`  | `#9CA3AF` | Disabled text                 |
| `success`       | `#16A34A` | Success states                |
| `warning`       | `#F59E0B` | Warning states                |
| `error`         | `#DC2626` | Error states                  |
| `white`         | `#FFFFFF` | —                             |
| `black`         | `#000000` | —                             |

#### Spacing

| Token | Value |
| ----- | ----- |
| `xs`  | 4     |
| `sm`  | 8     |
| `md`  | 12    |
| `lg`  | 16    |
| `xl`  | 24    |
| `xxl` | 32    |

#### Typography

| Token       | Value |
| ----------- | ----- |
| `sizes.xs`  | 12    |
| `sizes.sm`  | 14    |
| `sizes.md`  | 16    |
| `sizes.lg`  | 18    |
| `sizes.xl`  | 22    |
| `sizes.xxl` | 26    |

---

### Types

#### `src/types/menu.ts`

Shared type used by all list screens and `ScreenLayout`:

```ts
import { MenuItem } from '../types/menu';

type MenuItem = {
  title: string;
  description: string;
  screen: keyof RootStackParamList;
  params?: Record<string, any>;
  implemented: boolean;
};
```

---

## Feature Sections

### UI Components

| Screen             | Status      | What it shows                                                                                                                    |
| ------------------ | ----------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Buttons            | Done        | Primary, outline, secondary variants; loading, disabled, full/auto width, icon left/right, debounce                              |
| Inputs             | Done        | Outlined/flat modes, icons, email validation, password toggle, MFA PIN (SMS OTP), phone, numeric, multiline, disabled, read-only |
| Selection Controls | Done        | Switch (3 items), Checkbox (uncontrolled), Radio group                                                                           |
| Typography         | Coming Soon | Font sizes, weights, line heights, Text props                                                                                    |
| Cards              | Coming Soon | Basic, image, action cards                                                                                                       |
| Badges & Tags      | Coming Soon | Status indicators, labels                                                                                                        |
| Modals & Alerts    | Coming Soon | Custom modal, bottom sheet, confirmation dialog                                                                                  |
| Toast / Snackbar   | Coming Soon | Success, error, info notifications                                                                                               |
| Loading States     | Coming Soon | Skeleton screens, spinners, progress bars                                                                                        |
| Lists              | Coming Soon | FlatList, SectionList, pull-to-refresh, infinite scroll                                                                          |
| Images             | Coming Soon | Image, ImageBackground, lazy loading, placeholder                                                                                |
| Icons              | Coming Soon | Vector icons showcase and usage patterns                                                                                         |
| Avatar             | Coming Soon | Image avatar, initials fallback, sizes                                                                                           |
| Empty State        | Coming Soon | No data placeholder patterns                                                                                                     |

---

### Native Actions

| Screen               | Status      | What it shows                                                   |
| -------------------- | ----------- | --------------------------------------------------------------- |
| Call Phone           | Done        | Phone input, quick-dial chips, native dialer via `tel:`         |
| Send Email           | Done        | To/Subject/Body fields, native email app via `mailto:`          |
| Open Maps            | Done        | Address input, suggestion chips, native maps via `maps:`/`geo:` |
| OTP / Clipboard      | Done        | Copy text, paste from clipboard, SMS OTP auto-fill demo         |
| Share                | Done        | Message + URL fields, native share sheet via `Share` API        |
| Image Picker         | Coming Soon | Camera and gallery picker                                       |
| File Picker          | Coming Soon | Document selection                                              |
| Haptics              | Coming Soon | Vibration feedback patterns                                     |
| Biometrics           | Coming Soon | Face ID and fingerprint auth                                    |
| Camera               | Coming Soon | Live camera preview and capture                                 |
| Barcode / QR Scanner | Coming Soon | Scan barcodes and QR codes                                      |
| Push Notifications   | Coming Soon | Local and remote push notifications                             |
| Background Tasks     | Coming Soon | Run tasks when app is in background                             |

---

### Permissions

| Screen        | Status      | What it shows                                          |
| ------------- | ----------- | ------------------------------------------------------ |
| Camera        | Coming Soon | Camera access — check, request, open settings fallback |
| Location      | Coming Soon | Foreground vs background location access               |
| Notifications | Coming Soon | Push notification permission request                   |
| Microphone    | Coming Soon | Audio recording access                                 |
| Contacts      | Coming Soon | Address book access                                    |
| Photo Library | Coming Soon | Gallery and media access                               |
| Bluetooth     | Coming Soon | BLE device access                                      |

The service layer (`checkPermission`, `requestPermission`, `openAppSettings`) is fully implemented in `src/services/permissions/` and ready to use.

---

### Hooks & Utilities

| Hook             | Status      | What it shows                       |
| ---------------- | ----------- | ----------------------------------- |
| useDebounce      | Coming Soon | Debounced value hook                |
| useLocalStorage  | Coming Soon | AsyncStorage wrapper hook           |
| useNetworkStatus | Coming Soon | Online and offline detection        |
| useAppState      | Coming Soon | Foreground and background detection |
| useKeyboard      | Coming Soon | Keyboard height and visibility      |
| useTimer         | Coming Soon | Countdown and stopwatch             |

---

### System & Device

| Screen             | Status      | What it shows                                                                           |
| ------------------ | ----------- | --------------------------------------------------------------------------------------- |
| Device Info        | Done        | Device name, brand, model, OS, app version, screen size, memory, battery, emulator flag |
| Push Notifications | Coming Soon | Push notification setup and handling                                                    |
| Network Info       | Coming Soon | Connection type and IP address                                                          |
| Environment Config | Coming Soon | Dev, staging and prod config via react-native-config                                    |
| Dark Mode          | Coming Soon | useColorScheme and theme switching                                                      |
| Localization       | Coming Soon | i18n, translations and RTL support                                                      |
| Accessibility      | Coming Soon | accessibilityLabel, roles, screen reader testing                                        |

---

### Forms

| Screen            | Status      | What it shows                                  |
| ----------------- | ----------- | ---------------------------------------------- |
| Form Validation   | Coming Soon | Required fields, regex, real-time vs on-submit |
| React Hook Form   | Coming Soon | The standard RN form library                   |
| Date Picker       | Coming Soon | Native date and time picker                    |
| Dropdown / Select | Coming Soon | Picker and custom dropdown component           |
| Search Input      | Coming Soon | Debounced search with clear button             |

---

### Animations

| Screen          | Status      | What it shows                           |
| --------------- | ----------- | --------------------------------------- |
| Animated API    | Coming Soon | Fade, slide, scale basics with Animated |
| LayoutAnimation | Coming Soon | Auto-animate layout changes             |
| Reanimated      | Coming Soon | useSharedValue, useAnimatedStyle        |
| Gesture Handler | Coming Soon | Swipe, pan, pinch gestures              |
| Lottie          | Coming Soon | JSON animation playback                 |

---

### Navigation Patterns

| Screen           | Status      | What it shows                                 |
| ---------------- | ----------- | --------------------------------------------- |
| Tab Navigator    | Coming Soon | Bottom tab navigation pattern                 |
| Drawer Navigator | Coming Soon | Side menu drawer pattern                      |
| Modal Stack      | Coming Soon | Presenting screens as modals                  |
| Deep Linking     | Coming Soon | URL scheme and universal link handling        |
| Auth Flow        | Coming Soon | Conditional stack for logged in vs logged out |

---

### Storage

| Screen         | Status      | What it shows                          |
| -------------- | ----------- | -------------------------------------- |
| AsyncStorage   | Coming Soon | Read, write and delete key-value pairs |
| MMKV           | Coming Soon | Fast synchronous key-value storage     |
| Secure Storage | Coming Soon | Encrypted storage for sensitive data   |
| SQLite         | Coming Soon | Structured local relational data       |

---

### Networking

| Screen            | Status      | What it shows                              |
| ----------------- | ----------- | ------------------------------------------ |
| Fetch API         | Coming Soon | GET, POST, headers and error handling      |
| Axios             | Coming Soon | Axios instance, requests and responses     |
| Interceptors      | Coming Soon | Auth token injection and response handling |
| Offline Detection | Coming Soon | NetInfo and retry logic                    |
| WebSocket         | Coming Soon | Real-time connection demo                  |

---

### Testing

| Screen          | Status      | What it shows                         |
| --------------- | ----------- | ------------------------------------- |
| Unit Tests      | Coming Soon | Jest tests for services and hooks     |
| Component Tests | Coming Soon | React Native Testing Library patterns |
| E2E Tests       | Coming Soon | Detox setup and example flows         |

---

## Adding a New Screen

### 1. Add the route to `src/navigation/types.ts`

```ts
export type RootStackParamList = {
  // ...existing routes
  MyNewScreen: undefined;
};
```

### 2. Create the screen file

```tsx
// src/screens/MyNewScreen.tsx
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import Header from '../components/atoms/Header';
import { RootStackParamList } from '../navigation/types';
import { theme } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'MyNewScreen'>;

const MyNewScreen = ({}: Props) => (
  <SafeAreaView style={styles.root}>
    <Header title="My New Screen" />
    {/* content here */}
  </SafeAreaView>
);

export default MyNewScreen;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.background },
});
```

### 3. Register the screen in `src/navigation/AppNavigator.tsx`

```tsx
import MyNewScreen from '../screens/MyNewScreen';

<Stack.Screen name="MyNewScreen" component={MyNewScreen} />;
```

### 4. Add it to a menu list

In the relevant parent screen (e.g. `ComponentsScreen.tsx`), add an entry to the `ITEMS` array:

```ts
{
  title: 'My Feature',
  description: 'What this screen demonstrates',
  screen: 'MyNewScreen',
  implemented: true,
},
```

---

## Adding a New Component

### Atom (no dependencies on other components)

```
src/components/atoms/MyAtom/
├── MyAtom.tsx
└── index.ts
```

```tsx
// MyAtom.tsx
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { theme } from '../../../theme';

type MyAtomProps = {
  // props
};

const MyAtom = ({}: MyAtomProps) => <View style={styles.container} />;

export default MyAtom;

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
  },
});
```

```ts
// index.ts
export { default } from './MyAtom';
```

Then add to `src/components/index.ts`:

```ts
export { default as MyAtom } from './atoms/MyAtom';
```

### Molecule (composed of atoms)

Same folder structure under `src/components/molecules/MyMolecule/`. Import atoms using relative paths:

```tsx
import Badge from '../../atoms/Badge';
import Header from '../../atoms/Header';
```

Then add to `src/components/index.ts`:

```ts
export { default as MyMolecule } from './molecules/MyMolecule';
```

---

## Scripts

| Command              | Description                                               |
| -------------------- | --------------------------------------------------------- |
| `yarn start`         | Start Metro bundler (with cache reset)                    |
| `yarn ios`           | Build and run on iOS simulator                            |
| `yarn android`       | Build and run on Android emulator                         |
| `yarn test`          | Run Jest tests                                            |
| `yarn lint`          | Run ESLint                                                |
| `yarn pods`          | Install CocoaPods                                         |
| `yarn xcode`         | Open project in Xcode                                     |
| `yarn android:clean` | Clean Android build artifacts                             |
| `yarn deepclean`     | Full clean: node_modules, pods, build folders, lock files |
