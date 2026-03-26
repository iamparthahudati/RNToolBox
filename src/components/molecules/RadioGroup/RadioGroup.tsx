import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { theme } from '../../../theme';

type RadioOption = {
  id: string;
  label: string;
};

type RadioGroupProps = {
  options: RadioOption[];
  selected: string;
  onSelect: (id: string) => void;
};

const RadioGroup = ({ options, selected, onSelect }: RadioGroupProps) => (
  <View>
    {options.map(({ id, label }) => {
      const isSelected = selected === id;
      return (
        <TouchableOpacity
          key={id}
          style={styles.row}
          onPress={() => onSelect(id)}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.outer,
              {
                borderColor: isSelected
                  ? theme.colors.primary
                  : theme.colors.border,
              },
            ]}
          >
            {isSelected && <View style={styles.inner} />}
          </View>
          <Text style={styles.label}>{label}</Text>
        </TouchableOpacity>
      );
    })}
  </View>
);

export default RadioGroup;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  outer: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    marginRight: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inner: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: theme.colors.primary,
  },
  label: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.textPrimary,
  },
});
