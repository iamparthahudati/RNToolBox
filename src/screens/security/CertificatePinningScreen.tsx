import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/atoms/Header';
import InfoRow from '../../components/molecules/InfoRow';
import SectionHeader from '../../components/molecules/SectionHeader';
import { useTheme } from '../../theme';

interface InfoRowData {
  label: string;
  value: string;
  valueColor?: string;
}

interface Section {
  title: string;
  rows: InfoRowData[];
}

export default function CertificatePinningScreen(): React.JSX.Element {
  const { colors, spacing } = useTheme();

  const SECTIONS: Section[] = [
    {
      title: 'WHAT IS IT',
      rows: [
        {
          label: 'Definition',
          value:
            'Hardcode expected TLS certificate or public key in the app to reject unexpected certificates',
          valueColor: colors.textPrimary,
        },
        {
          label: 'Threat mitigated',
          value: 'Man-in-the-Middle (MITM) attacks using rogue CA certificates',
          valueColor: colors.successMain,
        },
        {
          label: 'Without pinning',
          value:
            'Any cert signed by a trusted CA is accepted — including attacker-installed ones',
          valueColor: colors.errorMain,
        },
      ],
    },
    {
      title: 'HOW IT WORKS',
      rows: [
        {
          label: 'Step 1',
          value: 'App initiates HTTPS request to server',
          valueColor: colors.textPrimary,
        },
        {
          label: 'Step 2',
          value: 'Server presents its TLS certificate',
          valueColor: colors.textPrimary,
        },
        {
          label: 'Step 3',
          value:
            'App compares certificate/public key hash against pinned value',
          valueColor: colors.textPrimary,
        },
        {
          label: 'Step 4',
          value: 'Match: connection proceeds. Mismatch: connection rejected',
          valueColor: colors.successMain,
        },
        {
          label: 'Pin type',
          value:
            'Public key pin preferred over certificate pin — survives cert renewal',
          valueColor: colors.successMain,
        },
      ],
    },
    {
      title: 'REACT NATIVE IMPLEMENTATION',
      rows: [
        {
          label: 'Library',
          value: 'react-native-ssl-pinning',
          valueColor: colors.textPrimary,
        },
        {
          label: 'Method',
          value: 'OkHttp (Android) + TrustKit (iOS) under the hood',
          valueColor: colors.textPrimary,
        },
        {
          label: 'Config',
          value: 'Pass SHA-256 hash of server public key in fetch options',
          valueColor: colors.textPrimary,
        },
        {
          label: 'Backup pins',
          value: 'Always include at least 2 pins — primary + backup',
          valueColor: colors.warningMain,
        },
        {
          label: 'Certificate format',
          value: 'Base64-encoded SHA-256 of SubjectPublicKeyInfo',
          valueColor: colors.textPrimary,
        },
      ],
    },
    {
      title: 'ANDROID NETWORK SECURITY CONFIG',
      rows: [
        {
          label: 'File',
          value: 'android/app/src/main/res/xml/network_security_config.xml',
          valueColor: colors.textPrimary,
        },
        {
          label: 'Scope',
          value: 'Can pin per-domain without a library',
          valueColor: colors.successMain,
        },
        {
          label: 'Debug override',
          value: 'Allow cleartext or custom CAs in debug builds only',
          valueColor: colors.warningMain,
        },
        {
          label: 'Enforcement',
          value: 'Enforced by Android OS — no bypass without root',
          valueColor: colors.successMain,
        },
      ],
    },
    {
      title: 'IOS ATS',
      rows: [
        {
          label: 'Framework',
          value: 'App Transport Security enforces HTTPS by default',
          valueColor: colors.successMain,
        },
        {
          label: 'Pinning',
          value: 'Use TrustKit or NSURLSession delegate for pinning',
          valueColor: colors.textPrimary,
        },
        {
          label: 'Bypass risk',
          value:
            'iOS pinning can be bypassed with SSL Kill Switch on jailbroken devices',
          valueColor: colors.errorMain,
        },
      ],
    },
    {
      title: 'SECURITY NOTES',
      rows: [
        {
          label: 'Pin rotation',
          value: 'Plan certificate rotation before pins expire',
          valueColor: colors.warningMain,
        },
        {
          label: 'Backup pins',
          value:
            'Failure to include backup pins causes outages on cert renewal',
          valueColor: colors.errorMain,
        },
        {
          label: 'Dynamic pinning',
          value: 'Fetch pins from server — but bootstrap pin still needed',
          valueColor: colors.warningMain,
        },
        {
          label: 'Bypass tools',
          value:
            'SSL Kill Switch 2, Frida, objection can bypass pinning on jailbroken devices',
          valueColor: colors.errorMain,
        },
      ],
    },
  ];

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]}>
      <Header title="Certificate Pinning" />
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
              <InfoRow multiline
                key={row.label}
                label={row.label}
                value={row.value}
                valueColor={row.valueColor}
              />
            ))}
          </View>
        ))}
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
