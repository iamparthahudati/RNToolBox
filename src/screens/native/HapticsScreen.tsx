import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useRef, useState } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/atoms/Header';
import { RootStackParamList } from '../../navigation/types';
import { theme } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'NativeHaptics'>;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type PatternItem = {
  label: string;
  description: string;
  pattern: number | number[];
  repeat?: boolean;
  tag: string;
};

type FeedbackItem = {
  label: string;
  description: string;
  duration: number;
  tag: string;
};

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const IMPACT_PATTERNS: FeedbackItem[] = [
  {
    label: 'Light',
    description: 'Short 30ms pulse — subtle tap feedback',
    duration: 30,
    tag: '30ms',
  },
  {
    label: 'Medium',
    description: 'Standard 60ms pulse — button press feedback',
    duration: 60,
    tag: '60ms',
  },
  {
    label: 'Heavy',
    description: 'Strong 100ms pulse — confirmation feedback',
    duration: 100,
    tag: '100ms',
  },
];

const NOTIFICATION_PATTERNS: PatternItem[] = [
  {
    label: 'Success',
    description: 'Two quick pulses — task completed',
    pattern: [0, 60, 80, 60],
    tag: '2 pulses',
  },
  {
    label: 'Warning',
    description: 'Three pulses — attention needed',
    pattern: [0, 60, 60, 60, 60, 60],
    tag: '3 pulses',
  },
  {
    label: 'Error',
    description: 'Long-short-long — something went wrong',
    pattern: [0, 120, 60, 40, 60, 120],
    tag: 'long-short-long',
  },
];

const RHYTHM_PATTERNS: PatternItem[] = [
  {
    label: 'Double Tap',
    description: 'Two rapid taps',
    pattern: [0, 50, 50, 50],
    tag: '2x tap',
  },
  {
    label: 'Triple Tap',
    description: 'Three rapid taps',
    pattern: [0, 50, 50, 50, 50, 50],
    tag: '3x tap',
  },
  {
    label: 'Heartbeat',
    description: 'Lub-dub rhythm',
    pattern: [0, 80, 60, 40, 200, 80, 60, 40],
    tag: 'lub-dub',
  },
  {
    label: 'SOS',
    description: 'Morse code SOS pattern',
    pattern: [
      0,
      100,
      100,
      100,
      100,
      100,
      100, // S (· · ·)
      200,
      300,
      100,
      300,
      100,
      300,
      100, // O (— — —)
      200,
      100,
      100,
      100,
      100,
      100, // S (· · ·)
    ],
    tag: 'morse',
  },
  {
    label: 'Tick',
    description: 'Repeating metronome tick — tap again to stop',
    pattern: [0, 30, 470],
    repeat: true,
    tag: 'repeat',
  },
];

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

const SectionTitle = ({ label }: { label: string }) => (
  <Text style={styles.sectionTitle}>{label}</Text>
);

const Tag = ({ label }: { label: string }) => (
  <View style={styles.tag}>
    <Text style={styles.tagText}>{label}</Text>
  </View>
);

type HapticCardProps = {
  label: string;
  description: string;
  tag: string;
  active?: boolean;
  onPress: () => void;
};

const HapticCard = ({
  label,
  description,
  tag,
  active = false,
  onPress,
}: HapticCardProps) => (
  <TouchableOpacity
    style={[styles.card, active && styles.cardActive]}
    onPress={onPress}
    activeOpacity={0.75}
  >
    <View style={styles.cardHeader}>
      <Text style={[styles.cardLabel, active && styles.cardLabelActive]}>
        {label}
      </Text>
      <Tag label={tag} />
    </View>
    <Text style={styles.cardDescription}>{description}</Text>
    {active && <Text style={styles.activeHint}>Vibrating — tap to stop</Text>}
  </TouchableOpacity>
);

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------

