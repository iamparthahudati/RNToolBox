import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/atoms/Header';
import InfoRow from '../../components/molecules/InfoRow';
import SectionHeader from '../../components/molecules/SectionHeader';
import { useTheme } from '../../theme';

export default function ScreenshotPreventionScreen(): React.JSX.Element {
  const { colors, spacing } = useTheme();

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]}>
      <Header title="Screenshot Prevention" />
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: spacing.xxl },
        ]}
      >
        <View>
          <SectionHeader title="WHAT IS IT" />
          <InfoRow multiline
            label="Purpose"
            value="Prevent users or malware from capturing screen content via screenshots or recordings"
            valueColor={colors.successMain}
          />
          <InfoRow multiline
            label="Scope"
            value="Applies to both manual screenshots and programmatic screen capture"
            valueColor={colors.successMain}
          />
          <InfoRow multiline
            label="Coverage"
            value="Protects PII, financial data, auth tokens visible on screen"
            valueColor={colors.successMain}
          />
        </View>

        <View>
          <SectionHeader title="ANDROID IMPLEMENTATION" />
          <InfoRow multiline
            label="API"
            value="WindowManager.LayoutParams.FLAG_SECURE"
            valueColor={colors.successMain}
          />
          <InfoRow multiline
            label="Effect"
            value="Renders screen black in screenshots and recent apps"
            valueColor={colors.successMain}
          />
          <InfoRow multiline
            label="Library"
            value="react-native-flag-secure-android"
            valueColor={colors.successMain}
          />
          <InfoRow multiline
            label="Usage"
            value="FlagSecure.activate() / FlagSecure.deactivate()"
            valueColor={colors.successMain}
          />
          <InfoRow multiline
            label="Limitation"
            value="Does not block screen recording via ADB or root access"
            valueColor={colors.warningMain}
          />
        </View>

        <View>
          <SectionHeader title="IOS IMPLEMENTATION" />
          <InfoRow multiline
            label="Native API"
            value="No direct FLAG_SECURE equivalent on iOS"
            valueColor={colors.warningMain}
          />
          <InfoRow multiline
            label="Workaround"
            value="Add a UITextField with isSecureTextEntry=true — iOS blurs the screen in recordings"
            valueColor={colors.warningMain}
          />
          <InfoRow multiline
            label="Library"
            value="react-native-screenshot-prevent"
            valueColor={colors.successMain}
          />
          <InfoRow multiline
            label="Screen recording detection"
            value="UIScreen.captureDidChangeNotification — detect and blur/overlay"
            valueColor={colors.warningMain}
          />
          <InfoRow multiline
            label="Screenshot detection"
            value="UIApplication.userDidTakeScreenshotNotification — notify but cannot prevent"
            valueColor={colors.warningMain}
          />
        </View>

        <View>
          <SectionHeader title="PLATFORM COMPARISON" />
          <InfoRow multiline
            label="Android prevention"
            value="Full black screen — hard block"
            valueColor={colors.successMain}
          />
          <InfoRow multiline
            label="iOS prevention"
            value="Blur overlay — soft block"
            valueColor={colors.warningMain}
          />
          <InfoRow multiline
            label="Android recording"
            value="Blocked by FLAG_SECURE"
            valueColor={colors.successMain}
          />
          <InfoRow multiline
            label="iOS recording"
            value="Can only detect, not fully block"
            valueColor={colors.warningMain}
          />
          <InfoRow multiline
            label="Reliability"
            value="Android more reliable than iOS for prevention"
            valueColor={colors.successMain}
          />
        </View>

        <View>
          <SectionHeader title="SECURITY NOTES" />
          <InfoRow multiline
            label="External capture"
            value="Physical camera pointed at screen cannot be blocked"
            valueColor={colors.errorMain}
          />
          <InfoRow multiline
            label="Rooted Android"
            value="FLAG_SECURE can be bypassed on rooted devices"
            valueColor={colors.errorMain}
          />
          <InfoRow multiline
            label="Recommendation"
            value="Combine with app masking and jailbreak detection"
            valueColor={colors.warningMain}
          />
          <InfoRow multiline
            label="Selective use"
            value="Apply only to sensitive screens to avoid UX friction"
            valueColor={colors.warningMain}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
