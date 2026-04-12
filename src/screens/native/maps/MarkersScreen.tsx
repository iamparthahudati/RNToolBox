import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, {
  Callout,
  LatLng,
  Marker,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../../components/Header';
import { RootStackParamList } from '../../../navigation/types';
import { theme } from '../../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'NativeMapsMarkers'>;

interface MarkerData {
  id: string;
  coordinate: LatLng;
  title: string;
  description: string;
  pinColor: string;
  isCustom?: boolean;
}

const PRESET_MARKERS: MarkerData[] = [
  {
    id: 'times-square',
    coordinate: { latitude: 40.758, longitude: -73.9855 },
    title: 'Times Square',
    description: 'The Crossroads of the World',
    pinColor: 'red',
  },
  {
    id: 'central-park',
    coordinate: { latitude: 40.7851, longitude: -73.9683 },
    title: 'Central Park',
    description: "NYC's famous urban park",
    pinColor: 'green',
  },
  {
    id: 'brooklyn-bridge',
    coordinate: { latitude: 40.7061, longitude: -73.9969 },
    title: 'Brooklyn Bridge',
    description: 'Iconic 1883 suspension bridge',
    pinColor: 'orange',
  },
  {
    id: 'statue-of-liberty',
    coordinate: { latitude: 40.6892, longitude: -74.0445 },
    title: 'Statue of Liberty',
    description: 'Symbol of freedom and democracy',
    pinColor: 'blue',
  },
];

const INITIAL_REGION = {
  latitude: 40.73,
  longitude: -74.006,
  latitudeDelta: 0.18,
  longitudeDelta: 0.18,
};

export default function MarkersScreen(_props: Props) {
  const [customMarkers, setCustomMarkers] = useState<MarkerData[]>([]);

  const handleMapPress = (e: { nativeEvent: { coordinate: LatLng } }) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    const marker: MarkerData = {
      id: `custom-${Date.now()}`,
      coordinate: { latitude, longitude },
      title: 'Custom Pin',
      description: `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`,
      pinColor: 'violet',
      isCustom: true,
    };
    setCustomMarkers(prev => [...prev, marker]);
  };

  const removeMarker = (id: string) =>
    setCustomMarkers(prev => prev.filter(m => m.id !== id));

  const clearCustom = () => setCustomMarkers([]);

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <Header title="Markers" />
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
          initialRegion={INITIAL_REGION}
          onPress={handleMapPress}
        >
          {[...PRESET_MARKERS, ...customMarkers].map(marker => (
            <Marker
              key={marker.id}
              coordinate={marker.coordinate}
              pinColor={marker.pinColor}
            >
              <Callout tooltip={false} onPress={marker.isCustom ? () => removeMarker(marker.id) : undefined}>
                <View style={styles.callout}>
                  <Text style={styles.calloutTitle}>{marker.title}</Text>
                  <Text style={styles.calloutDesc}>{marker.description}</Text>
                  {marker.isCustom && (
                    <Text style={styles.calloutRemove}>Tap to remove</Text>
                  )}
                </View>
              </Callout>
            </Marker>
          ))}
        </MapView>

        {/* Info bar */}
        <View style={styles.infoBar}>
          <Text style={styles.infoText}>
            Tap map to add pin · Tap callout to remove
          </Text>
          {customMarkers.length > 0 && (
            <TouchableOpacity
              style={styles.clearBtn}
              onPress={clearCustom}
              activeOpacity={0.7}
            >
              <Text style={styles.clearBtnText}>
                Clear ({customMarkers.length})
              </Text>
            </TouchableOpacity>
          )}
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
  callout: {
    padding: theme.spacing.sm,
    minWidth: 140,
    maxWidth: 200,
  },
  calloutTitle: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 2,
  },
  calloutDesc: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.textSecondary,
  },
  calloutRemove: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.error,
    fontWeight: '600',
    marginTop: 4,
  },
  infoBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  infoText: {
    flex: 1,
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.textSecondary,
  },
  clearBtn: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: 6,
    backgroundColor: theme.colors.error + '15',
  },
  clearBtnText: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.error,
    fontWeight: '600',
  },
});
