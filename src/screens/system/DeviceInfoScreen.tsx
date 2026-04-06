import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  PixelRatio,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/atoms/Header';
import InfoRow from '../../components/molecules/InfoRow';
import SectionHeader from '../../components/molecules/SectionHeader';
import { useTheme } from '../../theme';

const WHATSAPP_BUNDLE_ID = 'com.whatsapp';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=';

interface DeviceInfoData {
  deviceName: string;
  brand: string;
  model: string;
  deviceId: string;
  systemName: string;
  systemVersion: string;
  apiLevel: string;
  appName: string;
  bundleId: string;
  appVersion: string;
  buildNumber: string;
  screenWidth: string;
  screenHeight: string;
  fontScale: string;
  totalMemory: string;
  batteryLevel: string;
  isEmulator: string;
  liveAndroidVersion: string;
  liveIosVersion: string;
}

interface SectionRow {
  label: string;
  key: keyof DeviceInfoData;
}

interface Section {
  title: string;
  rows: SectionRow[];
}

const SECTIONS: Section[] = [
  {
    title: 'DEVICE',
    rows: [
      { label: 'Device Name', key: 'deviceName' },
      { label: 'Brand', key: 'brand' },
      { label: 'Model', key: 'model' },
      { label: 'Device ID', key: 'deviceId' },
    ],
  },
  {
    title: 'SYSTEM',
    rows: [
      { label: 'OS', key: 'systemName' },
      { label: 'Version', key: 'systemVersion' },
      { label: 'API Level', key: 'apiLevel' },
    ],
  },
  {
    title: 'APP',
    rows: [
      { label: 'App Name', key: 'appName' },
      { label: 'Bundle ID', key: 'bundleId' },
      { label: 'Version', key: 'appVersion' },
      { label: 'Build Number', key: 'buildNumber' },
    ],
  },
  {
    title: 'DISPLAY',
    rows: [
      { label: 'Screen Width', key: 'screenWidth' },
      { label: 'Screen Height', key: 'screenHeight' },
      { label: 'Font Scale', key: 'fontScale' },
    ],
  },
  {
    title: 'HARDWARE',
    rows: [
      { label: 'Total Memory', key: 'totalMemory' },
      { label: 'Battery Level', key: 'batteryLevel' },
      { label: 'Emulator', key: 'isEmulator' },
    ],
  },
  {
    title: 'STORE (LIVE)',
    rows: [
      { label: 'Android (Play Store)', key: 'liveAndroidVersion' },
      { label: 'iOS (App Store)', key: 'liveIosVersion' },
    ],
  },
];

