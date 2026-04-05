import React, { useEffect, useRef } from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../../theme';

type RadioOption = {
  id: string;
  label: string;
};

type RadioGroupProps = {
  options: RadioOption[];
  selected: string;
  onSelect: (id: string) => void;
};

type RadioItemProps = {
  id: string;
  label: string;
  isSelected: boolean;
  onSelect: (id: string) => void;
};

const RadioItem = ({ id, label, isSelected, onSelect }: RadioItemProps) => {
  const { colors, spacing, typography } = useTheme();
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isSelected) {
      Animated.sequence([
        Animated.spring(scale, {
          toValue: 1.2,
          useNativeDriver: true,
          speed: 50,
          bounciness: 8,
        }),
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
          speed: 50,
          bounciness: 8,
        }),
      ]).start();
    }
  }, [isSelected, scale]);

  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.md,
      }}
      onPress={() => onSelect(id)}
      activeOpacity={0.7}
    >
      <Animated.View
        style={{
          width: 22,
          height: 22,
          borderRadius: 11,
          borderWidth: 2,
          borderColor: isSelected ? colors.primary600 : colors.border,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: spacing.md,
          transform: [{ scale }],
        }}
      >
        {isSelected && (
          <View
            style={{
              width: 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: colors.primary600,
            }}
          />
        )}
      </Animated.View>

      <Text
        style={{
          ...typography.presets.body,
          color: colors.textPrimary,
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const RadioGroup = ({ options, selected, onSelect }: RadioGroupProps) => (
  <View>
    {options.map(({ id, label }) => (
      <RadioItem
        key={id}
        id={id}
        label={label}
        isSelected={selected === id}
        onSelect={onSelect}
      />
    ))}
  </View>
);

export default RadioGroup;
