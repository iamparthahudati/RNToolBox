import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ComponentsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>RNToolbox</Text>
      <Text>Components Screen</Text>
    </View>
  );
};

export default ComponentsScreen;

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
