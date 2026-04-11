import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/atoms/Header';
import InfoRow from '../../components/molecules/InfoRow';
import SectionHeader from '../../components/molecules/SectionHeader';
import { useTheme } from '../../theme';

interface SectionRow {
  label: string;
  value: string;
  valueColor?: string;
}

interface Section {
  title: string;
  rows: SectionRow[];
}

export default function AppMaskingScreen(): React.JSX.Element {
  const { colors, spacing } = useTheme();

  const SECTIONS: Section[] = [
    {
      title: 'WHAT IS IT',
      rows: [
        {
          label: 'What it does',
          value:
            'Overlays a blank screen when app goes to background to prevent OS task switcher from capturing sensitive content',
          valueColor: colors.successMain,
        },
        {
          label: 'Trigger states',
          value: 'AppState: inactive + background',
        },
        {
          label: 'Dismissal',
          value: 'Auto-removed when app returns to active state',
          valueColor: colors.successMain,
        },
      ],
    },
    {
      title: 'HOW IT WORKS',
      rows: [
        {
          label: 'Implementation',
          value: 'AppState.addEventListener listens for state changes',
        },
        {
          label: 'Overlay',
          value:
            'Full-screen View rendered above all content via natural z-order stacking',
        },
        {
          label: 'Performance',
          value: 'Renders null when inactive — zero overhead in normal use',
          valueColor: colors.successMain,
        },
        {
          label: 'Touch blocking',
          value:
            'pointerEvents=none prevents accidental interaction during transition',
        },
      ],
    },
    {
      title: 'PLATFORM BEHAVIOUR',
      rows: [
        {
          label: 'iOS',
          value: 'Overlay shown on both inactive and background states',
        },
        {
          label: 'Android',
          value: 'Overlay shown on background state; inactive is brief',
        },
        {
          label: 'Task Switcher',
          value:
            'OS screenshot taken during inactive — overlay must appear before that',
          valueColor: colors.warningMain,
        },
      ],
    },
    {
      title: 'SECURITY NOTES',
      rows: [
        {
          label: 'Limitation',
          value: 'Does not prevent screen recording via external tools',
          valueColor: colors.errorMain,
        },
        {
          label: 'Recommendation',
          value: 'Combine with screenshot prevention for full coverage',
          valueColor: colors.warningMain,
        },
        {
          label: 'Sensitive screens',
          value:
            'Apply selectively to screens with PII or financial data if full-app masking is too aggressive',
          valueColor: colors.warningMain,
        },
      ],
    },
  ];

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]}>
      <Header title="App Masking" />
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
