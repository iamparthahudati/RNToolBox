# Firebase Setup Checklist

Project: **rntollbox**
Project Number: **75014116828**
Console: https://console.firebase.google.com/project/rntollbox

---

## 1. Email / Password

**Firebase Console → Authentication → Sign-in method → Email/Password**

- [ ] Enable **Email/Password** provider

No keys or fingerprints required. Works with existing config files.

---

## 2. Google Sign-In

### A. Enable Provider

**Firebase Console → Authentication → Sign-in method → Google**

- [ ] Enable **Google** provider

### B. Web Client ID

**Firebase Console → Authentication → Sign-in method → Google → Web SDK configuration → Web client ID**

- [ ] Copy the Web Client ID (format: `75014116828-xxxxxxxx.apps.googleusercontent.com`)
- [ ] Paste it into all three `.env` files:

```
# .env
GOOGLE_WEB_CLIENT_ID=75014116828-xxxxxxxx.apps.googleusercontent.com

# .env.staging
GOOGLE_WEB_CLIENT_ID=75014116828-xxxxxxxx.apps.googleusercontent.com

# .env.production
GOOGLE_WEB_CLIENT_ID=75014116828-xxxxxxxx.apps.googleusercontent.com
```

> All three environments share the same Firebase project so the Web Client ID is the same across all `.env` files.

### C. Android — SHA-1 Fingerprint (Critical)

**Firebase Console → Project Settings → Your apps → Android (`com.rntoolbox`) → Add fingerprint**

> Your current `google-services.json` has an **empty `oauth_client` array** — Google Sign-In will fail on Android until this is done.

- [ ] Run the following to get your debug SHA-1:
  ```bash
  cd android && ./gradlew signingReport
  ```
- [ ] Copy the `SHA1` value from the `debug` variant
- [ ] Paste it into Firebase Console under the Android app fingerprints
- [ ] Re-download `google-services.json` and replace both:
  - `android/app/google-services.json`
  - `firebase/dev/google-services.json`

### D. iOS — REVERSED_CLIENT_ID URL Scheme

**Xcode → ios/RNToolbox/Info.plist → CFBundleURLTypes**

- [ ] Verify that `REVERSED_CLIENT_ID` is registered as a URL scheme in `Info.plist`
- [ ] The value is the `CLIENT_ID` from `GoogleService-Info.plist` reversed
  - Example: if CLIENT_ID is `75014116828-abc.apps.googleusercontent.com`
  - Then REVERSED_CLIENT_ID is `com.googleusercontent.apps.75014116828-abc`
- [ ] If missing, add it under `CFBundleURLTypes` in `Info.plist`:
  ```xml
  <dict>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>com.googleusercontent.apps.75014116828-abc</string>
    </array>
  </dict>
  ```

---

## 3. Apple Sign-In (iOS Only)

### A. Enable Provider

**Firebase Console → Authentication → Sign-in method → Apple**

- [ ] Enable **Apple** provider

### B. Apple Developer Console

**https://developer.apple.com → Certificates, Identifiers & Profiles**

- [ ] Go to **Identifiers → com.rntoolbox**
- [ ] Enable **Sign In with Apple** capability
- [ ] Go to **Keys → Create a new key**
- [ ] Enable **Sign In with Apple** for the key
- [ ] Download the `.p8` private key file (only available once)
- [ ] Note the **Key ID** (10-character string)
- [ ] Note your **Team ID** (10-character string, top-right of developer console)

### C. Configure in Firebase Console

**Firebase Console → Authentication → Sign-in method → Apple**

- [ ] Enter **Services ID**: `com.rntoolbox`
- [ ] Enter **Apple Team ID**: your 10-character Team ID (e.g. `AB12CD34EF`)
- [ ] Enter **Key ID**: from the key created above
- [ ] Paste the contents of the `.p8` file into **Private key**

### D. Xcode Capability

**Xcode → RNToolbox target → Signing & Capabilities**

- [ ] Click **+ Capability**
- [ ] Add **Sign In with Apple**

---

## 4. Phone OTP

### A. Enable Provider

**Firebase Console → Authentication → Sign-in method → Phone**

- [ ] Enable **Phone** provider

### B. Test Phone Numbers (Development)

**Firebase Console → Authentication → Sign-in method → Phone → Phone numbers for testing**

> Simulators and emulators cannot receive real SMS. Add test numbers to develop without a physical device.

- [ ] Add test phone numbers with static OTP codes, for example:
  ```
  +15550001234  →  123456
  +15550005678  →  654321
  ```

### C. Android — SHA-256 Fingerprint (Production)

**Firebase Console → Project Settings → Your apps → Android (`com.rntoolbox`) → Add fingerprint**

> Firebase uses SHA-256 for Play Integrity / SafetyNet to silently auto-verify OTPs on Android without user input.

- [ ] Run the following to get your debug SHA-256:
  ```bash
  cd android && ./gradlew signingReport
  ```
- [ ] Copy the `SHA-256` value from the `debug` variant
- [ ] Paste it into Firebase Console under the Android app fingerprints

---

## 5. Anonymous Auth

**Firebase Console → Authentication → Sign-in method → Anonymous**

- [ ] Enable **Anonymous** provider

No keys or configuration required beyond enabling the provider.

---

## All Providers — Quick Status

| Provider       | Firebase Enable | Keys / Config Needed                        | Android Fingerprint | iOS Capability                         |
| -------------- | --------------- | ------------------------------------------- | ------------------- | -------------------------------------- |
| Email/Password | [ ]             | None                                        | Not required        | Not required                           |
| Google         | [ ]             | Web Client ID → `.env` files                | SHA-1 required      | REVERSED_CLIENT_ID in Info.plist       |
| Apple          | [ ]             | Team ID + Key ID + `.p8` → Firebase Console | Not required        | Sign In with Apple capability in Xcode |
| Phone OTP      | [ ]             | Test numbers for dev                        | SHA-256 recommended | Not required                           |
| Anonymous      | [ ]             | None                                        | Not required        | Not required                           |
