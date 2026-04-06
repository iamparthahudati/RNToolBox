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
        // Mobile Chrome UA — required for Android's network stack to allow the request
        // and for Google to return the full data-bearing HTML page.
        'User-Agent':
          'Mozilla/5.0 (Linux; Android 13; Pixel 6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });
  } catch (networkErr: unknown) {
    const msg =
      networkErr instanceof Error ? networkErr.message : String(networkErr);
    throw new Error(`Play Store network error: ${msg}`);
  }

  if (!response.ok) {
    throw new Error(`Play Store responded with status ${response.status}`);
  }

  const html = await response.text();
  // Version is embedded in Google's data blob as [[["x.x.x"]]]
  const match = html.match(/\[\[\["(\d+\.\d+[\d.]*?)"\]\]/);
  return match?.[1] ?? null;
}

async function fetchAppStoreVersion(): Promise<string> {
  try {
    // WhatsApp's numeric App Store ID (bundleId lookup doesn't work for WhatsApp)
    const WHATSAPP_APP_STORE_ID = '310633997';
    const res = await fetch(
      `https://itunes.apple.com/lookup?id=${WHATSAPP_APP_STORE_ID}&country=us`,
    );
    const json = await res.json();
    const version: string | undefined = json?.results?.[0]?.version;
    return version ?? 'Unavailable';
  } catch {
    return 'Error';
  }
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
        fetchPlayStoreVersion(WHATSAPP_BUNDLE_ID).catch(() => null),
        fetchAppStoreVersion(),
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
        liveAndroidVersion: androidVersion ?? 'Unavailable',
        liveIosVersion: iosVersion,
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
