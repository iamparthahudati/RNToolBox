import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useRef, useState } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, {
  Circle,
  LatLng,
  Polygon,
  Polyline,
  PROVIDER_GOOGLE,
  Region,
} from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../../components/Header';
import { RootStackParamList } from '../../../navigation/types';
import { theme } from '../../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'NativeMapsPolygon'>;
type OverlayType = 'polygon' | 'polyline' | 'circle';

// Approximate Central Park boundary
const CENTRAL_PARK: LatLng[] = [
  { latitude: 40.7644, longitude: -73.9733 },
  { latitude: 40.7999, longitude: -73.9581 },
  { latitude: 40.7999, longitude: -73.9493 },
  { latitude: 40.7644, longitude: -73.9731 },
  { latitude: 40.7644, longitude: -73.9733 },
];

// Downtown Manhattan route
const MANHATTAN_ROUTE: LatLng[] = [
  { latitude: 40.7048, longitude: -74.0131 },
  { latitude: 40.7192, longitude: -74.005 },
  { latitude: 40.7344, longitude: -73.9993 },
  { latitude: 40.7502, longitude: -73.989 },
  { latitude: 40.7651, longitude: -73.976 },
  { latitude: 40.7813, longitude: -73.9641 },
];

const CIRCLE_CENTER = { latitude: 40.7829, longitude: -73.9654 };

const REGIONS: Record<OverlayType, Region> = {
  polygon: {
    latitude: 40.782,
    longitude: -73.9612,
    latitudeDelta: 0.07,
    longitudeDelta: 0.07,
  },
  polyline: {
    latitude: 40.7430,
    longitude: -73.994,
    latitudeDelta: 0.12,
    longitudeDelta: 0.08,
  },
  circle: {
    latitude: 40.7829,
    longitude: -73.9654,
    latitudeDelta: 0.04,
    longitudeDelta: 0.04,
  },
};

const OPTIONS: { label: string; value: OverlayType; desc: string }[] = [
  { label: 'Polygon', value: 'polygon', desc: 'Filled closed shape' },
  { label: 'Polyline', value: 'polyline', desc: 'Connected line path' },
  { label: 'Circle', value: 'circle', desc: 'Circular filled area' },
];

export default function PolygonScreen(_props: Props) {
  const mapRef = useRef<MapView>(null);
  const [overlay, setOverlay] = useState<OverlayType>('polygon');

  const switchOverlay = (type: OverlayType) => {
    setOverlay(type);
    mapRef.current?.animateToRegion(REGIONS[type], 500);
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <Header title="Polygon" />
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
          initialRegion={REGIONS.polygon}
        >
          {overlay === 'polygon' && (
            <Polygon
              coordinates={CENTRAL_PARK}
              strokeColor={theme.colors.primary}
              strokeWidth={2}
              fillColor={theme.colors.primary + '40'}
            />
          )}
          {overlay === 'polyline' && (
            <Polyline
              coordinates={MANHATTAN_ROUTE}
              strokeColor='#EF4444'
              strokeWidth={4}
              lineDashPattern={[12, 6]}
            />
          )}
          {overlay === 'circle' && (
            <Circle
              center={CIRCLE_CENTER}
              radius={600}
              strokeColor={theme.colors.primary}
              strokeWidth={2}
              fillColor={theme.colors.primary + '30'}
            />
          )}
        </MapView>

        {/* Overlay selector */}
        <View style={styles.controls}>
          {OPTIONS.map(opt => (
            <TouchableOpacity
              key={opt.value}
              style={[styles.optBtn, overlay === opt.value && styles.optBtnActive]}
              onPress={() => switchOverlay(opt.value)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.optBtnTitle,
                  overlay === opt.value && styles.optBtnTitleActive,
                ]}
              >
                {opt.label}
              </Text>
              <Text style={styles.optBtnDesc}>{opt.desc}</Text>
            </TouchableOpacity>
          ))}
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
    flexDirection: 'row',
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    gap: theme.spacing.xs,
  },
  optBtn: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xs,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
  },
  optBtnActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary50,
  },
  optBtnTitle: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: '700',
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  optBtnTitleActive: {
    color: theme.colors.primary,
  },
  optBtnDesc: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});
