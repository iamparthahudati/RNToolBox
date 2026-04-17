# RNToolBox

> Every React Native pattern. Running on your device. Right now.

RNToolBox is an open-source developer companion app for React Native engineers. It is not a documentation site. It is not an AI-generated snippet. It is a **living, interactive app** — every pattern runs on real hardware, with real APIs, real permissions, real native behaviour.

When you want to know how biometrics feel on a physical device, how a map gesture draw works with your finger, how Face ID prompts look in context, or how a skeleton shimmer animates — you open RNToolBox. No simulator. No guessing. No copy-pasting from Stack Overflow and hoping for the best.

---

## Why This Exists

AI can generate React Native code in seconds. What AI cannot do:

- Run Face ID on your device right now
- Show you how haptic feedback actually feels
- Demonstrate a map gesture draw with your finger
- Prove that a permission flow handles the "blocked" state correctly
- Show you the exact gap between what the code says and what the device does

**RNToolBox closes that gap.** It is the proof layer between reading about a pattern and shipping it with confidence.

---

## Current State

| Category                 | Screens Done | Total Screens |
| ------------------------ | ------------ | ------------- |
| UI Components            | 6            | 14            |
| Native Actions           | 7            | 13            |
| Google Maps              | 15           | 15            |
| Permissions              | 0            | 7             |
| Hooks & Utilities        | 0            | 6             |
| System & Device          | 2            | 9             |
| Forms                    | 0            | 5             |
| Animations               | 0            | 5             |
| Navigation Patterns      | 0            | 5             |
| Storage                  | 1            | 5             |
| Security                 | 5            | 5             |
| Authentication           | 5            | 5             |
| Networking               | 1            | 8             |
| Testing                  | 0            | 3             |
| Code Refactoring         | 0            | 9             |
| Accessibility (WCAG 2.2) | 1            | 1             |
| **Total**                | **43**       | **115**       |

---

## Tech Stack

| Package                                            | Version  | Purpose                          |
| -------------------------------------------------- | -------- | -------------------------------- |
| `react-native`                                     | 0.83.1   | Core framework                   |
| `react`                                            | 19.2.0   | UI library                       |
| `typescript`                                       | ^5.8.3   | Type safety                      |
| `@react-navigation/native`                         | ^7.1.26  | Navigation container             |
| `@react-navigation/native-stack`                   | ^7.9.0   | Stack navigator                  |
| `react-native-paper`                               | 5.15.0   | Material UI inputs               |
| `react-native-safe-area-context`                   | ^5.6.2   | Safe area handling               |
| `react-native-screens`                             | ^4.19.0  | Native screen optimization       |
| `react-native-device-info`                         | 15.0.2   | Device metadata                  |
| `react-native-permissions`                         | ^5.4.4   | Runtime permissions              |
| `react-native-maps`                                | ^1.27.2  | Google Maps integration          |
| `react-native-config`                              | 1.6.0    | Environment variable management  |
| `@react-native-firebase/app`                       | ^21.14.0 | Firebase core                    |
| `@react-native-firebase/auth`                      | 21.14.0  | Firebase Authentication          |
| `@react-native-firebase/remote-config`             | 21.14.0  | Firebase Remote Config           |
| `@react-native-google-signin/google-signin`        | 16.1.2   | Google OAuth                     |
| `@invertase/react-native-apple-authentication`     | 2.5.1    | Apple Sign-In                    |
| `@sbaiahmed1/react-native-biometrics`              | ^0.11.0  | Face ID / Touch ID / Fingerprint |
| `@react-native-async-storage/async-storage`        | 3.0.2    | Key-value storage                |
| `@react-native-clipboard/clipboard`                | ^1.16.3  | Clipboard read/write             |
| `react-native-google-places-autocomplete`          | ^2.6.4   | Places search                    |
| `@react-native-vector-icons/material-design-icons` | 12.5.0   | Icon set                         |

---

## Getting Started

