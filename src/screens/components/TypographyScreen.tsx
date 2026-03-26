import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/atoms/Header';
import { theme } from '../../theme';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const SectionTitle = ({ label }: { label: string }) => (
  <Text style={styles.sectionTitle}>{label}</Text>
);

const Row = ({ children }: { children: React.ReactNode }) => (
  <View style={styles.row}>{children}</View>
);

const Tag = ({ label }: { label: string }) => (
  <View style={styles.tag}>
    <Text style={styles.tagText}>{label}</Text>
  </View>
);

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------

export default function TypographyScreen() {
  return (
    <SafeAreaView style={styles.root}>
      <Header title="Typography" />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ---------------------------------------------------------------- */}
        {/* Font Sizes                                                        */}
        {/* ---------------------------------------------------------------- */}
        <SectionTitle label="Font Sizes" />
        <View style={styles.card}>
          {(
            [
              { token: 'xxl', size: theme.typography.sizes.xxl },
              { token: 'xl', size: theme.typography.sizes.xl },
              { token: 'lg', size: theme.typography.sizes.lg },
              { token: 'md', size: theme.typography.sizes.md },
              { token: 'sm', size: theme.typography.sizes.sm },
              { token: 'xs', size: theme.typography.sizes.xs },
            ] as const
          ).map(({ token, size }) => (
            <Row key={token}>
              <Tag label={`sizes.${token} · ${size}px`} />
              <Text style={[styles.sampleText, { fontSize: size }]}>
                The quick brown fox
              </Text>
            </Row>
          ))}
        </View>

        {/* ---------------------------------------------------------------- */}
        {/* Font Weights                                                      */}
        {/* ---------------------------------------------------------------- */}
        <SectionTitle label="Font Weights" />
        <View style={styles.card}>
          {(
            [
              { token: 'regular', weight: '400' },
              { token: 'medium', weight: '500' },
              { token: 'semibold', weight: '600' },
              { token: 'bold', weight: '700' },
            ] as const
          ).map(({ token, weight }) => (
            <Row key={token}>
              <Tag label={`${token} · ${weight}`} />
              <Text style={[styles.sampleText, { fontWeight: weight as any }]}>
                The quick brown fox
              </Text>
            </Row>
          ))}
        </View>

        {/* ---------------------------------------------------------------- */}
        {/* Line Height                                                       */}
        {/* ---------------------------------------------------------------- */}
        <SectionTitle label="Line Height" />
        <View style={styles.card}>
          <Row>
            <Tag label="Tight · 1.2" />
            <Text style={[styles.sampleText, styles.lineHeightTight]}>
              {'The quick brown fox\njumps over the lazy dog'}
            </Text>
          </Row>
          <Row>
            <Tag label="Normal · 1.5" />
            <Text style={[styles.sampleText, styles.lineHeightNormal]}>
              {'The quick brown fox\njumps over the lazy dog'}
            </Text>
          </Row>
          <Row>
            <Tag label="Relaxed · 1.8" />
            <Text style={[styles.sampleText, styles.lineHeightRelaxed]}>
              {'The quick brown fox\njumps over the lazy dog'}
            </Text>
          </Row>
        </View>

        {/* ---------------------------------------------------------------- */}
        {/* Letter Spacing                                                    */}
        {/* ---------------------------------------------------------------- */}
        <SectionTitle label="Letter Spacing" />
        {/* eslint-disable react-native/no-inline-styles */}
        <View style={styles.card}>
          <Row>
            <Tag label="Tight · -0.5" />
            <Text style={[styles.sampleText, { letterSpacing: -0.5 }]}>
              The quick brown fox
            </Text>
          </Row>
          <Row>
            <Tag label="Normal · 0" />
            <Text style={[styles.sampleText, { letterSpacing: 0 }]}>
              The quick brown fox
            </Text>
          </Row>
          <Row>
            <Tag label="Wide · 1.5" />
            <Text style={[styles.sampleText, { letterSpacing: 1.5 }]}>
              The quick brown fox
            </Text>
          </Row>
          <Row>
            <Tag label="Wider · 3" />
            <Text style={[styles.sampleText, { letterSpacing: 3 }]}>
              The quick brown fox
            </Text>
          </Row>
        </View>
        {/* eslint-enable react-native/no-inline-styles */}

        {/* ---------------------------------------------------------------- */}
        {/* Text Colors                                                       */}
        {/* ---------------------------------------------------------------- */}
        <SectionTitle label="Text Colors" />
        <View style={styles.card}>
          {(
            [
              { token: 'textPrimary', color: theme.colors.textPrimary },
              { token: 'textSecondary', color: theme.colors.textSecondary },
              { token: 'textDisabled', color: theme.colors.textDisabled },
              { token: 'primary', color: theme.colors.primary },
              { token: 'success', color: theme.colors.success },
              { token: 'warning', color: theme.colors.warning },
              { token: 'error', color: theme.colors.error },
            ] as const
          ).map(({ token, color }) => (
            <Row key={token}>
              <Tag label={token} />
              <Text style={[styles.sampleText, { color }]}>
                The quick brown fox
              </Text>
            </Row>
          ))}
        </View>

        {/* ---------------------------------------------------------------- */}
        {/* Text Transform                                                    */}
        {/* ---------------------------------------------------------------- */}
        <SectionTitle label="Text Transform" />
        {/* eslint-disable react-native/no-inline-styles */}
        <View style={styles.card}>
          <Row>
            <Tag label="uppercase" />
            <Text style={[styles.sampleText, { textTransform: 'uppercase' }]}>
              The quick brown fox
            </Text>
          </Row>
          <Row>
            <Tag label="lowercase" />
            <Text style={[styles.sampleText, { textTransform: 'lowercase' }]}>
              The Quick Brown Fox
            </Text>
          </Row>
          <Row>
            <Tag label="capitalize" />
            <Text style={[styles.sampleText, { textTransform: 'capitalize' }]}>
              the quick brown fox
            </Text>
          </Row>
          <Row>
            <Tag label="none" />
            <Text style={[styles.sampleText, { textTransform: 'none' }]}>
              The Quick Brown Fox
            </Text>
          </Row>
        </View>
        {/* eslint-enable react-native/no-inline-styles */}

        {/* ---------------------------------------------------------------- */}
        {/* Text Alignment                                                    */}
        {/* ---------------------------------------------------------------- */}
        <SectionTitle label="Text Alignment" />
        <View style={styles.card}>
          <View style={styles.alignBlock}>
            <Tag label="left" />
            <Text style={[styles.sampleText, styles.alignLeft]}>
              {'The quick brown fox\njumps over the lazy dog'}
            </Text>
          </View>
          <View style={styles.alignBlock}>
            <Tag label="center" />
            <Text style={[styles.sampleText, styles.alignCenter]}>
              {'The quick brown fox\njumps over the lazy dog'}
            </Text>
          </View>
          <View style={styles.alignBlock}>
            <Tag label="right" />
            <Text style={[styles.sampleText, styles.alignRight]}>
              {'The quick brown fox\njumps over the lazy dog'}
            </Text>
          </View>
          <View style={styles.alignBlock}>
            <Tag label="justify" />
            <Text style={[styles.sampleText, styles.alignJustify]}>
              The quick brown fox jumps over the lazy dog and runs away into the
              forest.
            </Text>
          </View>
        </View>

        {/* ---------------------------------------------------------------- */}
        {/* Text Decoration                                                   */}
        {/* ---------------------------------------------------------------- */}
        <SectionTitle label="Text Decoration" />
        {/* eslint-disable react-native/no-inline-styles */}
        <View style={styles.card}>
          <Row>
            <Tag label="underline" />
            <Text
              style={[styles.sampleText, { textDecorationLine: 'underline' }]}
            >
              The quick brown fox
            </Text>
          </Row>
          <Row>
            <Tag label="line-through" />
            <Text
              style={[
                styles.sampleText,
                { textDecorationLine: 'line-through' },
              ]}
            >
              The quick brown fox
            </Text>
          </Row>
          <Row>
            <Tag label="underline + line-through" />
            <Text
              style={[
                styles.sampleText,
                { textDecorationLine: 'underline line-through' },
              ]}
            >
              The quick brown fox
            </Text>
          </Row>
        </View>
        {/* eslint-enable react-native/no-inline-styles */}

        {/* ---------------------------------------------------------------- */}
        {/* Truncation                                                        */}
        {/* ---------------------------------------------------------------- */}
        <SectionTitle label="Truncation" />
        <View style={styles.card}>
          <View style={styles.alignBlock}>
            <Tag label="numberOfLines={1}" />
            <Text style={styles.sampleText} numberOfLines={1}>
              The quick brown fox jumps over the lazy dog and keeps running far
              away.
            </Text>
          </View>
          <View style={styles.alignBlock}>
            <Tag label="numberOfLines={2}" />
            <Text style={styles.sampleText} numberOfLines={2}>
              The quick brown fox jumps over the lazy dog and keeps running far
              away into the deep forest.
            </Text>
          </View>
          <View style={styles.alignBlock}>
            <Tag label='ellipsizeMode="head"' />
            <Text
              style={styles.sampleText}
              numberOfLines={1}
              ellipsizeMode="head"
            >
              The quick brown fox jumps over the lazy dog and keeps running far
              away.
            </Text>
          </View>
          <View style={styles.alignBlock}>
            <Tag label='ellipsizeMode="middle"' />
            <Text
              style={styles.sampleText}
              numberOfLines={1}
              ellipsizeMode="middle"
            >
              The quick brown fox jumps over the lazy dog and keeps running far
              away.
            </Text>
          </View>
        </View>

        {/* ---------------------------------------------------------------- */}
        {/* Real-world Styles                                                 */}
        {/* ---------------------------------------------------------------- */}
        <SectionTitle label="Real-world Styles" />
        <View style={styles.card}>
          <Text style={styles.rwHeading}>Screen Heading</Text>
          <Text style={styles.rwSubheading}>Section Subheading</Text>
          <Text style={styles.rwBody}>
            Body text used for paragraphs and descriptions. Readable at normal
            viewing distance with comfortable line height.
          </Text>
          <Text style={styles.rwCaption}>
            Caption · helper text · timestamps
          </Text>
          <Text style={styles.rwLabel}>SECTION LABEL</Text>
          <Text style={styles.rwLink}>Tappable link text</Text>
          <Text style={styles.rwCode}>const value = 'monospace code';</Text>
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
  content: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },

  // Section title
  sectionTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.sm,
  },

  // Card wrapper
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.xs,
  },

  // Row layout (tag + sample side by side)
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    gap: theme.spacing.sm,
  },

  // Block layout (tag above sample — used for multi-line demos)
  alignBlock: {
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    gap: 4,
  },

  // Token tag pill
  tag: {
    backgroundColor: theme.colors.border,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 110,
    alignSelf: 'flex-start',
  },
  tagText: {
    fontSize: 10,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },

  // Default sample text
  sampleText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textPrimary,
    flexShrink: 1,
  },

  // Line heights
  lineHeightTight: { lineHeight: theme.typography.sizes.sm * 1.2 },
  lineHeightNormal: { lineHeight: theme.typography.sizes.sm * 1.5 },
  lineHeightRelaxed: { lineHeight: theme.typography.sizes.sm * 1.8 },

  // Alignments
  alignLeft: { textAlign: 'left', width: '100%' },
  alignCenter: { textAlign: 'center', width: '100%' },
  alignRight: { textAlign: 'right', width: '100%' },
  alignJustify: { textAlign: 'justify', width: '100%' },

  // Real-world styles
  rwHeading: {
    fontSize: theme.typography.sizes.xxl,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  rwSubheading: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  rwBody: {
    fontSize: theme.typography.sizes.md,
    fontWeight: '400',
    color: theme.colors.textPrimary,
    lineHeight: theme.typography.sizes.md * 1.6,
    marginBottom: theme.spacing.sm,
  },
  rwCaption: {
    fontSize: theme.typography.sizes.xs,
    fontWeight: '400',
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  rwLabel: {
    fontSize: theme.typography.sizes.xs,
    fontWeight: '700',
    color: theme.colors.textSecondary,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: theme.spacing.sm,
  },
  rwLink: {
    fontSize: theme.typography.sizes.md,
    fontWeight: '500',
    color: theme.colors.primary,
    textDecorationLine: 'underline',
    marginBottom: theme.spacing.sm,
  },
  rwCode: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: 'Courier',
    color: theme.colors.error,
    backgroundColor: '#FEF2F2',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: 4,
    marginBottom: theme.spacing.sm,
  },
});