export default function HapticsScreen(_props: Props) {
  const [activeRepeat, setActiveRepeat] = useState<string | null>(null);
  const [lastFired, setLastFired] = useState<string | null>(null);
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      Vibration.cancel();
      if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    };
  }, []);

  const showFeedback = (label: string) => {
    setLastFired(label);
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    feedbackTimer.current = setTimeout(() => setLastFired(null), 1200);
  };

  const handleImpact = (item: FeedbackItem) => {
    Vibration.cancel();
    setActiveRepeat(null);
    Vibration.vibrate(item.duration);
    showFeedback(item.label);
  };

  const handlePattern = (item: PatternItem) => {
    if (item.repeat) {
      if (activeRepeat === item.label) {
        Vibration.cancel();
        setActiveRepeat(null);
        return;
      }
      Vibration.cancel();
      setActiveRepeat(item.label);
      Vibration.vibrate(item.pattern as number[], true);
      return;
    }

    Vibration.cancel();
    setActiveRepeat(null);
    Vibration.vibrate(item.pattern as number[]);
    showFeedback(item.label);
  };

  const handleCancelAll = () => {
    Vibration.cancel();
    setActiveRepeat(null);
    setLastFired(null);
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <SafeAreaView style={styles.root}>
      <Header title="Haptics" />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Platform note */}
        <View style={styles.platformBanner}>
          <Text style={styles.platformBannerText}>
            {Platform.OS === 'ios'
              ? 'iOS — Vibration API used. For richer haptics (impact, selection, notification styles) add react-native-haptic-feedback.'
              : 'Android — Vibration API. Haptic intensity depends on device hardware.'}
          </Text>
        </View>

        {/* Last fired feedback */}
        {lastFired !== null && (
          <View style={styles.feedbackBanner}>
            <Text style={styles.feedbackBannerText}>Fired: {lastFired}</Text>
          </View>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* Impact                                                            */}
        {/* ---------------------------------------------------------------- */}
        <SectionTitle label="Impact Feedback" />
        <Text style={styles.sectionSubtitle}>
          Single-pulse vibrations of varying intensity
        </Text>
        {IMPACT_PATTERNS.map(item => (
          <HapticCard
            key={item.label}
            label={item.label}
            description={item.description}
            tag={item.tag}
            onPress={() => handleImpact(item)}
          />
        ))}

        {/* ---------------------------------------------------------------- */}
        {/* Notification                                                      */}
        {/* ---------------------------------------------------------------- */}
        <SectionTitle label="Notification Feedback" />
        <Text style={styles.sectionSubtitle}>
          Multi-pulse patterns for system events
        </Text>
        {NOTIFICATION_PATTERNS.map(item => (
          <HapticCard
            key={item.label}
            label={item.label}
            description={item.description}
            tag={item.tag}
            onPress={() => handlePattern(item)}
          />
        ))}

        {/* ---------------------------------------------------------------- */}
        {/* Rhythm Patterns                                                   */}
        {/* ---------------------------------------------------------------- */}
        <SectionTitle label="Rhythm Patterns" />
        <Text style={styles.sectionSubtitle}>
          Custom sequences and repeating patterns
        </Text>
        {RHYTHM_PATTERNS.map(item => (
          <HapticCard
            key={item.label}
            label={item.label}
            description={item.description}
            tag={item.tag}
            active={activeRepeat === item.label}
            onPress={() => handlePattern(item)}
          />
        ))}

        {/* ---------------------------------------------------------------- */}
        {/* Custom Builder                                                    */}
        {/* ---------------------------------------------------------------- */}
        <SectionTitle label="Pattern Reference" />
        <View style={styles.referenceCard}>
          <Text style={styles.referenceTitle}>
            How Vibration.vibrate() works
          </Text>
          <View style={styles.referenceRow}>
            <Text style={styles.referenceCode}>Vibration.vibrate(100)</Text>
            <Text style={styles.referenceDesc}>Single pulse, 100ms</Text>
          </View>
          <View style={styles.referenceDivider} />
          <View style={styles.referenceRow}>
            <Text style={styles.referenceCode}>[0, 60, 80, 60]</Text>
            <Text style={styles.referenceDesc}>
              wait 0ms, buzz 60ms, wait 80ms, buzz 60ms
            </Text>
          </View>
          <View style={styles.referenceDivider} />
          <View style={styles.referenceRow}>
            <Text style={styles.referenceCode}>vibrate(pattern, true)</Text>
            <Text style={styles.referenceDesc}>Repeat until cancel()</Text>
          </View>
          <View style={styles.referenceDivider} />
          <View style={styles.referenceRow}>
            <Text style={styles.referenceCode}>Vibration.cancel()</Text>
            <Text style={styles.referenceDesc}>Stop any active vibration</Text>
          </View>
        </View>

        {/* Cancel button */}
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={handleCancelAll}
          activeOpacity={0.8}
        >
          <Text style={styles.cancelButtonText}>Stop All Vibrations</Text>
        </TouchableOpacity>
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
  content: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },

  // Platform banner
  platformBanner: {
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  platformBannerText: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.primary,
    lineHeight: 18,
  },

  // Feedback banner
  feedbackBanner: {
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    alignItems: 'center',
  },
  feedbackBannerText: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: '600',
    color: theme.colors.success,
  },

  // Section
  sectionTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xs,
  },
  sectionSubtitle: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },

  // Haptic card
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  cardActive: {
    borderColor: theme.colors.primary,
    backgroundColor: '#EFF6FF',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xs,
  },
  cardLabel: {
    fontSize: theme.typography.sizes.md,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  cardLabelActive: {
    color: theme.colors.primary,
  },
  cardDescription: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  activeHint: {
    fontSize: theme.typography.sizes.xs,
    fontWeight: '600',
    color: theme.colors.primary,
    marginTop: theme.spacing.xs,
  },

  // Tag pill
  tag: {
    backgroundColor: theme.colors.border,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },

  // Reference card
  referenceCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  referenceTitle: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  referenceRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  referenceDivider: {
    height: 1,
    backgroundColor: theme.colors.border,
  },
  referenceCode: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.error,
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    minWidth: 140,
  },
  referenceDesc: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.textSecondary,
    flex: 1,
    lineHeight: 18,
  },

  // Cancel button
  cancelButton: {
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: theme.colors.error,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  cancelButtonText: {
    fontSize: theme.typography.sizes.md,
    fontWeight: '700',
    color: theme.colors.error,
  },
});
