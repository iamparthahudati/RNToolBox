import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';

import Badge from '../../components/atoms/Badge';
import Chip from '../../components/atoms/Chip';
import Header from '../../components/atoms/Header';
import Icon from '@react-native-vector-icons/material-design-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../theme';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type BadgeVariant =
  | 'comingSoon'
  | 'success'
  | 'warning'
  | 'error'
  | 'new'
  | 'pro';
type OutlineTagColor = 'primary' | 'success' | 'warning' | 'error';
type StatusType = 'online' | 'away' | 'offline' | 'busy';

// ---------------------------------------------------------------------------
// Static data
// ---------------------------------------------------------------------------

const BADGE_VARIANTS: { variant: BadgeVariant; label: string }[] = [
  { variant: 'comingSoon', label: 'Coming Soon' },
  { variant: 'success', label: 'Success' },
  { variant: 'warning', label: 'Warning' },
  { variant: 'error', label: 'Error' },
  { variant: 'new', label: 'New' },
  { variant: 'pro', label: 'Pro' },
];

const NOTIFICATION_ITEMS: { icon: string; count: number; label: string }[] = [
  { icon: 'bell-outline', count: 3, label: 'Alerts' },
  { icon: 'email-outline', count: 12, label: 'Messages' },
  { icon: 'cart-outline', count: 99, label: 'Cart' },
  { icon: 'account-outline', count: 1, label: 'Profile' },
];

const CHIP_FILTERS = ['All', 'Design', 'React Native', 'TypeScript', 'Mobile'];

const STATUS_ITEMS: { label: string; status: StatusType }[] = [
  { label: 'Online', status: 'online' },
  { label: 'Away', status: 'away' },
  { label: 'Offline', status: 'offline' },
  { label: 'Busy', status: 'busy' },
];

const STATUS_COLORS: Record<StatusType, string> = {
  online: theme.colors.successMain,
  away: theme.colors.warningMain,
  offline: theme.colors.neutral400,
  busy: theme.colors.errorMain,
};

const OUTLINE_TAGS: { label: string; color: OutlineTagColor }[] = [
  { label: 'Primary', color: 'primary' },
  { label: 'Success', color: 'success' },
  { label: 'Warning', color: 'warning' },
  { label: 'Error', color: 'error' },
];

const OUTLINE_TAG_COLORS: Record<OutlineTagColor, string> = {
  primary: theme.colors.primary600,
  success: theme.colors.successMain,
  warning: theme.colors.warningMain,
  error: theme.colors.errorMain,
};

const INITIAL_TAGS = [
  { id: '1', label: 'React Native', color: theme.colors.primary600 },
  { id: '2', label: 'TypeScript', color: theme.colors.successMain },
  { id: '3', label: 'Design System', color: theme.colors.warningMain },
  { id: '4', label: 'Mobile', color: theme.colors.errorMain },
  { id: '5', label: 'Open Source', color: theme.colors.infoMain },
];

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------

