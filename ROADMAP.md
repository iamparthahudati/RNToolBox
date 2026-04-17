# RNToolBox Roadmap

> The goal is simple — become the most complete, most trusted, most interactive React Native reference that exists. Not as documentation. As a running app on your device.

---

## Vision

AI can generate React Native code in seconds. What AI cannot do is run Face ID on your device, show you how haptic feedback actually feels, prove that a permission flow handles the "blocked" state correctly, or demonstrate the exact gap between what the code says and what the device does.

**RNToolBox closes that gap.**

Every pattern. Running on your device. Right now.

---

## Current Progress

| Category                 | Done   | Total   |
| ------------------------ | ------ | ------- |
| UI Components            | 6      | 14      |
| Native Actions           | 7      | 13      |
| Google Maps              | 15     | 15      |
| Permissions              | 0      | 7       |
| Hooks & Utilities        | 0      | 6       |
| System & Device          | 2      | 9       |
| Forms                    | 0      | 5       |
| Animations               | 0      | 5       |
| Navigation Patterns      | 0      | 5       |
| Storage                  | 1      | 5       |
| Security                 | 5      | 5       |
| Authentication           | 5      | 5       |
| Networking               | 1      | 8       |
| Testing                  | 0      | 3       |
| Code Refactoring         | 0      | 9       |
| Accessibility (WCAG 2.2) | 1      | 1       |
| **Total**                | **43** | **115** |

**37% complete.**

---

## Phase 1 — Complete the Foundation

> Zero placeholder screens. Every category fully implemented.

### UI Components

- [ ] Cards — basic, image, action, horizontal, list card variants
- [ ] Modals & Alerts — custom modal, bottom sheet, confirmation dialog, full-screen modal
- [ ] Toast / Snackbar — success, error, info, warning, auto-dismiss, action button, queue
- [ ] Lists — FlatList, SectionList, pull-to-refresh, infinite scroll, swipe-to-delete
- [ ] Images — lazy loading, blur placeholder, error fallback, ImageBackground
- [ ] Icons — full Material Design icon showcase, sizing, coloring, usage patterns
- [ ] Avatar — image avatar, initials fallback, size variants, online indicator
- [ ] Empty State — no data, no connection, no results, error state with action buttons

### Native Actions

- [ ] Image Picker — camera roll, camera capture, multi-select, crop, compression
- [ ] File Picker — document selection, file type filtering, size display
- [ ] Camera — live preview, capture photo, flash toggle, front/back switch
- [ ] Barcode / QR Scanner — scan barcodes and QR codes, parse result types, torch toggle
- [ ] Push Notifications (FCM) — local notifications, remote push, notification channels
- [ ] Background Tasks — headless JS, background fetch, task scheduling

### Permissions

- [ ] Camera — check, request, blocked fallback with settings deep-link
- [ ] Location — foreground vs background, always vs when-in-use, accuracy levels
- [ ] Notifications — iOS/Android request, provisional (iOS), channel setup (Android)
- [ ] Microphone — audio recording access, check before record
- [ ] Contacts — address book access, read contacts list on grant
- [ ] Photo Library — gallery access, limited selection (iOS 14+)
- [ ] Bluetooth — BLE scan permission, Android 12+ granular permissions

### Hooks & Utilities

- [ ] `useDebounce` — debounced value with configurable delay, live search example
- [ ] `useLocalStorage` — AsyncStorage wrapper with JSON serialization, typed get/set
- [ ] `useNetworkStatus` — online/offline detection, connection type, NetInfo integration
- [ ] `useAppState` — foreground/background/inactive transitions and use cases
- [ ] `useKeyboard` — keyboard height, visibility, avoid-keyboard patterns
- [ ] `useTimer` — countdown timer, stopwatch, lap tracking, pause/resume

### System & Device

- [ ] Push Notifications — FCM token, notification payload, foreground/background handling
- [ ] Network Info — connection type, IP address, WiFi SSID
- [ ] Environment Config — live display of all env vars per build, config validation
- [ ] Dark Mode — `useColorScheme`, manual override, system sync, theme switching
- [ ] Localization — i18n setup, language switching, RTL layout, date/number formatting
- [ ] Analytics — Firebase Analytics event logging, user properties, screen tracking
- [ ] Crashlytics — crash reporting, non-fatal errors, custom keys and logs

### Forms

- [ ] Form Validation — required fields, regex, min/max length, real-time vs on-submit
- [ ] React Hook Form — `useForm`, `Controller`, `FormProvider`, error messages, reset
- [ ] Date Picker — native date picker, time picker, date range, min/max constraints
- [ ] Dropdown / Select — native Picker, custom dropdown, searchable select, multi-select
- [ ] Search Input — debounced search, clear button, results list, empty state

### Animations

- [ ] Animated API — fade, slide, scale, rotate, spring, sequence, parallel, loop
- [ ] LayoutAnimation — preset animations, custom config, list item add/remove
- [ ] Reanimated 3 — `useSharedValue`, `useAnimatedStyle`, `withSpring`, `withTiming`, `withSequence`
- [ ] Gesture Handler — pan, swipe, pinch, tap, long press with Reanimated integration
- [ ] Lottie — JSON animation playback, speed control, loop, segment play

### Navigation Patterns

- [ ] Tab Navigator — bottom tabs, badge count, custom tab bar, icon + label
- [ ] Drawer Navigator — side menu, custom drawer content, gesture open/close
- [ ] Modal Stack — presenting screens as modals, transparent modal, bottom sheet modal
- [ ] Deep Linking — URL scheme setup, universal links, navigate from notification
- [ ] Auth Flow — conditional stack for logged in vs logged out, persist auth state

