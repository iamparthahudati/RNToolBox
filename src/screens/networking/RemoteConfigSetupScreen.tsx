import Clipboard from '@react-native-clipboard/clipboard';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Header from '../../components/atoms/Header';
import SectionHeader from '../../components/molecules/SectionHeader';
import { RootStackParamList } from '../../navigation/types';
import { theme } from '../../theme';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Props = NativeStackScreenProps<
  RootStackParamList,
  'NetworkingRemoteConfigSetup'
>;

type ValueType = 'string' | 'boolean' | 'number';

interface ConfigKey {
  key: string;
  label: string;
  type: ValueType;
  values: {
    development: string;
    staging: string;
    production: string;
  };
}

type EnvName = 'development' | 'staging' | 'production';

// ---------------------------------------------------------------------------
// Config reference data
// ---------------------------------------------------------------------------

const CONFIG_KEYS: ConfigKey[] = [
  {
    key: 'welcome_message',
    label: 'Welcome Message',
    type: 'string',
    values: {
      development: 'Welcome to RNToolBox [DEV]',
      staging: 'Welcome to RNToolBox [STAGING]',
      production: 'Welcome to RNToolBox',
    },
  },
  {
    key: 'maintenance_mode',
    label: 'Maintenance Mode',
    type: 'boolean',
    values: {
      development: 'false',
      staging: 'false',
      production: 'false',
    },
  },
  {
    key: 'max_retry_count',
    label: 'Max Retry Count',
    type: 'number',
    values: {
      development: '5',
      staging: '3',
      production: '3',
    },
  },
  {
    key: 'feature_banner_enabled',
    label: 'Feature Banner',
    type: 'boolean',
    values: {
      development: 'true',
      staging: 'true',
      production: 'false',
    },
  },
  {
    key: 'api_base_url',
    label: 'API Base URL',
    type: 'string',
    values: {
      development: 'https://dev-api.example.com',
      staging: 'https://staging-api.example.com',
      production: 'https://api.example.com',
    },
  },
  {
    key: 'min_app_version',
    label: 'Min App Version',
    type: 'string',
    values: {
      development: '1.0.0',
      staging: '1.0.0',
      production: '1.0.0',
    },
  },
];

const ENV_LABELS: Record<EnvName, string> = {
  development: 'DEV',
  staging: 'STAGING',
  production: 'PROD',
};

const ENV_FIREBASE: Record<EnvName, string> = {
  development: 'rntollbox',
  staging: 'rntoolbox-qa',
  production: 'rntollbox',
};

const ENV_COLORS: Record<EnvName, string> = {
  development: '#2563EB',
  staging: '#D97706',
  production: '#16A34A',
};