### Prerequisites

- Node.js >= 20
- Xcode (for iOS)
- Android Studio (for Android)
- CocoaPods (for iOS)

### Environment Setup

```bash
# Clone the repo
git clone https://github.com/iamparthahudati/RNToolBox.git
cd RNToolBox

# Copy the example env file and fill in your keys
cp .env.debug.example .env.debug
```

Open `.env.debug` and fill in:

| Key                    | Where to get it                                            |
| ---------------------- | ---------------------------------------------------------- |
| `MAPS_API_KEY`         | Google Cloud Console — Maps SDK for Android                |
| `MAPS_API_KEY_IOS`     | Google Cloud Console — Maps SDK for iOS                    |
| `GOOGLE_WEB_CLIENT_ID` | Firebase Console → Authentication → Google → Web Client ID |
| `SENTRY_DSN`           | sentry.io → Project Settings → DSN                         |

### Install and Run

```bash
# Install JS dependencies
yarn install

# Install iOS pods
npx pod-install

# iOS (debug)
yarn ios:debug

# Android (debug)
yarn android:debug
```

---

## Project Structure

```
RNToolBox/
├── App.tsx                              # Root: SafeAreaProvider > PaperProvider > AppNavigator
├── .env.debug                           # Local debug environment (gitignored)
├── .env.debug.example                   # Template — copy to .env.debug
├── .env.production                      # Production environment
├── scripts/
│   └── wcag-audit/                      # WCAG 2.2 automated AST + contrast checker
│       ├── index.ts
│       ├── ast-checker.ts
│       ├── color-checker.ts
│       ├── reporter.ts
│       ├── rules.ts
│       └── types.ts
└── src/
    ├── components/
    │   ├── atoms/
    │   │   ├── Badge/                   # Status label (success, warning, error, comingSoon)
    │   │   ├── Button/                  # Pressable with variants, loading, debounce, icon
    │   │   ├── Chip/                    # Selectable chip with optional sublabel
    │   │   ├── Divider/                 # Horizontal or vertical separator
    │   │   └── Header/                  # Screen header with auto back navigation
    │   └── molecules/
    │       ├── Checkbox/                # Controlled and uncontrolled checkbox
    │       ├── InfoRow/                 # Label + value row for settings-style lists
    │       ├── MenuCard/                # Tappable card with title, description, badge
    │       ├── RadioGroup/              # Group of radio options
    │       ├── ScreenLayout/            # Full-screen layout: Header + FlatList of MenuCards
    │       └── SectionHeader/           # Uppercase section label bar
    ├── config/
    │   ├── env.ts                       # Typed env parsing + validation (validateConfig, parseConfig)
    │   └── index.ts                     # Barrel export
    ├── navigation/
    │   ├── AppNavigator.tsx             # All 100+ routes registered here
    │   └── types.ts                     # RootStackParamList — full type safety
    ├── screens/
    │   ├── HomeScreen.tsx               # Animated 2-column grid + deep search across all screens
    │   ├── ComingSoonScreen.tsx         # Fallback for unimplemented screens
    │   ├── auth/                        # Email, Google, Apple, Phone OTP, Anonymous
    │   ├── components/                  # Buttons, Inputs, Selection, Typography, Badges, Loading
    │   ├── native/
    │   │   ├── BiometricsScreen.tsx     # Full biometrics reference (FaceID, TouchID, keys, signing)
    │   │   ├── MapsScreen.tsx           # Maps sub-menu (15 screens)
    │   │   └── maps/                   # All 15 Google Maps screens
    │   ├── networking/                  # Remote Config (live) + setup guide
    │   ├── security/                    # App Masking, Jailbreak, Screenshot, Pinning, Obfuscation
    │   ├── storage/                     # AsyncStorage CRUD demo
    │   └── system/                      # Device Info, WCAG 2.2 Accessibility
    ├── services/
    │   ├── asyncStorage/                # AsyncStorage service layer
    │   ├── auth/                        # Firebase Auth service layer
    │   ├── clipboard/                   # Copy / paste service
    │   ├── firebase/                    # Firebase app init
    │   ├── permissions/                 # checkPermission, requestPermission, openAppSettings
    │   ├── remoteConfig/                # Firebase Remote Config service
    │   ├── email.ts                     # sendEmail() via mailto:
    │   ├── maps.ts                      # openMaps() via maps:/geo:
    │   └── phone.ts                     # callPhoneNumber() via tel:
    ├── theme/
    │   ├── colors.ts                    # Full color palette + semantic tokens (light/dark)
    │   ├── spacing.ts                   # Spacing scale + border radii
    │   ├── typography.ts                # Font families, sizes, weights, presets
    │   └── index.ts
    ├── types/
    │   └── menu.ts                      # MenuItem type used by all list screens
    └── utils/
        └── helper.ts
```

