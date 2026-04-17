import Icon from '@react-native-vector-icons/material-design-icons';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/atoms/Header';
import SectionHeader from '../../components/molecules/SectionHeader';
import { useTheme } from '../../theme';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type CardVariant = 'wrong' | 'correct';

interface DemoCardProps {
  variant: CardVariant;
  label: string;
  criterion: string;
  codeSnippet: string;
  children: React.ReactNode;
}

// ---------------------------------------------------------------------------
// DemoCard — wraps each wrong/correct example
// ---------------------------------------------------------------------------

const DemoCard = ({
  variant,
  label,
  criterion,
  codeSnippet,
  children,
}: DemoCardProps) => {
  const { colors, spacing, typography, shadows, isDark } = useTheme();
  const [expanded, setExpanded] = useState(false);

  const isWrong = variant === 'wrong';
  const accentColor = isWrong ? colors.errorMain : colors.successMain;
  const accentBg = isWrong
    ? isDark
      ? '#3B0A0A'
      : colors.errorLight
    : isDark
    ? '#052E16'
    : colors.successLight;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: accentColor,
          borderRadius: spacing.radii.lg,
          marginBottom: spacing.md,
          ...shadows.sm,
        },
      ]}
    >
      {/* Card header */}
      <View
        style={[
          styles.cardHeader,
          {
            backgroundColor: accentBg,
            borderTopLeftRadius: spacing.radii.lg,
            borderTopRightRadius: spacing.radii.lg,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm,
          },
        ]}
      >
        <View style={styles.cardHeaderLeft}>
          <Icon
            name={isWrong ? 'close-circle' : 'check-circle'}
            size={16}
            color={accentColor}
          />
          <Text
            style={[
              typography.presets.label,
              { color: accentColor, marginLeft: spacing.xs },
            ]}
          >
            {isWrong ? 'Wrong' : 'Correct'}
          </Text>
        </View>
        <Text
          style={[typography.presets.caption, { color: colors.textTertiary }]}
        >
          {criterion}
        </Text>
      </View>

      {/* Description */}
      <View style={{ paddingHorizontal: spacing.md, paddingTop: spacing.md }}>
        <Text
          style={[
            typography.presets.bodySmall,
            { color: colors.textSecondary, marginBottom: spacing.md },
          ]}
        >
          {label}
        </Text>
      </View>

      {/* Live demo area */}
      <View
        style={{
          paddingHorizontal: spacing.md,
          paddingBottom: spacing.md,
          alignItems: 'flex-start',
        }}
      >
        {children}
      </View>

      {/* Code snippet toggle */}
      <TouchableOpacity
        onPress={() => setExpanded(v => !v)}
        accessibilityRole="button"
        accessibilityLabel={
          expanded ? 'Hide code snippet' : 'Show code snippet'
        }
        style={[
          styles.codeToggle,
          {
            borderTopWidth: 1,
            borderTopColor: colors.border,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm,
          },
        ]}
      >
        <Icon name="code-tags" size={14} color={colors.textTertiary} />
        <Text
          style={[
            typography.presets.caption,
            { color: colors.textTertiary, marginLeft: spacing.xs, flex: 1 },
          ]}
        >
          {expanded ? 'Hide code' : 'Show code'}
        </Text>
        <Icon
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={14}
          color={colors.textTertiary}
        />
      </TouchableOpacity>

      {expanded && (
        <View
          style={{
            backgroundColor: isDark ? colors.neutral900 : colors.neutral950,
            borderBottomLeftRadius: spacing.radii.lg,
            borderBottomRightRadius: spacing.radii.lg,
            padding: spacing.md,
          }}
        >
          <Text
            style={[
              typography.presets.code,
              { color: '#A5F3FC', fontSize: 11, lineHeight: 18 },
            ]}
            selectable
          >
            {codeSnippet}
          </Text>
        </View>
      )}
    </View>
  );
};

// ---------------------------------------------------------------------------
// Criterion section header
// ---------------------------------------------------------------------------

interface CriterionHeaderProps {
  id: string;
  level: 'A' | 'AA';
  title: string;
  description: string;
}

const CriterionHeader = ({
  id,
  level,
  title,
  description,
}: CriterionHeaderProps) => {
  const { colors, spacing, typography, isDark } = useTheme();

  return (
    <View
      style={{
        marginBottom: spacing.md,
        marginTop: spacing.sm,
      }}
    >
      <View style={styles.criterionTitleRow}>
        <View
          style={[
            styles.criterionBadge,
            {
              backgroundColor: isDark ? colors.primary900 : colors.primary50,
              borderRadius: spacing.radii.sm,
              paddingHorizontal: spacing.sm,
              paddingVertical: 2,
              marginRight: spacing.sm,
            },
          ]}
        >
          <Text
            style={[
              typography.presets.overline,
              { color: colors.primary, fontSize: 10 },
            ]}
          >
            {id}
          </Text>
        </View>
        <View
          style={[
            styles.criterionBadge,
            {
              backgroundColor:
                level === 'A'
                  ? isDark
                    ? '#1C1917'
                    : '#FEF3C7'
                  : isDark
                  ? '#0C1A2E'
                  : '#DBEAFE',
              borderRadius: spacing.radii.sm,
              paddingHorizontal: spacing.sm,
              paddingVertical: 2,
            },
          ]}
        >
          <Text
            style={[
              typography.presets.overline,
              {
                color: level === 'A' ? colors.warningMain : colors.infoMain,
                fontSize: 10,
              },
            ]}
          >
            Level {level}
          </Text>
        </View>
      </View>
      <Text
        style={[
          typography.presets.h3,
          { color: colors.textPrimary, marginTop: spacing.xs },
        ]}
      >
        {title}
      </Text>
      <Text
        style={[
          typography.presets.bodySmall,
          { color: colors.textSecondary, marginTop: 4 },
        ]}
      >
        {description}
      </Text>
    </View>
  );
};