async function fetchPlayStoreVersion(
  packageId: string,
): Promise<string | null> {
  const url = `${PLAY_STORE_URL}${encodeURIComponent(packageId)}&hl=en&gl=US`;

  let response: Response;
  try {
    response = await fetch(url, {
      method: 'GET',
      headers: {
        // Use a mobile Android UA so Google serves the full AF_initDataCallback HTML.
        // Do NOT send sec-fetch-site — it is a browser-only header and can cause
        // Google to misidentify the request and return a different page structure.
        'User-Agent':
          'Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36',
      },
    });
  } catch (networkErr: unknown) {
    const msg =
      networkErr instanceof Error ? networkErr.message : String(networkErr);
    throw new Error(`Play Store network error: ${msg}`);
  }

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`App "${packageId}" not found in Google Play.`);
    }
    throw new Error(`Play Store responded with status ${response.status}`);
  }

  const html = await response.text();

  // Pattern 1 (primary): double-quoted triple-bracket — the format Google uses since 2024.
  // Old single-quote variant broke when Google switched to double quotes in AF_initDataCallback.
  const m1 = html.match(/\[\[\["([\d.]+?)"\]\]/);
  if (m1?.[1]) {
    return m1[1].trim();
  }

  // Pattern 2: add surrounding context anchors to reduce false positives.
  const m2 = html.match(/\[\[\["([\d]+\.[\d.]+?)"\]\],null,\[\[\[/);
  if (m2?.[1]) {
    return m2[1].trim();
  }

  // Pattern 3: parse the full AF_initDataCallback ds:5 JSON blob (most structurally sound).
  // Handles the October-2025 variant where the version moved to an object-at-last-index path.
  const scriptMatch = html.match(
    /AF_initDataCallback[\s\S]*?key:\s*'ds:5'[\s\S]*?data:([\s\S]*?),\s*sideChannel:\s*\{\}\s*\}\)/,
  );
  if (scriptMatch?.[1]) {
    try {
      const data = JSON.parse(scriptMatch[1]);
      // Primary path: ds:5 -> [1][2][140][0][0][0]
      const v1 = data?.[1]?.[2]?.[140]?.[0]?.[0]?.[0];
      if (v1 && /^\d+\.\d+/.test(String(v1))) {
        return String(v1).trim();
      }
      // Fallback path: new 2025 object-at-last-index variant (key '141')
      const arr: unknown[] | undefined = data?.[1]?.[2];
      if (Array.isArray(arr)) {
        const lastEl = arr[arr.length - 1] as Record<string, unknown> | null;
        const v2 = (lastEl as any)?.['141']?.[0]?.[0]?.[0];
        if (v2 && /^\d+\.\d+/.test(String(v2))) {
          return String(v2).trim();
        }
      }
    } catch (_) {
      // JSON parse failed — fall through to next pattern
    }
  }

  // Pattern 4 (legacy fallback): "Current Version" label in older rendered HTML.
  const m4 = html.match(/Current Version[\s\S]{0,200}?>([\d.]+)<\/span>/);
  if (m4?.[1]) {
    return m4[1].trim();
  }

  return null;
}

async function fetchAppStoreVersion(): Promise<string | null> {
  // WhatsApp's numeric App Store ID (bundleId lookup doesn't work for WhatsApp)
  const WHATSAPP_APP_STORE_ID = '310633997';

  let response: Response;
  try {
    response = await fetch(
      `https://itunes.apple.com/lookup?id=${WHATSAPP_APP_STORE_ID}&country=us`,
    );
  } catch (networkErr: unknown) {
    const msg =
      networkErr instanceof Error ? networkErr.message : String(networkErr);
    throw new Error(`App Store network error: ${msg}`);
  }

  if (!response.ok) {
    throw new Error(`App Store responded with status ${response.status}`);
  }

  const json = await response.json();
  const version: string | undefined = json?.results?.[0]?.version;
  return version ?? null;
}

export default function DeviceInfoScreen(): React.JSX.Element {
  const { colors, spacing } = useTheme();
  const [info, setInfo] = useState<DeviceInfoData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInfo = async () => {
      const { width, height } = Dimensions.get('screen');

      const [
        battery,
        totalMem,
        emulator,
        apiLevel,
        androidVersion,
        iosVersion,
      ] = await Promise.all([
        DeviceInfo.getBatteryLevel(),
        DeviceInfo.getTotalMemory(),
        DeviceInfo.isEmulator(),
        DeviceInfo.getApiLevel(),
        fetchPlayStoreVersion(WHATSAPP_BUNDLE_ID).catch(
          (e: unknown) =>
            `Error: ${e instanceof Error ? e.message : String(e)}`,
        ),
        fetchAppStoreVersion().catch(
          (e: unknown) =>
            `Error: ${e instanceof Error ? e.message : String(e)}`,
        ),
      ]);

      setInfo({
        deviceName: DeviceInfo.getDeviceNameSync(),
        brand: DeviceInfo.getBrand(),
        model: DeviceInfo.getModel(),
        deviceId: DeviceInfo.getDeviceId(),
        systemName: DeviceInfo.getSystemName(),
        systemVersion: DeviceInfo.getSystemVersion(),
        apiLevel: Platform.OS === 'android' ? `${apiLevel}` : 'N/A',
        appName: DeviceInfo.getApplicationName(),
        bundleId: WHATSAPP_BUNDLE_ID,
        appVersion: DeviceInfo.getVersion(),
        buildNumber: DeviceInfo.getBuildNumber(),
        screenWidth: `${Math.round(width)} px`,
        screenHeight: `${Math.round(height)} px`,
        fontScale: PixelRatio.getFontScale().toFixed(2),
        totalMemory: `${(totalMem / (1024 * 1024 * 1024)).toFixed(2)} GB`,
        batteryLevel: `${Math.round(battery * 100)}%`,
        isEmulator: `${emulator}`,
        liveAndroidVersion: androidVersion ?? 'Version not found',
        liveIosVersion: iosVersion ?? 'Version not found',
      });

      setLoading(false);
    };

    loadInfo();
  }, []);

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]}>
      <Header title="Device Info" />
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: spacing.xxl },
          ]}
        >
          {SECTIONS.map(section => (
            <View key={section.title}>
              <SectionHeader title={section.title} />
              {section.rows.map(row => (
                <InfoRow
                  key={row.key}
                  label={row.label}
                  value={info?.[row.key] ?? '—'}
                />
              ))}
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    flexGrow: 1,
  },
});
