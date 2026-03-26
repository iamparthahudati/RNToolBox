import React from 'react';
import { StyleSheet, View } from 'react-native';
import { theme } from '../../../theme';

type DividerProps = {
  horizontal?: boolean;
};

const Divider = ({ horizontal = true }: DividerProps) => (
  <View style={horizontal ? styles.horizontal : styles.vertical} />
);

export default Divider;

const styles = StyleSheet.create({
  horizontal: {
    height: 1,
    backgroundColor: theme.colors.border,
    width: '100%',
  },
  vertical: {
    width: 1,
    backgroundColor: theme.colors.border,
  },
});
