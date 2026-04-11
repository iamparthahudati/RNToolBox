import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
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

interface DetectionData {
  isEmulator: boolean | null;
}

export default function JailbreakScreen(): React.JSX.Element {
  const { colors, spacing } = useTheme();
  const [detection, setDetection] = useState<DetectionData>({
    isEmulator: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const runDetection = async () => {
      const isEmulator = await DeviceInfo.isEmulator();
      setDetection({ isEmulator });
      setLoading(false);
    };

    runDetection();
  }, []);

  const emulatorValue =
    detection.isEmulator === null
      ? '—'
      : detection.isEmulator
      ? 'Yes — Emulator detected'
      : 'No — Physical device';

  const emulatorColor =
    detection.isEmulator === null
      ? colors.textSecondary
      : detection.isEmulator
      ? colors.errorMain
      : colors.successMain;

  const jailbreakMessage =
    Platform.OS === 'ios'
      ? 'Detection requires native module (e.g. react-native-jail-monkey)'
      : 'Detection requires native module (e.g. react-native-jail-monkey)';

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]}>
      <Header title="Jailbreak & Root Detection" />
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
          {/* LIVE DETECTION */}
          <View>
            <SectionHeader title="LIVE DETECTION" />
            <InfoRow multiline
              label="Emulator / Simulator"
              value={emulatorValue}
              valueColor={emulatorColor}
            />
            <InfoRow multiline
              label="Jailbreak / Root Status"
              value={jailbreakMessage}
              valueColor={colors.warningMain}
            />
            <InfoRow multiline
              label="Detection Confidence"
              value="Heuristic — not 100% reliable"
              valueColor={colors.warningMain}
            />
          </View>

          {/* WHAT IS IT */}
          <View>
            <SectionHeader title="WHAT IS IT" />
            <InfoRow multiline
              label="Jailbreak (iOS)"
              value="Removal of sandbox restrictions via exploits"
            />
            <InfoRow multiline
              label="Root (Android)"
              value="Gaining superuser access via su binary"
            />
            <InfoRow multiline
              label="Risk"
              value="Jailbroken devices can bypass app security controls"
              valueColor={colors.errorMain}
            />
          </View>

          {/* DETECTION TECHNIQUES */}
          <View>
            <SectionHeader title="DETECTION TECHNIQUES" />
            <InfoRow multiline
              label="File system checks"
              value="Look for /Applications/Cydia.app, /bin/bash, /usr/sbin/sshd"
            />
            <InfoRow multiline
              label="Suspicious apps"
              value="Cydia, Sileo, Zebra package managers"
            />
            <InfoRow multiline
              label="Write test"
              value="Attempt to write outside sandbox — should fail on stock device"
            />
            <InfoRow multiline
              label="OTA checks"
              value="Verify system integrity via platform APIs"
            />
            <InfoRow multiline
              label="Emulator signals"
              value="Build props, sensor absence, known emulator IDs"
            />
          </View>

          {/* RECOMMENDED LIBRARY */}
          <View>
            <SectionHeader title="RECOMMENDED LIBRARY" />
            <InfoRow multiline
              label="Library"
              value="react-native-jail-monkey"
              valueColor={colors.primary}
            />
            <InfoRow multiline
              label="iOS checks"
              value="Cydia, SSH, file paths, sandbox escape"
            />
            <InfoRow multiline
              label="Android checks"
              value="su binary, build tags, test-keys, emulator props"
            />
            <InfoRow multiline
              label="Action on detection"
              value="Warn user, disable features, or exit app"
              valueColor={colors.warningMain}
            />
          </View>

          {/* SECURITY NOTES */}
          <View>
            <SectionHeader title="SECURITY NOTES" />
            <InfoRow multiline
              label="Arms race"
              value="Jailbreak tools actively bypass detection"
              valueColor={colors.warningMain}
            />
            <InfoRow multiline
              label="Layered defence"
              value="Combine with certificate pinning and obfuscation"
            />
            <InfoRow multiline
              label="False positives"
              value="Some legitimate devices may trigger checks"
              valueColor={colors.warningMain}
            />
            <InfoRow multiline
              label="User experience"
              value="Consider warning dialog instead of hard block"
            />
          </View>
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
