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
import { theme } from '../../theme';

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
];

export default function DeviceInfoScreen(): React.JSX.Element {
  const [info, setInfo] = useState<DeviceInfoData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInfo = async () => {
      const { width, height } = Dimensions.get('screen');

      const [battery, totalMem, emulator, apiLevel] = await Promise.all([
        DeviceInfo.getBatteryLevel(),
        DeviceInfo.getTotalMemory(),
        DeviceInfo.isEmulator(),
        DeviceInfo.getApiLevel(),
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
        bundleId: DeviceInfo.getBundleId(),
        appVersion: DeviceInfo.getVersion(),
        buildNumber: DeviceInfo.getBuildNumber(),
        screenWidth: `${Math.round(width)} px`,
        screenHeight: `${Math.round(height)} px`,
        fontScale: PixelRatio.getFontScale().toFixed(2),
        totalMemory: `${(totalMem / (1024 * 1024 * 1024)).toFixed(2)} GB`,
        batteryLevel: `${Math.round(battery * 100)}%`,
        isEmulator: `${emulator}`,
      });

      setLoading(false);
    };

    loadInfo();
  }, []);

  return (
    <SafeAreaView style={styles.root}>
      <Header title="Device Info" />
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator color={theme.colors.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
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
    backgroundColor: theme.colors.background,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: theme.spacing.xl,
  },
});
