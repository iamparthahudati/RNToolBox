import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PermissionsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>RNToolbox</Text>
      <Text>Permissions Screen</Text>
    </View>
  );
};

export default PermissionsScreen;

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