---

## Architecture

### Atomic Design

```
Atoms      — smallest building blocks, no dependencies on other components
Molecules  — composed of atoms, represent a complete UI pattern
Screens    — composed of molecules and atoms, contain business logic
Services   — pure functions, no UI dependencies, one capability each
```

### Screen Pattern

Every screen follows the same structure:

```tsx
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Header from '../components/atoms/Header';
import { RootStackParamList } from '../navigation/types';
import { theme } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'MyScreen'>;

const MyScreen = ({}: Props) => (
  <SafeAreaView style={styles.root}>
    <Header title="My Screen" />
    <ScrollView contentContainerStyle={styles.content}>
      {/* content */}
    </ScrollView>
  </SafeAreaView>
);

export default MyScreen;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: theme.spacing.lg },
});
```

### Environment Config

All environment variables are validated at startup via `src/config/env.ts`. If any required key is missing the app throws a descriptive error before rendering anything.

```ts
import appConfig from '../config';

appConfig.MAPS_API_KEY; // string
appConfig.ENABLE_LOGS; // boolean
appConfig.API_TIMEOUT; // number
appConfig.APP_ENV; // 'debug' | 'production'
```

---

## Scripts

| Command                | Description                                               |
| ---------------------- | --------------------------------------------------------- |
| `yarn start`           | Start Metro bundler with cache reset                      |
| `yarn ios:debug`       | Build and run iOS in debug mode                           |
| `yarn ios:release`     | Build and run iOS in release mode                         |
| `yarn android:debug`   | Build and run Android in debug mode                       |
| `yarn android:release` | Build and run Android in release mode                     |
| `yarn test`            | Run Jest tests                                            |
| `yarn lint`            | Run ESLint                                                |
| `yarn pods`            | Install CocoaPods                                         |
| `yarn xcode`           | Open project in Xcode                                     |
| `yarn android:clean`   | Clean Android build artifacts                             |
| `yarn deepclean`       | Full clean: node_modules, pods, build folders, lock files |
| `yarn wcag:audit`      | Run WCAG 2.2 automated AST + contrast audit               |
| `yarn wcag:audit:json` | Same audit with JSON output                               |

---

## Adding a New Screen

### 1. Register the route type

```ts
// src/navigation/types.ts
export type RootStackParamList = {
  MyNewScreen: undefined;
  // ...
};
```

### 2. Create the screen

```tsx
// src/screens/MyNewScreen.tsx
import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Header from '../components/atoms/Header';
import { RootStackParamList } from '../navigation/types';
import { theme } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'MyNewScreen'>;

const MyNewScreen = ({}: Props) => (
  <SafeAreaView style={styles.root}>
    <Header title="My New Screen" />
  </SafeAreaView>
);

export default MyNewScreen;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.background },
});
```

### 3. Register in the navigator

```tsx
// src/navigation/AppNavigator.tsx
import MyNewScreen from '../screens/MyNewScreen';

<Stack.Screen name="MyNewScreen" component={MyNewScreen} />;
```

