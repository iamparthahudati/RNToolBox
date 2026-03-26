import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { theme } from '../../../theme';

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
  const [internalChecked, setInternalChecked] = useState(false);
  const isChecked =
    controlledChecked !== undefined ? controlledChecked : internalChecked;

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
      style={styles.row}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.box,
          {
            borderColor: isChecked ? theme.colors.primary : theme.colors.border,
            backgroundColor: isChecked
              ? theme.colors.primary
              : theme.colors.white,
          },
        ]}
      >
        {isChecked && <Text style={styles.checkmark}>&#10003;</Text>}
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

export default Checkbox;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  box: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    marginRight: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: theme.colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  label: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.textPrimary,
  },
});
