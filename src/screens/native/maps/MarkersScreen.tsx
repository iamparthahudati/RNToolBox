import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../../components/Header';
import { RootStackParamList } from '../../../navigation/types';
import { theme } from '../../../theme';

const MarkersScreen = (
  _props: NativeStackScreenProps<RootStackParamList, 'NativeMapsMarkers'>,
) => {
  return (
    <SafeAreaView style={styles.root}>
      <Header title="Markers" />
      <View style={styles.center}>
        <Text style={styles.title}>Markers</Text>
        <Text style={styles.subtitle}>
          Custom map markers and callouts will appear here
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  title: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default MarkersScreen;
