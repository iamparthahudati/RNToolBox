import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  PixelRatio,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/Header';
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
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionHeaderText}>{section.title}</Text>
              </View>
              {section.rows.map(row => (
                <View key={row.key} style={styles.row}>
                  <Text style={styles.rowLabel}>{row.label}</Text>
                  <Text
                    style={styles.rowValue}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {info?.[row.key] ?? '—'}
                  </Text>
                </View>
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
  sectionHeader: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  sectionHeaderText: {
    fontSize: theme.typography.sizes.xs,
    fontWeight: '700',
    color: theme.colors.textSecondary,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.white,
  },
  rowLabel: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    flex: 1,
  },
  rowValue: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textPrimary,
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
});