### Storage

- [ ] MMKV — synchronous get/set, performance benchmark vs AsyncStorage
- [ ] Secure Storage — Keychain (iOS) / Keystore (Android), store credentials, biometric lock
- [ ] SQLite — create table, insert, query, update, delete, migrations
- [ ] Firebase Storage — upload file with progress, download URL, delete, list files

### Networking

- [ ] Fetch API — GET, POST, PUT, DELETE, headers, timeout, error handling
- [ ] Axios — Axios instance, request/response interceptors, retry logic
- [ ] Interceptors — auth token injection, refresh token flow, error normalization
- [ ] Offline Detection — NetInfo, offline banner, request queue, retry on reconnect
- [ ] WebSocket — connect, send, receive, ping/pong, disconnect, reconnect
- [ ] Firestore — CRUD, real-time listener, pagination, offline persistence
- [ ] Realtime Database — read/write, live sync, presence system

### Testing

- [ ] Unit Tests — Jest tests for services and hooks, live test runner output in-app
- [ ] Component Tests — React Native Testing Library, render, query, fire events
- [ ] E2E Tests — Detox setup, example flows for login, navigation, form submit

### Code Refactoring

- [ ] Folder Structure — scalable layout, barrel exports, feature-based vs type-based
- [ ] Atomic Design — atoms, molecules, organisms, live walkthrough of this codebase
- [ ] Custom Hooks — before/after extraction, logic pulled out of components
- [ ] Service Layer — isolating side effects, pure functions, testability
- [ ] State Management — Context vs Zustand vs Redux, same feature three ways
- [ ] Type Safety — strict TypeScript, discriminated unions, branded types, generics
- [ ] Performance — `memo`, `useCallback`, `useMemo`, FlatList optimization, Flipper profiling
- [ ] Error Boundaries — fallback UI, `ErrorBoundary`, crash hooks, Sentry integration
- [ ] Code Splitting — lazy screens, dynamic imports, bundle size analysis

---

## Phase 2 — Superpower Features

> Features that no documentation site, no AI, and no tutorial can replicate.

### Interactive Code Viewer

Every screen gets a "View Source" button. Tap it to see the exact implementation code for that screen — syntax highlighted, scrollable, copyable. Not a link to GitHub. The actual code, inline, on your device. You see the pattern running, then immediately see how it was built.

- [ ] Code viewer component with syntax highlighting
- [ ] Wire up to every implemented screen
- [ ] One-tap copy to clipboard

### Snippet Exporter

One tap to copy a production-ready, typed, linted code snippet for any pattern. Not the entire screen — just the relevant implementation block. Formatted, ready to paste into your project.

- [ ] Snippet registry per screen
- [ ] Copy button with confirmation feedback
- [ ] Snippets versioned alongside the screen

### Performance Profiler

Each screen shows live performance metrics so developers learn performance by seeing it, not reading about it.

- [ ] Render count display
- [ ] Re-render trigger log
- [ ] JS thread FPS
- [ ] UI thread FPS
- [ ] Memory usage delta

### Device Comparison Mode

Run two implementations side by side. Compare `Animated API` vs `Reanimated` for the same animation. Compare `AsyncStorage` vs `MMKV` performance. Compare `fetch` vs `Axios` error handling. See the difference, not just read about it.

- [ ] Split-screen layout component
- [ ] Comparison pairs for animations, storage, networking

### Dark Mode

Full dark/light theme support across every screen. Demonstrates the pattern while being the pattern.

- [ ] Theme context with dark/light tokens
- [ ] System sync + manual override toggle
- [ ] Persist preference across sessions

### Offline Mode

The entire app works offline after first launch. Demonstrates offline-first architecture by being offline-first.

- [ ] All static screens work with no network
- [ ] Offline banner for screens that require network
- [ ] Cache remote config values locally

### Search Upgrade

The deep search index already exists. Make it genuinely powerful.

- [ ] Fuzzy matching
- [ ] Filter by tag (e.g. "firebase", "ios-only", "animation")
- [ ] Recent searches
- [ ] Search result previews

---

## Phase 3 — Go Public

> Ship it. Let the world use it.

- [ ] App icon and splash screen
- [ ] App Store listing (iOS)
- [ ] Play Store listing (Android)
- [ ] Privacy policy
- [ ] Public GitHub — open for contributions
- [ ] Contribution guide — clear steps for adding new screens
- [ ] Weekly pattern drops — one new screen every week

---

## Phase 4 — Ecosystem

> RNToolBox becomes more than an app.

### CLI Tool

```bash
npx rntoolbox add biometrics
```

Scaffolds a production-ready, typed screen into your project — wired up and ready to run. No copy-pasting. No adapting boilerplate. Just working code in your codebase.

### VS Code Extension

Browse and insert any RNToolBox pattern directly from your editor. See the live preview, copy the snippet, done — without leaving VS Code.

### Community

- GitHub Discussions for feature requests
- Community votes on which screens to build next
- Most-requested patterns get built first

---

## Contributing

RNToolBox is open source. Every screen you add helps thousands of developers.

To contribute a new screen:

1. Fork the repository
2. Create a branch: `feature/your-screen-name`
3. Follow the screen pattern in `README.md`
4. Add the route, register in the navigator, add to the menu list
5. Mark `implemented: true`
6. Open a pull request

Every screen must:

- Run on both iOS and Android (or clearly document platform limitations)
- Use existing theme tokens — no hardcoded colors or spacing
- Follow atomic design — no raw primitives in screens
- Handle loading, error, and empty states where applicable
- Be accessible — `accessibilityLabel` on all interactive elements
