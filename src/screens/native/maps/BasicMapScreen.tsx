import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { MapType, PROVIDER_GOOGLE } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../../components/Header';
import { RootStackParamList } from '../../../navigation/types';
import { theme } from '../../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'NativeMapsBasic'>;

const MAP_TYPES: { label: string; value: MapType }[] = [
  { label: 'Standard', value: 'standard' },
  { label: 'Satellite', value: 'satellite' },
  { label: 'Hybrid', value: 'hybrid' },
  { label: 'Terrain', value: 'terrain' },
];

const INITIAL_REGION = {
  latitude: 40.7128,
  longitude: -74.006,
  latitudeDelta: 0.04,
  longitudeDelta: 0.04,
};

export default function BasicMapScreen(_props: Props) {
  const [mapType, setMapType] = useState<MapType>('standard');

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <Header title="Basic Map" />
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
          mapType={mapType}
          initialRegion={INITIAL_REGION}
          showsCompass
          showsScale
          showsBuildings
          zoomEnabled
          rotateEnabled
          scrollEnabled
          pitchEnabled
        />

        {/* Map Type controls */}
        <View style={styles.controls}>
          <Text style={styles.controlsLabel}>Map Type</Text>
          <View style={styles.typeRow}>
            {MAP_TYPES.map(({ label, value }) => (
              <TouchableOpacity
                key={value}
                style={[styles.typeBtn, mapType === value && styles.typeBtnActive]}
                onPress={() => setMapType(value)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.typeBtnText,
                    mapType === value && styles.typeBtnTextActive,
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  controls: {
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  controlsLabel: {
    fontSize: theme.typography.sizes.xs,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: theme.spacing.xs,
  },
  typeRow: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
  },
  typeBtn: {
    flex: 1,
    paddingVertical: theme.spacing.xs + 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
  },
  typeBtnActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary50,
  },
  typeBtnText: {
    fontSize: theme.typography.sizes.xs,
    fontWeight: '500',
    color: theme.colors.textSecondary,
  },
  typeBtnTextActive: {
    color: theme.colors.primary,
    fontWeight: '700',
  },
});
