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

interface LiveDetection {
  devMode: string;
  platform: string;
  isEmulator: string;
}

export default function ObfuscationScreen(): React.JSX.Element {
  const { colors, spacing } = useTheme();
  const [live, setLive] = useState<LiveDetection | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLiveData = async () => {
      const emulator = await DeviceInfo.isEmulator();
      setLive({
        devMode: `${__DEV__}`,
        platform: Platform.OS,
        isEmulator: `${emulator}`,
      });
      setLoading(false);
    };

    loadLiveData();
  }, []);

  const devModeColor = __DEV__ ? colors.errorMain : colors.successMain;
  const emulatorColor =
    live?.isEmulator === 'true' ? colors.errorMain : colors.successMain;

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]}>
      <Header title="Obfuscation & Debug Detection" />
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
          <SectionHeader title="LIVE DETECTION" />
          <InfoRow multiline
            label="DEV Mode"
            value={live?.devMode ?? '—'}
            valueColor={devModeColor}
          />
          <InfoRow multiline label="Platform" value={live?.platform ?? '—'} />
          <InfoRow multiline
            label="Emulator / Simulator"
            value={live?.isEmulator ?? '—'}
            valueColor={emulatorColor}
          />

          {/* CODE OBFUSCATION */}
          <SectionHeader title="CODE OBFUSCATION" />
          <InfoRow multiline
            label="What it does"
            value="Transforms JS bundle to make reverse engineering harder"
          />
          <InfoRow multiline
            label="Metro bundler"
            value="Minifies and mangles variable names in production builds"
          />
          <InfoRow multiline
            label="ProGuard / R8"
            value="Android — shrinks and obfuscates native Java/Kotlin code"
          />
          <InfoRow multiline
            label="Hermes"
            value="Compiles JS to bytecode — harder to read than plain JS"
          />
          <InfoRow multiline
            label="Limitation"
            value="Obfuscation slows attackers — does not stop determined reverse engineers"
            valueColor={colors.warningMain}
          />

          {/* DEBUG DETECTION */}
          <SectionHeader title="DEBUG DETECTION" />
          <InfoRow multiline
            label="__DEV__ flag"
            value="True in Metro debug builds — false in production Hermes bundles"
          />
          <InfoRow multiline
            label="Debugger attached"
            value="Use global.__fbBatchedBridge or performance timing heuristics"
          />
          <InfoRow multiline
            label="Frida detection"
            value="Check for frida-agent in loaded libraries or unexpected ports"
          />
          <InfoRow multiline
            label="ADB detection"
            value="Android — check if USB debugging is enabled via Settings.Global"
          />

          {/* EMULATOR DETECTION */}
          <SectionHeader title="EMULATOR DETECTION" />
          <InfoRow multiline
            label="react-native-device-info"
            value="DeviceInfo.isEmulator() — checks build props and hardware signals"
          />
          <InfoRow multiline
            label="Android signals"
            value="Build.FINGERPRINT contains generic/unknown, ro.kernel.qemu=1"
          />
          <InfoRow multiline
            label="iOS signals"
            value="Device model contains Simulator, no real sensors"
          />
          <InfoRow multiline
            label="Action"
            value="Warn user or restrict features on emulator in production builds"
            valueColor={colors.warningMain}
          />

          {/* ANTI-TAMPERING */}
          <SectionHeader title="ANTI-TAMPERING" />
          <InfoRow multiline
            label="Bundle integrity"
            value="Hash the JS bundle at startup and compare against known value"
          />
          <InfoRow multiline
            label="Native checks"
            value="Use Android SafetyNet / Play Integrity API for attestation"
          />
          <InfoRow multiline
            label="iOS App Attest"
            value="Apple DeviceCheck + App Attest API for device integrity"
          />
          <InfoRow multiline
            label="Repackaging detection"
            value="Check app signature matches expected signing certificate"
          />

          {/* SECURITY NOTES */}
          <SectionHeader title="SECURITY NOTES" />
          <InfoRow multiline
            label="Defence in depth"
            value="Obfuscation alone is insufficient — layer with pinning and jailbreak detection"
            valueColor={colors.warningMain}
          />
          <InfoRow multiline
            label="Determined attacker"
            value="A skilled attacker with enough time can reverse any mobile app"
            valueColor={colors.errorMain}
          />
          <InfoRow multiline
            label="Open source risk"
            value="If your app is open source, obfuscation provides minimal benefit"
            valueColor={colors.warningMain}
          />
          <InfoRow multiline
            label="Focus"
            value="Protect server-side secrets — never embed production keys in the bundle"
            valueColor={colors.successMain}
          />
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
