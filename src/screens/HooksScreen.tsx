import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const HooksScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>RNToolbox</Text>
      <Text>Hooks Screen</Text>
    </View>
  );
};

export default HooksScreen;

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
