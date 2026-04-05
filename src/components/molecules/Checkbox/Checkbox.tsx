import Icon from '@react-native-vector-icons/material-design-icons';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../theme';

type CheckboxProps = {
  label: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
};

const Checkbox = ({
  label,
  checked: controlledChecked,
  onChange,
}: CheckboxProps) => {
  const { colors, spacing, typography } = useTheme();
  const [internalChecked, setInternalChecked] = useState(false);
  const isChecked =
    controlledChecked !== undefined ? controlledChecked : internalChecked;

  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isChecked) {
      Animated.sequence([
        Animated.spring(scale, {
          toValue: 1.15,
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
  }, [isChecked, scale]);

  const handlePress = () => {
    const next = !isChecked;
    if (onChange) {
      onChange(next);
    } else {
      setInternalChecked(next);
    }
  };

  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.md,
      }}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Animated.View
        style={{
          width: 22,
          height: 22,
          borderRadius: 6,
          borderWidth: 2,
          borderColor: isChecked ? colors.primary600 : colors.border,
          backgroundColor: isChecked ? colors.primary600 : colors.surface,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: spacing.md,
          transform: [{ scale }],
        }}
      >
        {isChecked && <Icon name={'check' as any} size={14} color={colors.white} />}
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

export default Checkbox;