const TYPE_COLORS: Record<ValueType, string> = {
  string: '#7C3AED',
  boolean: '#0891B2',
  number: '#B45309',
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function buildJsonBlock(env: EnvName): string {
  const obj: Record<string, string> = {};
  CONFIG_KEYS.forEach(k => {
    obj[k.key] = k.values[env];
  });
  return JSON.stringify(obj, null, 2);
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function CopyButton({
  text,
  label = 'Copy',
}: {
  text: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    Clipboard.setString(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <TouchableOpacity
      style={[styles.copyBtn, copied && styles.copyBtnCopied]}
      onPress={handleCopy}
      activeOpacity={0.7}
    >
      <Text style={[styles.copyBtnText, copied && styles.copyBtnTextCopied]}>
        {copied ? 'Copied' : label}
      </Text>
    </TouchableOpacity>
  );
}

function TypeBadge({ type }: { type: ValueType }) {
  return (
    <View
      style={[styles.typeBadge, { backgroundColor: TYPE_COLORS[type] + '18' }]}
    >
      <Text style={[styles.typeBadgeText, { color: TYPE_COLORS[type] }]}>
        {type}
      </Text>
    </View>
  );
}

function EnvTab({
  env,
  active,
  onPress,
}: {
  env: EnvName;
  active: boolean;
  onPress: () => void;
}) {
  const color = ENV_COLORS[env];
  return (
    <TouchableOpacity
      style={[
        styles.envTab,
        active && { backgroundColor: color, borderColor: color },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.envTabText, active && styles.envTabTextActive]}>
        {ENV_LABELS[env]}
      </Text>
    </TouchableOpacity>
  );
}

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------

export default function RemoteConfigSetupScreen(
  _props: Props,
): React.JSX.Element {
  const currentEnv: EnvName = 'production';
  const [selectedEnv, setSelectedEnv] = useState<EnvName>(currentEnv);

  const envColor = ENV_COLORS[selectedEnv];
  const firebaseProject = ENV_FIREBASE[selectedEnv];
  const jsonBlock = buildJsonBlock(selectedEnv);

  return (
    <SafeAreaView style={styles.root}>
      <Header title="Remote Config Setup" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Current build banner */}
        <View style={styles.buildBanner}>
          <View style={styles.buildBannerLeft}>
            <Text style={styles.buildBannerLabel}>Running build</Text>
            <View
              style={[
                styles.currentEnvBadge,
                { backgroundColor: ENV_COLORS[currentEnv] },
              ]}
            >
              <Text style={styles.currentEnvBadgeText}>
                {ENV_LABELS[currentEnv]}
              </Text>
            </View>
          </View>
          <Text style={styles.buildBannerProject}>
            Firebase: {ENV_FIREBASE[currentEnv]}
          </Text>
        </View>

        {/* Env selector */}
        <SectionHeader title="SELECT ENVIRONMENT TO CONFIGURE" />
        <View style={styles.envTabRow}>
          {(['development', 'staging', 'production'] as EnvName[]).map(env => (
            <EnvTab
              key={env}
              env={env}
              active={selectedEnv === env}
              onPress={() => setSelectedEnv(env)}
            />
          ))}
        </View>

        {/* Firebase project info */}
        <View style={[styles.projectCard, { borderLeftColor: envColor }]}>
          <Text style={styles.projectCardLabel}>Firebase Console Project</Text>
          <Text style={[styles.projectCardValue, { color: envColor }]}>
            {firebaseProject}
          </Text>
          <Text style={styles.projectCardHint}>
            console.firebase.google.com → select "{firebaseProject}" → Remote
            Config → Add parameters below
          </Text>
        </View>

        {/* Keys table */}
        <SectionHeader title="PARAMETERS TO ADD" />
        {CONFIG_KEYS.map((item, index) => (
          <View
            key={item.key}
            style={[
              styles.keyRow,
              index === CONFIG_KEYS.length - 1 && styles.keyRowLast,
            ]}
          >
            <View style={styles.keyRowTop}>
              <View style={styles.keyRowTopLeft}>
                <Text style={styles.keyName}>{item.key}</Text>
                <TypeBadge type={item.type} />
              </View>
              <CopyButton text={item.key} label="Copy key" />
            </View>
            <View style={styles.keyRowBottom}>
              <View style={styles.valueBox}>
                <Text style={styles.valueLabel}>Value</Text>
                <Text style={styles.valueText}>{item.values[selectedEnv]}</Text>
              </View>
              <CopyButton text={item.values[selectedEnv]} label="Copy value" />
            </View>
          </View>
        ))}

        {/* JSON block */}
        <SectionHeader title="COPY ALL AS JSON" />
        <View style={styles.jsonCard}>
          <View style={styles.jsonCardHeader}>
            <Text style={styles.jsonCardTitle}>
              {ENV_LABELS[selectedEnv]} config block
            </Text>
            <CopyButton text={jsonBlock} label="Copy JSON" />
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.jsonScroll}
          >
            <Text style={styles.jsonText}>{jsonBlock}</Text>
          </ScrollView>
        </View>

        {/* Steps */}
        <SectionHeader title="HOW TO ADD IN FIREBASE CONSOLE" />
        <View style={styles.stepsCard}>
          {[
            `Open console.firebase.google.com and select the "${firebaseProject}" project.`,
            'Navigate to Remote Config in the left sidebar under "Engage".',
            'Click "Add parameter" for each key in the table above.',
            'Enter the parameter key exactly as shown (case-sensitive).',
            'Set the data type (String / Boolean / Number) as indicated.',
            'Paste the value for this environment and click "Save".',
            'After adding all parameters, click "Publish changes" (top right).',
            'In the app, go back to Remote Config and tap "Fetch & Activate".',
          ].map((step, i) => (
            <View key={i} style={styles.step}>
              <View style={[styles.stepNumber, { backgroundColor: envColor }]}>
                <Text style={styles.stepNumberText}>{i + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: theme.spacing.xxl,
  },

  // Build banner
  buildBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  buildBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  buildBannerLabel: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.weights.medium as '500',
  },
  currentEnvBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: 4,
  },
  currentEnvBadgeText: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.white,
    fontWeight: theme.typography.weights.bold as '700',
    letterSpacing: 0.5,
  },
  buildBannerProject: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.textSecondary,
  },

  // Env tabs
  envTabRow: {
    flexDirection: 'row',
    marginHorizontal: theme.spacing.lg,
    marginVertical: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  envTab: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    alignItems: 'center',
  },
  envTabText: {
    fontSize: theme.typography.sizes.xs,
    fontWeight: theme.typography.weights.bold as '700',
    color: theme.colors.textSecondary,
    letterSpacing: 0.5,
  },
  envTabTextActive: {
    color: theme.colors.white,
  },

  // Project card
  projectCard: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderLeftWidth: 4,
    gap: 4,
  },
  projectCardLabel: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.weights.medium as '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  projectCardValue: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold as '700',
  },
  projectCardHint: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.textSecondary,
    lineHeight: 16,
    marginTop: 2,
  },

  // Key rows
  keyRow: {
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  keyRowLast: {
    borderBottomWidth: 0,
  },
  keyRowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  keyRowTopLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    flex: 1,
  },
  keyName: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.semibold as '600',
    color: theme.colors.textPrimary,
    fontFamily: 'Courier',
  },
  keyRowBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
  },
  valueBox: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: 6,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  valueLabel: {
    fontSize: 10,
    color: theme.colors.textDisabled,
    fontWeight: theme.typography.weights.medium as '500',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 1,
  },
  valueText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textPrimary,
    fontWeight: theme.typography.weights.medium as '500',
  },

  // Type badge
  typeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: theme.typography.weights.bold as '700',
    letterSpacing: 0.3,
  },

  // Copy button
  copyBtn: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  copyBtnCopied: {
    borderColor: theme.colors.success,
    backgroundColor: '#F0FDF4',
  },
  copyBtnText: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.weights.medium as '500',
  },
  copyBtnTextCopied: {
    color: theme.colors.success,
  },

  // JSON card
  jsonCard: {
    marginHorizontal: theme.spacing.lg,
    marginVertical: theme.spacing.md,
    backgroundColor: '#1E1E2E',
    borderRadius: 8,
    overflow: 'hidden',
  },
  jsonCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#2E2E3E',
  },
  jsonCardTitle: {
    fontSize: theme.typography.sizes.xs,
    color: '#A0A0B0',
    fontWeight: theme.typography.weights.medium as '500',
    letterSpacing: 0.3,
  },
  jsonScroll: {
    padding: theme.spacing.md,
  },
  jsonText: {
    fontSize: 12,
    color: '#A8FF78',
    fontFamily: 'Courier',
    lineHeight: 20,
  },

  // Steps
  stepsCard: {
    marginHorizontal: theme.spacing.lg,
    marginVertical: theme.spacing.md,
    backgroundColor: theme.colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    gap: theme.spacing.md,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
  },
  stepNumber: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 1,
  },
  stepNumberText: {
    fontSize: 11,
    color: theme.colors.white,
    fontWeight: theme.typography.weights.bold as '700',
  },
  stepText: {
    flex: 1,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
});
