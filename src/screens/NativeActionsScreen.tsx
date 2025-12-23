import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const NativeActionsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>RNToolbox</Text>
      <Text>Native Actions Screen</Text>
    </View>
  );
};

export default NativeActionsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: '600',
  },
});
