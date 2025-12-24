import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Button from '../components/Button';
import { theme } from '../theme';

const ComponentsScreen = () => {
  const [loading, setLoading] = useState(false);

  const handlePress = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Buttons</Text>

      <Button title="Primary Button" onPress={handlePress} />
      <Button title="Loading Button" loading={loading} />
      <Button title="Disabled Button" disabled />
      <Button title="Outline Button" variant="outline" />

      <Button
        title="Debounced Button (1s)"
        debounceMs={1000}
        onPress={() => console.log('Pressed')}
      />

      <Button
        title="Button With Icon"
        icon={<Text>⭐</Text>}
      />
    </View>
  );
};

export default ComponentsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: '700',
    marginBottom: theme.spacing.md,
    color: theme.colors.textPrimary,
  },
});