const BadgesScreen: React.FC = () => {
  const [activeChip, setActiveChip] = useState<string>('All');
  const [tags, setTags] = useState(INITIAL_TAGS);

  const removeTag = (id: string) => {
    setTags(prev => prev.filter(t => t.id !== id));
  };

  const formatCount = (count: number): string =>
    count > 99 ? '99+' : String(count);

  return (
    <SafeAreaView style={styles.root}>
      <Header title="Badges & Tags" />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ---------------------------------------------------------------- */}
        {/* 1. Badge Variants                                                 */}
        {/* ---------------------------------------------------------------- */}
        <Text style={styles.sectionTitle}>Badge Variants</Text>
        <View style={styles.card}>
          <View style={styles.wrapRow}>
            {BADGE_VARIANTS.map(({ variant, label }) => (
              <Badge key={variant} variant={variant} label={label} />
            ))}
          </View>
        </View>

        {/* ---------------------------------------------------------------- */}
        {/* 2. Badge with Dot                                                 */}
        {/* ---------------------------------------------------------------- */}
        <Text style={styles.sectionTitle}>Badge with Dot</Text>
        <View style={styles.card}>
          <View style={styles.wrapRow}>
            {BADGE_VARIANTS.map(({ variant, label }) => (
              <Badge key={variant} variant={variant} label={label} showDot />
            ))}
          </View>
        </View>

        {/* ---------------------------------------------------------------- */}
        {/* 3. Notification Badges                                            */}
        {/* ---------------------------------------------------------------- */}
        <Text style={styles.sectionTitle}>Notification Badges</Text>
        <View style={styles.card}>
          <View style={styles.notifRow}>
            {NOTIFICATION_ITEMS.map(item => (
              <View key={item.icon} style={styles.notifItem}>
                <View style={styles.notifIconWrap}>
                  <Icon
                    name={item.icon}
                    size={28}
                    color={theme.colors.light.textSecondary}
                  />
                  <View style={styles.notifBadge}>
                    <Text style={styles.notifBadgeText}>
                      {formatCount(item.count)}
                    </Text>
                  </View>
                </View>
                <Text style={styles.notifLabel}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ---------------------------------------------------------------- */}
        {/* 4. Tags (removable)                                               */}
        {/* ---------------------------------------------------------------- */}
        <Text style={styles.sectionTitle}>Tags</Text>
        <View style={styles.card}>
          {tags.length === 0 ? (
            <Text style={styles.emptyText}>
              All tags removed. Restart to reset.
            </Text>
          ) : (
            <View style={styles.wrapRow}>
              {tags.map(tag => (
                <View
                  key={tag.id}
                  style={[
                    styles.tag,
                    {
                      backgroundColor: tag.color + '1A',
                      borderColor: tag.color + '40',
                    },
                  ]}
                >
                  <Text style={[styles.tagLabel, { color: tag.color }]}>
                    {tag.label}
                  </Text>
                  <Pressable
                    onPress={() => removeTag(tag.id)}
                    hitSlop={6}
                    style={styles.tagRemove}
                  >
                    <Icon name="close" size={12} color={tag.color} />
                  </Pressable>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* ---------------------------------------------------------------- */}
        {/* 5. Chips (Interactive)                                            */}
        {/* ---------------------------------------------------------------- */}
        <Text style={styles.sectionTitle}>Chips (Interactive)</Text>
        <View style={styles.card}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipScroll}
          >
            {CHIP_FILTERS.map(label => (
              <Chip
                key={label}
                label={label}
                active={activeChip === label}
                onPress={() => setActiveChip(label)}
              />
            ))}
          </ScrollView>
          <Text style={styles.chipHint}>
            Active filter: <Text style={styles.chipHintBold}>{activeChip}</Text>
          </Text>
        </View>

        {/* ---------------------------------------------------------------- */}
        {/* 6. Status Indicators                                              */}
        {/* ---------------------------------------------------------------- */}
        <Text style={styles.sectionTitle}>Status Indicators</Text>
        <View style={styles.card}>
          <View style={styles.statusGrid}>
            {STATUS_ITEMS.map(({ label, status }) => (
              <View key={status} style={styles.statusRow}>
                <View
                  style={[
                    styles.statusDot,
                    { backgroundColor: STATUS_COLORS[status] },
                  ]}
                />
                <Text style={styles.statusLabel}>{label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ---------------------------------------------------------------- */}
        {/* 7. Outline Tags                                                   */}
        {/* ---------------------------------------------------------------- */}
        <Text style={styles.sectionTitle}>Outline Tags</Text>
        <View style={styles.card}>
          <View style={styles.wrapRow}>
            {OUTLINE_TAGS.map(({ label, color }) => (
              <View
                key={color}
                style={[
                  styles.outlineTag,
                  { borderColor: OUTLINE_TAG_COLORS[color] },
                ]}
              >
                <Text
                  style={[
                    styles.outlineTagLabel,
                    { color: OUTLINE_TAG_COLORS[color] },
                  ]}
                >
                  {label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default BadgesScreen;

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.light.background,
  },
  content: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },

  // Section title — matches SelectionScreen pattern
  sectionTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: '700',
    color: theme.colors.light.textPrimary,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },

  // Card container
  card: {
    backgroundColor: theme.colors.light.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.light.border,
    padding: theme.spacing.lg,
  },

  // Flex-wrap row
  wrapRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  // ── Notification badges ──────────────────────────────────────────────────
  notifRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
  },
  notifItem: {
    alignItems: 'center',
    gap: 8,
  },
  notifIconWrap: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: theme.colors.errorMain,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: theme.colors.light.surface,
  },
  notifBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: theme.colors.white,
    lineHeight: 12,
  },
  notifLabel: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.light.textSecondary,
    textAlign: 'center',
  },

  // ── Removable tags ───────────────────────────────────────────────────────
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    paddingVertical: 5,
    paddingLeft: 10,
    paddingRight: 6,
    gap: 4,
  },
  tagLabel: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: '500',
  },
  tagRemove: {
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.light.textTertiary,
    textAlign: 'center',
    paddingVertical: theme.spacing.sm,
  },

  // ── Chips ────────────────────────────────────────────────────────────────
  chipScroll: {
    gap: 8,
    paddingBottom: 2,
  },
  chipHint: {
    marginTop: theme.spacing.md,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.light.textSecondary,
  },
  chipHintBold: {
    fontWeight: '600',
    color: theme.colors.light.textPrimary,
  },

  // ── Status indicators ────────────────────────────────────────────────────
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minWidth: 100,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusLabel: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.light.textPrimary,
    fontWeight: '500',
  },

  // ── Outline tags ─────────────────────────────────────────────────────────
  outlineTag: {
    borderWidth: 1.5,
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 14,
  },
  outlineTagLabel: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: '600',
  },

  bottomSpacer: {
    height: theme.spacing.xl,
  },
});
