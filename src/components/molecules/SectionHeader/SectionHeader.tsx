import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useTheme } from '../../../theme';

type SectionHeaderProps = {
  title: string;
  action?: {
    label: string;
    onPress: () => void;
  };
};

const SectionHeader = ({ title, action }: SectionHeaderProps) => {
  const { colors, spacing, typography } = useTheme();

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'transparent',
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.xl,
        paddingBottom: spacing.sm,
      }}
    >
      <Text
        style={{
          ...typography.presets.overline,
          color: colors.textTertiary,
          flex: 1,
        }}
      >
        {title}
      </Text>
      {action !== undefined && (
        <Pressable onPress={action.onPress} hitSlop={8}>
          <Text
            style={{
              ...typography.presets.caption,
              color: colors.primary,
              fontWeight: typography.weights.semibold as '600',
            }}
          >
            {action.label}
          </Text>
        </Pressable>
      )}
    </View>
  );
};

export default SectionHeader;