// ---------------------------------------------------------------------------
// AccessibilityScreen
// ---------------------------------------------------------------------------

export default function AccessibilityScreen() {
  const { colors, spacing, typography, isDark } = useTheme();
  const [switchWrong, setSwitchWrong] = useState(false);
  const [switchCorrect, setSwitchCorrect] = useState(false);
  const [errorShown, setErrorShown] = useState(false);
  const [liveCount, setLiveCount] = useState(0);

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]}>
      <Header title="Accessibility (WCAG 2.2)" />

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.md,
          paddingBottom: spacing.xxxl,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Intro */}
        <View
          style={{
            backgroundColor: isDark ? colors.primary950 : colors.primary50,
            borderRadius: spacing.radii.lg,
            padding: spacing.md,
            marginBottom: spacing.xl,
            flexDirection: 'row',
            alignItems: 'flex-start',
          }}
        >
          <Icon
            name="human"
            size={20}
            color={colors.primary}
            style={{ marginRight: spacing.sm, marginTop: 2 }}
          />
          <Text
            style={[
              typography.presets.bodySmall,
              { color: colors.textSecondary, flex: 1 },
            ]}
          >
            Each section below shows a wrong implementation and the correct fix
            side by side. Tap "Show code" on any card to see the exact prop
            difference.
          </Text>
        </View>

        {/* ================================================================ */}
        {/* 1.1.1 — Non-text Content                                         */}
        {/* ================================================================ */}
        <SectionHeader title="PERCEIVABLE" />

        <CriterionHeader
          id="1.1.1"
          level="A"
          title="Non-text Content"
          description="Images and icons must have an accessibilityLabel so screen readers can describe them. Mark purely decorative elements with accessible={false}."
        />

        <DemoCard
          variant="wrong"
          criterion="1.1.1"
          label="Icon has no accessibilityLabel — a screen reader announces nothing or just the component name."
          codeSnippet={`// Wrong — no accessibilityLabel\n<Icon\n  name="heart"\n  size={24}\n  color={colors.errorMain}\n/>`}
        >
          <Icon name="heart" size={28} color={colors.errorMain} />
        </DemoCard>

        <DemoCard
          variant="correct"
          criterion="1.1.1"
          label='Icon has accessibilityLabel="Add to favourites" — screen readers announce the purpose clearly.'
          codeSnippet={`// Correct — descriptive label\n<Icon\n  name="heart"\n  size={24}\n  color={colors.errorMain}\n  accessibilityLabel="Add to favourites"\n/>`}
        >
          <View accessibilityLabel="Add to favourites" accessible={true}>
            <Icon name="heart" size={28} color={colors.errorMain} />
          </View>
        </DemoCard>

        <DemoCard
          variant="wrong"
          criterion="1.1.1"
          label="Image has no accessibilityLabel — screen readers cannot describe the photo."
          codeSnippet={`// Wrong — no accessibilityLabel\n<Image\n  source={{ uri: 'https://picsum.photos/80' }}\n  style={{ width: 64, height: 64, borderRadius: 8 }}\n/>`}
        >
          <Image
            source={{ uri: 'https://picsum.photos/80' }}
            style={{ width: 64, height: 64, borderRadius: 8 }}
          />
        </DemoCard>

        <DemoCard
          variant="correct"
          criterion="1.1.1"
          label='Image has accessibilityLabel="Profile photo" — screen readers announce the image purpose.'
          codeSnippet={`// Correct\n<Image\n  source={{ uri: 'https://picsum.photos/80' }}\n  style={{ width: 64, height: 64, borderRadius: 8 }}\n  accessibilityLabel="Profile photo"\n/>`}
        >
          <Image
            source={{ uri: 'https://picsum.photos/80' }}
            style={{ width: 64, height: 64, borderRadius: 8 }}
            accessibilityLabel="Profile photo"
          />
        </DemoCard>

        {/* ================================================================ */}
        {/* 1.3.1 — Info and Relationships                                   */}
        {/* ================================================================ */}
        <CriterionHeader
          id="1.3.1"
          level="A"
          title="Info and Relationships"
          description="Interactive elements must declare their role so assistive technologies can announce what they are — button, link, checkbox, etc."
        />

        <DemoCard
          variant="wrong"
          criterion="1.3.1"
          label="Pressable has no accessibilityRole — VoiceOver announces it as a generic element."
          codeSnippet={`// Wrong — no accessibilityRole\n<Pressable onPress={() => {}}>\n  <Text>Delete account</Text>\n</Pressable>`}
        >
          <Pressable
            onPress={() => {}}
            style={{
              backgroundColor: colors.errorMain,
              paddingHorizontal: spacing.lg,
              paddingVertical: spacing.sm,
              borderRadius: spacing.radii.md,
            }}
          >
            <Text style={[typography.presets.label, { color: colors.white }]}>
              Delete account
            </Text>
          </Pressable>
        </DemoCard>

        <DemoCard
          variant="correct"
          criterion="1.3.1"
          label='accessibilityRole="button" tells VoiceOver this is a button, so it announces "Delete account, button".'
          codeSnippet={`// Correct\n<Pressable\n  onPress={() => {}}\n  accessibilityRole="button"\n  accessibilityLabel="Delete account"\n>\n  <Text>Delete account</Text>\n</Pressable>`}
        >
          <Pressable
            onPress={() => {}}
            accessibilityRole="button"
            accessibilityLabel="Delete account"
            style={{
              backgroundColor: colors.errorMain,
              paddingHorizontal: spacing.lg,
              paddingVertical: spacing.sm,
              borderRadius: spacing.radii.md,
            }}
          >
            <Text style={[typography.presets.label, { color: colors.white }]}>
              Delete account
            </Text>
          </Pressable>
        </DemoCard>

        {/* ================================================================ */}
        {/* 1.4.3 — Contrast Minimum                                         */}
        {/* ================================================================ */}
        <CriterionHeader
          id="1.4.3"
          level="AA"
          title="Contrast (Minimum)"
          description="Text must have a contrast ratio of at least 4.5:1 against its background. Large text (18pt+) requires 3:1."
        />

        <DemoCard
          variant="wrong"
          criterion="1.4.3"
          label="Light grey text on white background — contrast ratio ~1.6:1, far below the 4.5:1 minimum."
          codeSnippet={`// Wrong — #CBD5E1 on #FFFFFF = ~1.6:1\n<Text style={{ color: '#CBD5E1', backgroundColor: '#FFFFFF' }}>\n  Insufficient contrast\n</Text>`}
        >
          <View
            style={{
              backgroundColor: '#FFFFFF',
              padding: spacing.md,
              borderRadius: spacing.radii.md,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Text style={{ color: '#CBD5E1', fontSize: 15 }}>
              Insufficient contrast — hard to read
            </Text>
          </View>
        </DemoCard>

        <DemoCard
          variant="correct"
          criterion="1.4.3"
          label="Dark text on white background — contrast ratio ~17.9:1, well above the 4.5:1 minimum."
          codeSnippet={`// Correct — #0F172A on #FFFFFF = ~17.9:1\n<Text style={{ color: colors.textPrimary }}>\n  Sufficient contrast\n</Text>`}
        >
          <View
            style={{
              backgroundColor: colors.background,
              padding: spacing.md,
              borderRadius: spacing.radii.md,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Text
              style={[typography.presets.body, { color: colors.textPrimary }]}
            >
              Sufficient contrast — easy to read
            </Text>
          </View>
        </DemoCard>

        {/* ================================================================ */}
        {/* 1.4.4 — Resize Text                                              */}
        {/* ================================================================ */}
        <CriterionHeader
          id="1.4.4"
          level="AA"
          title="Resize Text"
          description="Text must scale with the user's system font size setting. Never disable font scaling or cap it below 2x."
        />

        <DemoCard
          variant="wrong"
          criterion="1.4.4"
          label="allowFontScaling={false} locks the text size regardless of the user's accessibility font setting."
          codeSnippet={`// Wrong — ignores system font size\n<Text allowFontScaling={false}>\n  This text never scales\n</Text>`}
        >
          <Text
            allowFontScaling={false}
            style={[typography.presets.body, { color: colors.textPrimary }]}
          >
            This text never scales (allowFontScaling=false)
          </Text>
        </DemoCard>

        <DemoCard
          variant="correct"
          criterion="1.4.4"
          label="No allowFontScaling prop — text respects the user's system font size. maxFontSizeMultiplier={2} is the minimum acceptable cap."
          codeSnippet={`// Correct — scales with system setting\n<Text maxFontSizeMultiplier={2}>\n  This text scales correctly\n</Text>`}
        >
          <Text
            maxFontSizeMultiplier={2}
            style={[typography.presets.body, { color: colors.textPrimary }]}
          >
            This text scales correctly (maxFontSizeMultiplier=2)
          </Text>
        </DemoCard>

        {/* ================================================================ */}
        {/* 1.4.11 — Non-text Contrast                                       */}
        {/* ================================================================ */}
        <CriterionHeader
          id="1.4.11"
          level="AA"
          title="Non-text Contrast"
          description="UI component boundaries (borders, icons used as controls) must have a contrast ratio of at least 3:1 against adjacent colors."
        />

        <DemoCard
          variant="wrong"
          criterion="1.4.11"
          label="Input border #E2E8F0 on white background — contrast ratio ~1.3:1, below the 3:1 minimum for UI components."
          codeSnippet={`// Wrong — border barely visible\n<TextInput\n  style={{\n    borderWidth: 1,\n    borderColor: '#E2E8F0', // ~1.3:1 on white\n  }}\n/>`}
        >
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: '#E2E8F0',
              borderRadius: spacing.radii.md,
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.sm,
              width: '100%',
              color: colors.textPrimary,
              backgroundColor: colors.background,
            }}
            placeholder="Low contrast border"
            placeholderTextColor={colors.textTertiary}
            accessibilityLabel="Low contrast border example"
          />
        </DemoCard>

        <DemoCard
          variant="correct"
          criterion="1.4.11"
          label="Input border #94A3B8 on white background — contrast ratio ~3.1:1, meets the 3:1 minimum for UI components."
          codeSnippet={`// Correct — border clearly visible\n<TextInput\n  style={{\n    borderWidth: 1.5,\n    borderColor: '#94A3B8', // ~3.1:1 on white\n  }}\n/>`}
        >
          <TextInput
            style={{
              borderWidth: 1.5,
              borderColor: '#94A3B8',
              borderRadius: spacing.radii.md,
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.sm,
              width: '100%',
              color: colors.textPrimary,
              backgroundColor: colors.background,
            }}
            placeholder="Sufficient contrast border"
            placeholderTextColor={colors.textTertiary}
            accessibilityLabel="Sufficient contrast border example"
          />
        </DemoCard>

        {/* ================================================================ */}
        {/* OPERABLE                                                          */}
        {/* ================================================================ */}
        <SectionHeader title="OPERABLE" />

        {/* ================================================================ */}
        {/* 2.1.1 — Keyboard / Switch Access                                 */}
        {/* ================================================================ */}
        <CriterionHeader
          id="2.1.1"
          level="A"
          title="Keyboard / Switch Access"
          description="All interactive functionality must be reachable without a touchscreen. A plain View with onPress is invisible to keyboard and switch access users."
        />

        <DemoCard
          variant="wrong"
          criterion="2.1.1"
          label="View with onPress — not focusable by keyboard or switch access. Screen readers skip it entirely."
          codeSnippet={`// Wrong — View is not keyboard-focusable\n<View onPress={() => {}}>\n  <Text>Tap me</Text>\n</View>`}
        >
          <View
            style={{
              backgroundColor: colors.surface,
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: spacing.radii.md,
              paddingHorizontal: spacing.lg,
              paddingVertical: spacing.sm,
            }}
          >
            <Text
              style={[typography.presets.label, { color: colors.textPrimary }]}
            >
              View with onPress (not focusable)
            </Text>
          </View>
        </DemoCard>

        <DemoCard
          variant="correct"
          criterion="2.1.1"
          label="TouchableOpacity is natively focusable by keyboard and switch access, and announces its role to screen readers."
          codeSnippet={`// Correct — use a proper touchable\n<TouchableOpacity\n  onPress={() => {}}\n  accessibilityRole="button"\n  accessibilityLabel="Tap me"\n>\n  <Text>Tap me</Text>\n</TouchableOpacity>`}
        >
          <TouchableOpacity
            onPress={() => {}}
            accessibilityRole="button"
            accessibilityLabel="Tap me"
            style={{
              backgroundColor: colors.primary,
              borderRadius: spacing.radii.md,
              paddingHorizontal: spacing.lg,
              paddingVertical: spacing.sm,
            }}
          >
            <Text style={[typography.presets.label, { color: colors.white }]}>
              TouchableOpacity (focusable)
            </Text>
          </TouchableOpacity>
        </DemoCard>

        {/* ================================================================ */}
        {/* 2.4.3 — Focus Order                                              */}
        {/* ================================================================ */}
        <CriterionHeader
          id="2.4.3"
          level="A"
          title="Focus Order"
          description="Modals must trap focus inside them. Without accessibilityViewIsModal, VoiceOver can navigate to elements behind the modal."
        />

        <DemoCard
          variant="wrong"
          criterion="2.4.3"
          label="Modal without accessibilityViewIsModal — VoiceOver can escape the modal and interact with content behind it."
          codeSnippet={`// Wrong — focus can escape the modal\n<Modal visible={true}>\n  <View>\n    <Text>Modal content</Text>\n  </View>\n</Modal>`}
        >
          <View
            style={{
              backgroundColor: isDark ? colors.neutral800 : colors.neutral100,
              borderRadius: spacing.radii.md,
              padding: spacing.md,
              borderWidth: 1,
              borderColor: colors.errorMain,
            }}
          >
            <Text
              style={[
                typography.presets.caption,
                { color: colors.textSecondary },
              ]}
            >
              {'<Modal visible={true}>'}
            </Text>
            <Text
              style={[
                typography.presets.caption,
                { color: colors.errorMain, marginTop: 4 },
              ]}
            >
              Missing: accessibilityViewIsModal
            </Text>
          </View>
        </DemoCard>

        <DemoCard
          variant="correct"
          criterion="2.4.3"
          label="accessibilityViewIsModal={true} traps VoiceOver focus inside the modal, preventing interaction with background content."
          codeSnippet={`// Correct — focus is trapped inside\n<Modal\n  visible={true}\n  accessibilityViewIsModal={true}\n>\n  <View>\n    <Text>Modal content</Text>\n  </View>\n</Modal>`}
        >
          <View
            style={{
              backgroundColor: isDark ? colors.neutral800 : colors.neutral100,
              borderRadius: spacing.radii.md,
              padding: spacing.md,
              borderWidth: 1,
              borderColor: colors.successMain,
            }}
          >
            <Text
              style={[
                typography.presets.caption,
                { color: colors.textSecondary },
              ]}
            >
              {'<Modal visible={true}'}
            </Text>
            <Text
              style={[
                typography.presets.caption,
                { color: colors.successMain, marginTop: 4 },
              ]}
            >
              {'  accessibilityViewIsModal={true}'}
            </Text>
            <Text
              style={[
                typography.presets.caption,
                { color: colors.textSecondary },
              ]}
            >
              {'>'}
            </Text>
          </View>
        </DemoCard>

        {/* ================================================================ */}
        {/* 2.5.3 — Label in Name                                            */}
        {/* ================================================================ */}
        <CriterionHeader
          id="2.5.3"
          level="AA"
          title="Label in Name"
          description="The accessibilityLabel of a button must contain the visible text label. Voice control users say the visible text to activate buttons."
        />

        <DemoCard
          variant="wrong"
          criterion="2.5.3"
          label='accessibilityLabel="btn1" does not match the visible text "Submit" — voice control users cannot activate it by saying "Submit".'
          codeSnippet={`// Wrong — label doesn't match visible text\n<TouchableOpacity\n  accessibilityRole="button"\n  accessibilityLabel="btn1"\n>\n  <Text>Submit</Text>\n</TouchableOpacity>`}
        >
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="btn1"
            style={{
              backgroundColor: colors.primary,
              paddingHorizontal: spacing.lg,
              paddingVertical: spacing.sm,
              borderRadius: spacing.radii.md,
            }}
          >
            <Text style={[typography.presets.label, { color: colors.white }]}>
              Submit
            </Text>
          </TouchableOpacity>
        </DemoCard>

        <DemoCard
          variant="correct"
          criterion="2.5.3"
          label='accessibilityLabel="Submit form" contains the visible word "Submit" — voice control users can say "Submit" to activate it.'
          codeSnippet={`// Correct — label contains visible text\n<TouchableOpacity\n  accessibilityRole="button"\n  accessibilityLabel="Submit form"\n>\n  <Text>Submit</Text>\n</TouchableOpacity>`}
        >
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Submit form"
            style={{
              backgroundColor: colors.primary,
              paddingHorizontal: spacing.lg,
              paddingVertical: spacing.sm,
              borderRadius: spacing.radii.md,
            }}
          >
            <Text style={[typography.presets.label, { color: colors.white }]}>
              Submit
            </Text>
          </TouchableOpacity>
        </DemoCard>

        {/* ================================================================ */}
        {/* 2.5.8 — Target Size                                              */}
        {/* ================================================================ */}
        <CriterionHeader
          id="2.5.8"
          level="AA"
          title="Target Size (Minimum)"
          description="Touch targets must be at least 24x24pt. The recommended comfortable size is 44x44pt to reduce mis-taps."
        />

        <DemoCard
          variant="wrong"
          criterion="2.5.8"
          label="16x16pt touch target — too small for reliable tapping, especially for users with motor impairments."
          codeSnippet={`// Wrong — 16x16pt is below the 24pt minimum\n<TouchableOpacity\n  style={{ width: 16, height: 16 }}\n  accessibilityRole="button"\n  accessibilityLabel="Close"\n>\n  <Icon name="close" size={12} />\n</TouchableOpacity>`}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Close (too small)"
              style={{
                width: 16,
                height: 16,
                backgroundColor: colors.errorMain,
                borderRadius: 8,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon name="close" size={10} color={colors.white} />
            </TouchableOpacity>
            <Text
              style={[
                typography.presets.caption,
                { color: colors.textSecondary },
              ]}
            >
              16x16pt — too small
            </Text>
          </View>
        </DemoCard>

        <DemoCard
          variant="correct"
          criterion="2.5.8"
          label="44x44pt touch target — comfortable for all users, well above the 24pt WCAG minimum."
          codeSnippet={`// Correct — 44x44pt recommended size\n<TouchableOpacity\n  style={{ width: 44, height: 44 }}\n  accessibilityRole="button"\n  accessibilityLabel="Close"\n>\n  <Icon name="close" size={20} />\n</TouchableOpacity>`}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Close"
              style={{
                width: 44,
                height: 44,
                backgroundColor: colors.successMain,
                borderRadius: 22,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon name="close" size={20} color={colors.white} />
            </TouchableOpacity>
            <Text
              style={[
                typography.presets.caption,
                { color: colors.textSecondary },
              ]}
            >
              44x44pt — comfortable
            </Text>
          </View>
        </DemoCard>

        {/* ================================================================ */}
        {/* UNDERSTANDABLE                                                    */}
        {/* ================================================================ */}
        <SectionHeader title="UNDERSTANDABLE" />

        {/* ================================================================ */}
        {/* 3.3.2 — Labels or Instructions                                   */}
        {/* ================================================================ */}
        <CriterionHeader
          id="3.3.2"
          level="A"
          title="Labels or Instructions"
          description="Form inputs must have an accessibilityLabel so screen readers announce the field's purpose. A placeholder alone is not sufficient — it disappears when the user types."
        />

        <DemoCard
          variant="wrong"
          criterion="3.3.2"
          label="TextInput with only a placeholder — once the user starts typing, the placeholder disappears and screen readers have no label to announce."
          codeSnippet={`// Wrong — placeholder is not an a11y label\n<TextInput\n  placeholder="Enter your email"\n/>`}
        >
          <TextInput
            placeholder="Enter your email"
            placeholderTextColor={colors.textTertiary}
            style={{
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: spacing.radii.md,
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.sm,
              width: '100%',
              color: colors.textPrimary,
              backgroundColor: colors.surface,
            }}
          />
        </DemoCard>

        <DemoCard
          variant="correct"
          criterion="3.3.2"
          label='accessibilityLabel="Email address" is always present — screen readers announce "Email address, text field" even after the user has typed.'
          codeSnippet={`// Correct — persistent accessibilityLabel\n<TextInput\n  placeholder="Enter your email"\n  accessibilityLabel="Email address"\n  accessibilityHint="Enter the email address associated with your account"\n/>`}
        >
          <TextInput
            placeholder="Enter your email"
            placeholderTextColor={colors.textTertiary}
            accessibilityLabel="Email address"
            accessibilityHint="Enter the email address associated with your account"
            style={{
              borderWidth: 1.5,
              borderColor: colors.primary,
              borderRadius: spacing.radii.md,
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.sm,
              width: '100%',
              color: colors.textPrimary,
              backgroundColor: colors.surface,
            }}
          />
        </DemoCard>

        {/* ================================================================ */}
        {/* Bonus — Switch                                                    */}
        {/* ================================================================ */}
        <CriterionHeader
          id="1.3.1 + 3.3.2"
          level="A"
          title="Switch Controls"
          description="A Switch must have both accessibilityLabel (what it controls) and accessibilityRole='switch' so screen readers announce its state correctly."
        />

        <DemoCard
          variant="wrong"
          criterion="1.3.1"
          label="Switch with no label or role — VoiceOver announces 'switch' with no context about what it toggles."
          codeSnippet={`// Wrong — no label, no role\n<Switch\n  value={enabled}\n  onValueChange={setEnabled}\n/>`}
        >
          <View style={styles.switchRow}>
            <Switch
              value={switchWrong}
              onValueChange={setSwitchWrong}
              trackColor={{
                false: colors.neutral300,
                true: colors.primary,
              }}
            />
            <Text
              style={[
                typography.presets.bodySmall,
                { color: colors.textSecondary, marginLeft: spacing.sm },
              ]}
            >
              Dark mode
            </Text>
          </View>
        </DemoCard>

        <DemoCard
          variant="correct"
          criterion="1.3.1"
          label='accessibilityRole="switch" + accessibilityLabel="Dark mode" — VoiceOver announces "Dark mode, switch, off" and updates state on toggle.'
          codeSnippet={`// Correct\n<Switch\n  value={enabled}\n  onValueChange={setEnabled}\n  accessibilityRole="switch"\n  accessibilityLabel="Dark mode"\n  accessibilityValue={{ text: enabled ? 'on' : 'off' }}\n/>`}
        >
          <View style={styles.switchRow}>
            <Switch
              value={switchCorrect}
              onValueChange={setSwitchCorrect}
              accessibilityRole="switch"
              accessibilityLabel="Dark mode"
              accessibilityValue={{ text: switchCorrect ? 'on' : 'off' }}
              trackColor={{
                false: colors.neutral300,
                true: colors.primary,
              }}
            />
            <Text
              style={[
                typography.presets.bodySmall,
                { color: colors.textSecondary, marginLeft: spacing.sm },
              ]}
            >
              Dark mode
            </Text>
          </View>
        </DemoCard>

        {/* ================================================================ */}
        {/* Bonus — ActivityIndicator                                         */}
        {/* ================================================================ */}
        <CriterionHeader
          id="1.1.1"
          level="A"
          title="Loading Indicators"
          description="ActivityIndicator is non-text content. Without a label, screen readers announce silence during loading states."
        />

        <DemoCard
          variant="wrong"
          criterion="1.1.1"
          label="ActivityIndicator with no accessibilityLabel — screen readers announce nothing while the user waits."
          codeSnippet={`// Wrong — silent loading state\n<ActivityIndicator color={colors.primary} />`}
        >
          <ActivityIndicator color={colors.primary} size="large" />
        </DemoCard>

        <DemoCard
          variant="correct"
          criterion="1.1.1"
          label='accessibilityLabel="Loading, please wait" — screen readers announce the loading state immediately.'
          codeSnippet={`// Correct\n<ActivityIndicator\n  color={colors.primary}\n  accessibilityLabel="Loading, please wait"\n/>`}
        >
          <ActivityIndicator
            color={colors.primary}
            size="large"
            accessibilityLabel="Loading, please wait"
          />
        </DemoCard>

        {/* ================================================================ */}
        {/* 1.3.4 — Orientation                                              */}
        {/* ================================================================ */}
        <CriterionHeader
          id="1.3.4"
          level="AA"
          title="Orientation"
          description="Content must not be locked to a single screen orientation (portrait or landscape) unless essential. Users with mounted devices cannot rotate their screen."
        />

        <DemoCard
          variant="wrong"
          criterion="1.3.4"
          label="Locking orientation to portrait prevents users with fixed-mount devices (e.g. wheelchair mounts) from using the app in landscape."
          codeSnippet={`// Wrong — forces portrait only\n// In AppDelegate / AndroidManifest:\nscreenOrientation: 'portrait'\n\n// Or via react-native-orientation-locker:\nOrientation.lockToPortrait();`}
        >
          <View
            style={{
              backgroundColor: isDark ? colors.neutral800 : colors.neutral100,
              borderRadius: spacing.radii.md,
              padding: spacing.md,
              flexDirection: 'row',
              alignItems: 'center',
              gap: spacing.sm,
            }}
          >
            <Icon name="phone-lock" size={28} color={colors.errorMain} />
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  typography.presets.label,
                  { color: colors.textPrimary },
                ]}
              >
                Portrait only
              </Text>
              <Text
                style={[
                  typography.presets.caption,
                  { color: colors.textSecondary, marginTop: 2 },
                ]}
              >
                Locked — landscape users cannot rotate
              </Text>
            </View>
          </View>
        </DemoCard>

        <DemoCard
          variant="correct"
          criterion="1.3.4"
          label="Allow both orientations by default. Only lock orientation when it is essential to the feature (e.g. a video player in fullscreen)."
          codeSnippet={`// Correct — no orientation lock\n// Do not set screenOrientation in app config.\n// Layout adapts to both portrait and landscape.\n\n// If you must lock (e.g. video), provide an\n// explicit unlock when leaving that screen:\nOrientation.unlockAllOrientations();`}
        >
          <View
            style={{
              backgroundColor: isDark ? colors.neutral800 : colors.neutral100,
              borderRadius: spacing.radii.md,
              padding: spacing.md,
              flexDirection: 'row',
              alignItems: 'center',
              gap: spacing.sm,
            }}
          >
            <Icon
              name="phone-rotate-landscape"
              size={28}
              color={colors.successMain}
            />
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  typography.presets.label,
                  { color: colors.textPrimary },
                ]}
              >
                Both orientations
              </Text>
              <Text
                style={[
                  typography.presets.caption,
                  { color: colors.textSecondary, marginTop: 2 },
                ]}
              >
                Unlocked — layout adapts to device rotation
              </Text>
            </View>
          </View>
        </DemoCard>

        {/* ================================================================ */}
        {/* 1.3.5 — Identify Input Purpose                                   */}
        {/* ================================================================ */}
        <CriterionHeader
          id="1.3.5"
          level="AA"
          title="Identify Input Purpose"
          description="Form fields that collect personal data must declare their purpose via textContentType (iOS) and autoComplete (Android) so autofill and assistive tech can identify them."
        />

        <DemoCard
          variant="wrong"
          criterion="1.3.5"
          label="No textContentType or autoComplete — autofill cannot identify the field, and assistive tech cannot announce its purpose to users who rely on autofill."
          codeSnippet={`// Wrong — no input purpose declared\n<TextInput\n  placeholder="Email"\n  accessibilityLabel="Email address"\n  keyboardType="email-address"\n/>`}
        >
          <TextInput
            placeholder="Email"
            placeholderTextColor={colors.textTertiary}
            accessibilityLabel="Email address (no autofill hint)"
            keyboardType="email-address"
            style={{
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: spacing.radii.md,
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.sm,
              width: '100%',
              color: colors.textPrimary,
              backgroundColor: colors.surface,
            }}
          />
        </DemoCard>

        <DemoCard
          variant="correct"
          criterion="1.3.5"
          label="textContentType='emailAddress' (iOS) and autoComplete='email' (Android) let the OS identify the field for autofill and announce it correctly to assistive tech."
          codeSnippet={`// Correct — input purpose declared\n<TextInput\n  placeholder="Email"\n  accessibilityLabel="Email address"\n  keyboardType="email-address"\n  textContentType="emailAddress"   // iOS\n  autoComplete="email"             // Android\n/>`}
        >
          <TextInput
            placeholder="Email"
            placeholderTextColor={colors.textTertiary}
            accessibilityLabel="Email address"
            keyboardType="email-address"
            textContentType="emailAddress"
            autoComplete="email"
            style={{
              borderWidth: 1.5,
              borderColor: colors.primary,
              borderRadius: spacing.radii.md,
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.sm,
              width: '100%',
              color: colors.textPrimary,
              backgroundColor: colors.surface,
            }}
          />
        </DemoCard>

        {/* ================================================================ */}
        {/* 2.4.6 — Headings and Labels                                      */}
        {/* ================================================================ */}
        <CriterionHeader
          id="2.4.6"
          level="AA"
          title="Headings and Labels"
          description="Section headings must be marked with accessibilityRole='header' so screen reader users can navigate between sections using heading shortcuts."
        />

        <DemoCard
          variant="wrong"
          criterion="2.4.6"
          label="Section title rendered as plain Text — VoiceOver reads it as body text. Screen reader users cannot jump between sections using heading navigation."
          codeSnippet={`// Wrong — plain Text, not a heading\n<Text style={styles.sectionTitle}>\n  Account Settings\n</Text>`}
        >
          <Text
            style={[
              typography.presets.h2,
              {
                color: colors.textPrimary,
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
                paddingBottom: spacing.xs,
              },
            ]}
          >
            Account Settings
          </Text>
        </DemoCard>

        <DemoCard
          variant="correct"
          criterion="2.4.6"
          label='accessibilityRole="header" marks this as a heading — VoiceOver announces "Account Settings, heading" and users can navigate to it with the rotor.'
          codeSnippet={`// Correct — marked as a heading\n<Text\n  accessibilityRole="header"\n  style={styles.sectionTitle}\n>\n  Account Settings\n</Text>`}
        >
          <Text
            accessibilityRole="header"
            style={[
              typography.presets.h2,
              {
                color: colors.textPrimary,
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
                paddingBottom: spacing.xs,
              },
            ]}
          >
            Account Settings
          </Text>
        </DemoCard>

        {/* ================================================================ */}
        {/* 2.5.4 — Motion Actuation                                         */}
        {/* ================================================================ */}
        <CriterionHeader
          id="2.5.4"
          level="A"
          title="Motion Actuation"
          description="Functionality triggered by device motion (shake, tilt, gyroscope) must also be available through a standard UI control. Users with tremors or fixed-mount devices cannot perform motion gestures."
        />

        <DemoCard
          variant="wrong"
          criterion="2.5.4"
          label="Shake-to-undo is the only way to undo — users with motor impairments or mounted devices cannot shake their device."
          codeSnippet={`// Wrong — shake is the only undo mechanism\nuseEffect(() => {\n  // Shake gesture listener only\n  ShakeEventListener.addListener(() => {\n    undoLastAction();\n  });\n}, []);`}
        >
          <View
            style={{
              backgroundColor: isDark ? colors.neutral800 : colors.neutral100,
              borderRadius: spacing.radii.md,
              padding: spacing.md,
              flexDirection: 'row',
              alignItems: 'center',
              gap: spacing.sm,
            }}
          >
            <Icon name="vibrate" size={24} color={colors.errorMain} />
            <Text
              style={[
                typography.presets.bodySmall,
                { color: colors.textSecondary, flex: 1 },
              ]}
            >
              Shake device to undo{'\n'}
              <Text style={{ color: colors.errorMain }}>
                No button alternative provided
              </Text>
            </Text>
          </View>
        </DemoCard>

        <DemoCard
          variant="correct"
          criterion="2.5.4"
          label="Shake gesture is supported AND an Undo button is always visible — users who cannot shake can tap the button instead."
          codeSnippet={`// Correct — shake + button alternative\nuseEffect(() => {\n  ShakeEventListener.addListener(undoLastAction);\n}, []);\n\n// Always render a visible Undo button:\n<TouchableOpacity\n  onPress={undoLastAction}\n  accessibilityRole="button"\n  accessibilityLabel="Undo last action"\n>\n  <Text>Undo</Text>\n</TouchableOpacity>`}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: spacing.sm,
            }}
          >
            <Icon name="vibrate" size={20} color={colors.successMain} />
            <Text
              style={[
                typography.presets.caption,
                { color: colors.textSecondary },
              ]}
            >
              Shake to undo
            </Text>
            <Text
              style={[
                typography.presets.caption,
                { color: colors.textTertiary },
              ]}
            >
              or
            </Text>
            <TouchableOpacity
              onPress={() => {}}
              accessibilityRole="button"
              accessibilityLabel="Undo last action"
              style={{
                backgroundColor: colors.primary,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.xs,
                borderRadius: spacing.radii.sm,
                flexDirection: 'row',
                alignItems: 'center',
                gap: spacing.xs,
              }}
            >
              <Icon name="undo" size={14} color={colors.white} />
              <Text style={[typography.presets.label, { color: colors.white }]}>
                Undo
              </Text>
            </TouchableOpacity>
          </View>
        </DemoCard>

        {/* ================================================================ */}
        {/* UNDERSTANDABLE (continued)                                        */}
        {/* ================================================================ */}

        {/* ================================================================ */}
        {/* 3.3.1 — Error Identification                                      */}
        {/* ================================================================ */}
        <CriterionHeader
          id="3.3.1"
          level="A"
          title="Error Identification"
          description="Form errors must be announced to screen readers, not just shown visually. Color or icon alone is not sufficient — the error must be programmatically associated with the field."
        />

        <DemoCard
          variant="wrong"
          criterion="3.3.1"
          label="Error shown only with a red border and icon — screen readers do not announce the error. Users relying on VoiceOver have no idea the field is invalid."
          codeSnippet={`// Wrong — visual error only\n<TextInput\n  style={{ borderColor: 'red' }}\n  accessibilityLabel="Email"\n/>\n<Icon name="alert-circle" color="red" />\n<Text style={{ color: 'red' }}>Invalid email</Text>`}
        >
          <View style={{ width: '100%', gap: spacing.xs }}>
            <TextInput
              placeholder="Enter email"
              placeholderTextColor={colors.textTertiary}
              accessibilityLabel="Email"
              style={{
                borderWidth: 2,
                borderColor: colors.errorMain,
                borderRadius: spacing.radii.md,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.sm,
                width: '100%',
                color: colors.textPrimary,
                backgroundColor: colors.surface,
              }}
            />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: spacing.xs,
              }}
            >
              <Icon name="alert-circle" size={14} color={colors.errorMain} />
              <Text
                style={[
                  typography.presets.caption,
                  { color: colors.errorMain },
                ]}
              >
                Invalid email address
              </Text>
            </View>
          </View>
        </DemoCard>

        <DemoCard
          variant="correct"
          criterion="3.3.1"
          label="accessibilityLabel includes the error text, and accessibilityLiveRegion='assertive' causes VoiceOver to immediately announce the error when it appears."
          codeSnippet={`// Correct — error announced to screen reader\n<TextInput\n  accessibilityLabel="Email — Invalid email address"\n  accessibilityInvalid={true}\n  style={{ borderColor: colors.errorMain }}\n/>\n{/* Error message with live region */}\n<Text\n  accessibilityLiveRegion="assertive"\n  accessibilityRole="alert"\n>\n  Invalid email address\n</Text>`}
        >
          <View style={{ width: '100%', gap: spacing.xs }}>
            <TouchableOpacity
              onPress={() => setErrorShown(v => !v)}
              accessibilityRole="button"
              accessibilityLabel="Toggle error state demo"
              style={{
                backgroundColor: colors.primary,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.xs,
                borderRadius: spacing.radii.sm,
                alignSelf: 'flex-start',
                marginBottom: spacing.xs,
              }}
            >
              <Text
                style={[typography.presets.caption, { color: colors.white }]}
              >
                {errorShown ? 'Clear error' : 'Trigger error'}
              </Text>
            </TouchableOpacity>
            <TextInput
              placeholder="Enter email"
              placeholderTextColor={colors.textTertiary}
              accessibilityLabel={
                errorShown ? 'Email — Invalid email address' : 'Email'
              }
              style={{
                borderWidth: errorShown ? 2 : 1,
                borderColor: errorShown ? colors.errorMain : colors.primary,
                borderRadius: spacing.radii.md,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.sm,
                width: '100%',
                color: colors.textPrimary,
                backgroundColor: colors.surface,
              }}
            />
            {errorShown && (
              <View
                accessibilityLiveRegion="assertive"
                accessibilityRole="alert"
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: spacing.xs,
                }}
              >
                <Icon name="alert-circle" size={14} color={colors.errorMain} />
                <Text
                  style={[
                    typography.presets.caption,
                    { color: colors.errorMain },
                  ]}
                >
                  Invalid email address
                </Text>
              </View>
            )}
          </View>
        </DemoCard>

        {/* ================================================================ */}
        {/* ROBUST                                                            */}
        {/* ================================================================ */}
        <SectionHeader title="ROBUST" />

        {/* ================================================================ */}
        {/* 4.1.3 — Status Messages                                          */}
        {/* ================================================================ */}
        <CriterionHeader
          id="4.1.3"
          level="AA"
          title="Status Messages"
          description="Dynamic status updates (item counts, success/error toasts, loading completion) must be announced by screen readers without moving focus. Use accessibilityLiveRegion."
        />

        <DemoCard
          variant="wrong"
          criterion="4.1.3"
          label="Counter updates visually but has no live region — screen readers do not announce the new count. Users relying on VoiceOver miss the update entirely."
          codeSnippet={`// Wrong — no live region\n<Text style={styles.counter}>\n  {count} items selected\n</Text>\n<TouchableOpacity onPress={increment}>\n  <Text>Add item</Text>\n</TouchableOpacity>`}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: spacing.md,
            }}
          >
            <Text
              style={[
                typography.presets.h3,
                {
                  color: colors.textPrimary,
                  minWidth: 80,
                  backgroundColor: isDark
                    ? colors.neutral800
                    : colors.neutral100,
                  padding: spacing.sm,
                  borderRadius: spacing.radii.md,
                  textAlign: 'center',
                },
              ]}
            >
              {liveCount} items
            </Text>
            <TouchableOpacity
              onPress={() => setLiveCount(c => c + 1)}
              accessibilityRole="button"
              accessibilityLabel="Add item (no announcement)"
              style={{
                backgroundColor: colors.errorMain,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.sm,
                borderRadius: spacing.radii.md,
              }}
            >
              <Text style={[typography.presets.label, { color: colors.white }]}>
                Add item
              </Text>
            </TouchableOpacity>
          </View>
        </DemoCard>

        <DemoCard
          variant="correct"
          criterion="4.1.3"
          label='accessibilityLiveRegion="polite" causes VoiceOver to announce the updated count after the current speech finishes — without moving focus away from the button.'
          codeSnippet={`// Correct — live region announces updates\n<Text\n  accessibilityLiveRegion="polite"\n  accessibilityLabel={\`\${count} items selected\`}\n>\n  {count} items selected\n</Text>\n<TouchableOpacity\n  onPress={increment}\n  accessibilityRole="button"\n  accessibilityLabel="Add item"\n>\n  <Text>Add item</Text>\n</TouchableOpacity>`}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: spacing.md,
            }}
          >
            <Text
              accessibilityLiveRegion="polite"
              accessibilityLabel={`${liveCount} items selected`}
              style={[
                typography.presets.h3,
                {
                  color: colors.textPrimary,
                  minWidth: 80,
                  backgroundColor: isDark
                    ? colors.neutral800
                    : colors.neutral100,
                  padding: spacing.sm,
                  borderRadius: spacing.radii.md,
                  textAlign: 'center',
                },
              ]}
            >
              {liveCount} items
            </Text>
            <TouchableOpacity
              onPress={() => setLiveCount(c => c + 1)}
              accessibilityRole="button"
              accessibilityLabel="Add item"
              style={{
                backgroundColor: colors.successMain,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.sm,
                borderRadius: spacing.radii.md,
              }}
            >
              <Text style={[typography.presets.label, { color: colors.white }]}>
                Add item
              </Text>
            </TouchableOpacity>
          </View>
        </DemoCard>
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
  },
  card: {
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  codeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  criterionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  criterionBadge: {
    alignSelf: 'flex-start',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