### 4. Add to a menu list

```ts
// e.g. src/screens/ComponentsScreen.tsx
{
  title: 'My Feature',
  description: 'What this screen demonstrates',
  screen: 'MyNewScreen',
  implemented: true,
}
```

---

## Adding a New Component

### Atom

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

type Props = {
  /* props */
};

const MyAtom = ({}: Props) => <View style={styles.root} />;

export default MyAtom;

const styles = StyleSheet.create({
  root: { backgroundColor: theme.colors.surface },
});
```

```ts
// index.ts
export { default } from './MyAtom';
```

Then export from the barrel:

```ts
// src/components/index.ts
export { default as MyAtom } from './atoms/MyAtom';
```

### Molecule

Same structure under `src/components/molecules/MyMolecule/`. Import atoms via relative paths:

```tsx
import Badge from '../../atoms/Badge';
import Button from '../../atoms/Button';
```

---

# Roadmap

> This roadmap is the north star for RNToolBox. The goal is to become the most complete, most trusted, most interactive React Native reference that exists — not as documentation, but as a running app on your device.

---

## Phase 1 — Complete the Foundation

**Goal: Zero placeholder screens. Every category fully implemented.**

### UI Components (8 remaining)

| Screen           | What it will demonstrate                                                 |
| ---------------- | ------------------------------------------------------------------------ |
| Cards            | Basic card, image card, action card, horizontal card, list card          |
| Modals & Alerts  | Custom modal, bottom sheet, confirmation dialog, full-screen modal       |
| Toast / Snackbar | Success, error, info, warning — auto-dismiss, action button, queue       |
| Lists            | FlatList, SectionList, pull-to-refresh, infinite scroll, swipe-to-delete |
| Images           | Image, ImageBackground, lazy loading, blur placeholder, error fallback   |
| Icons            | Full Material Design icon showcase, sizing, coloring, usage patterns     |
| Avatar           | Image avatar, initials fallback, size variants, online indicator         |
| Empty State      | No data, no connection, no results, error state — with action buttons    |

### Native Actions (6 remaining)

| Screen                   | What it will demonstrate                                        |
| ------------------------ | --------------------------------------------------------------- |
| Image Picker             | Camera roll + camera capture, multi-select, crop, compression   |
| File Picker              | Document selection, file type filtering, size display           |
| Camera                   | Live preview, capture photo, flash toggle, front/back switch    |
| Barcode / QR Scanner     | Scan barcodes and QR codes, parse result types, torch toggle    |
| Push Notifications (FCM) | Local notifications, remote push via FCM, notification channels |
| Background Tasks         | Headless JS, background fetch, task scheduling                  |

### Permissions (7 remaining)

| Screen        | What it will demonstrate                                         |
| ------------- | ---------------------------------------------------------------- |
| Camera        | Check, request, blocked fallback with settings deep-link         |
| Location      | Foreground vs background, always vs when-in-use, accuracy levels |
| Notifications | iOS/Android permission request, provisional (iOS), channel setup |
| Microphone    | Audio recording access, check before record                      |
| Contacts      | Address book access, read contacts list on grant                 |
| Photo Library | Gallery access, limited selection (iOS 14+)                      |
| Bluetooth     | BLE scan permission, Android 12+ granular permissions            |

### Hooks & Utilities (6 remaining)

| Hook               | What it will demonstrate                                       |
| ------------------ | -------------------------------------------------------------- |
| `useDebounce`      | Debounced value with configurable delay, live search example   |
| `useLocalStorage`  | AsyncStorage wrapper with JSON serialization, typed get/set    |
| `useNetworkStatus` | Online/offline detection, connection type, NetInfo integration |
| `useAppState`      | Foreground/background/inactive transitions, use cases          |
| `useKeyboard`      | Keyboard height, visibility, avoid-keyboard patterns           |
| `useTimer`         | Countdown timer, stopwatch, lap tracking, pause/resume         |

### System & Device (7 remaining)

| Screen             | What it will demonstrate                                           |
| ------------------ | ------------------------------------------------------------------ |
| Push Notifications | FCM token, notification payload, foreground/background handling    |
| Network Info       | Connection type, IP address, WiFi SSID, speed test                 |
| Environment Config | Live display of all env vars per build, config validation          |
| Dark Mode          | `useColorScheme`, manual override, system sync, theme switching    |
| Localization       | i18n setup, language switching, RTL layout, date/number formatting |
| Analytics          | Firebase Analytics event logging, user properties, screen tracking |
| Crashlytics        | Crash reporting, non-fatal errors, custom keys and logs            |

### Forms (5 remaining)

| Screen            | What it will demonstrate                                         |
| ----------------- | ---------------------------------------------------------------- |
| Form Validation   | Required fields, regex, min/max length, real-time vs on-submit   |
| React Hook Form   | `useForm`, `Controller`, `FormProvider`, error messages, reset   |
| Date Picker       | Native date picker, time picker, date range, min/max constraints |
| Dropdown / Select | Native Picker, custom dropdown, searchable select, multi-select  |
| Search Input      | Debounced search, clear button, results list, empty state        |

### Animations (5 remaining)

| Screen          | What it will demonstrate                                                         |
| --------------- | -------------------------------------------------------------------------------- |
| Animated API    | Fade, slide, scale, rotate, spring, sequence, parallel, loop                     |
| LayoutAnimation | Preset animations, custom config, list item add/remove                           |
| Reanimated 3    | `useSharedValue`, `useAnimatedStyle`, `withSpring`, `withTiming`, `withSequence` |
| Gesture Handler | Pan, swipe, pinch, tap, long press — with Reanimated integration                 |
| Lottie          | JSON animation playback, speed control, loop, segment play                       |

### Navigation Patterns (5 remaining)

| Screen           | What it will demonstrate                                            |
| ---------------- | ------------------------------------------------------------------- |
| Tab Navigator    | Bottom tabs, badge count, custom tab bar, icon + label              |
| Drawer Navigator | Side menu, custom drawer content, gesture open/close                |
| Modal Stack      | Presenting screens as modals, transparent modal, bottom sheet modal |
| Deep Linking     | URL scheme setup, universal links, navigate from notification       |
| Auth Flow        | Conditional stack — logged in vs logged out, persist auth state     |

### Storage (4 remaining)

| Screen           | What it will demonstrate                                               |
| ---------------- | ---------------------------------------------------------------------- |
| MMKV             | Synchronous get/set, performance benchmark vs AsyncStorage             |
| Secure Storage   | Keychain (iOS) / Keystore (Android), store credentials, biometric lock |
| SQLite           | Create table, insert, query, update, delete, migrations                |
| Firebase Storage | Upload file with progress, download URL, delete, list files            |

### Networking (7 remaining)

| Screen            | What it will demonstrate                                             |
| ----------------- | -------------------------------------------------------------------- |
| Fetch API         | GET, POST, PUT, DELETE, headers, timeout, error handling             |
| Axios             | Axios instance, request/response interceptors, retry logic           |
| Interceptors      | Auth token injection, refresh token flow, error normalization        |
| Offline Detection | NetInfo, offline banner, request queue, retry on reconnect           |
| WebSocket         | Connect, send message, receive, ping/pong, disconnect, reconnect     |
| Firestore         | CRUD operations, real-time listener, pagination, offline persistence |
| Realtime Database | Read/write, live sync, presence system                               |

### Testing (3 remaining)

| Screen          | What it will demonstrate                                    |
| --------------- | ----------------------------------------------------------- |
| Unit Tests      | Jest tests for services and hooks — live test runner output |
| Component Tests | React Native Testing Library — render, query, fire events   |
| E2E Tests       | Detox setup, example flows — login, navigation, form submit |

### Code Refactoring (9 remaining)

| Screen           | What it will demonstrate                                                   |
| ---------------- | -------------------------------------------------------------------------- |
| Folder Structure | Scalable layout, barrel exports, feature-based vs type-based               |
| Atomic Design    | Atoms, molecules, organisms — live walkthrough of this codebase            |
| Custom Hooks     | Before/after extraction — logic pulled out of components                   |
| Service Layer    | Isolating side effects, pure functions, testability                        |
| State Management | Context vs Zustand vs Redux — same feature, three implementations          |
| Type Safety      | Strict TypeScript, discriminated unions, branded types, generics           |
| Performance      | `memo`, `useCallback`, `useMemo`, FlatList optimization, Flipper profiling |
| Error Boundaries | Fallback UI, `ErrorBoundary`, crash hooks, Sentry integration              |
| Code Splitting   | Lazy screens, dynamic imports, bundle size analysis                        |

---

## Phase 2 — Superpower Features

**Goal: Features that no documentation site, no AI, and no tutorial can replicate.**

### Interactive Code Viewer

Every screen gets a "View Source" button. Tap it to see the exact implementation code for that screen — syntax highlighted, scrollable, copyable. Not a link to GitHub. The actual code, inline, on your device.

This is the single most powerful feature for a developer tool. You see the pattern running, then immediately see how it was built.

### Device Comparison Mode

Run two implementations side by side — split screen. Compare `Animated API` vs `Reanimated` for the same animation. Compare `AsyncStorage` vs `MMKV` performance. Compare `fetch` vs `Axios` error handling. See the difference, not just read about it.

### Performance Profiler

Each screen shows live performance metrics:

- Render count
- Re-render triggers
- JS thread FPS
- UI thread FPS
- Memory usage delta

Developers learn performance by seeing it, not by reading about it.

### Snippet Exporter

One tap to copy a production-ready, typed, linted code snippet for any pattern. Not the entire screen — just the relevant implementation block. Formatted, ready to paste.

### Dark Mode

Full dark/light theme support across every screen. Demonstrates the pattern while being the pattern.

### Offline Mode

The entire app works offline. No network required after first launch. Demonstrates offline-first architecture by being offline-first.

### Search Upgrade

The deep search index already exists. Upgrade it with:

- Fuzzy matching
- Search by tag (e.g. "firebase", "animation", "ios-only")
- Recent searches
- Keyboard shortcut on iPad

### Contribution Guide

Clear, step-by-step guide for open source contributors to add new screens. Lower the barrier so the community builds this together.

---

## Phase 3 — Platform Expansion

**Goal: RNToolBox becomes an ecosystem, not just an app.**

### App Store / Play Store Release

Publish publicly so every React Native developer in the world can install it. This is the distribution milestone — everything before this is building the product.

### GitHub Discussions + Issues as Feature Requests

Let the community vote on which screens to build next. The most-requested patterns get built first.

### Weekly Pattern Drops

One new screen every week. Announced on GitHub, Twitter/X, and via push notification. Keeps developers coming back and gives the project momentum.

### VS Code Extension (Future)

`RNToolBox: Insert Pattern` — browse and insert any pattern directly into your editor without leaving VS Code.

### CLI Tool (Future)

```bash
npx rntoolbox add biometrics
```

Scaffolds a production-ready biometrics screen into your project, wired up and ready to run.

---

## Contribution

RNToolBox is open source and contributions are welcome.

To add a new screen:

1. Fork the repository
2. Create a branch: `feature/your-screen-name`
3. Follow the screen pattern documented above
4. Add the route, register in the navigator, add to the menu list
5. Mark `implemented: true`
6. Open a pull request

Every screen must:

- Run on both iOS and Android (or clearly document platform limitations)
- Use the existing theme tokens — no hardcoded colors or spacing
- Follow the atomic design pattern — no raw primitives in screens
- Handle loading, error, and empty states where applicable
- Be accessible — `accessibilityLabel` on all interactive elements

---

## License

MIT
