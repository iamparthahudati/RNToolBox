import MapView, { Heatmap, PROVIDER_GOOGLE } from 'react-native-maps';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';

import Header from '../../../components/Header';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../navigation/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'NativeMapsHeatmap'>;

const HEATMAP_POINTS: {
  latitude: number;
  longitude: number;
  weight: number;
}[] = [
  // Times Square cluster — heavy
  { latitude: 40.758, longitude: -73.9855, weight: 1.0 },
  { latitude: 40.7575, longitude: -73.9866, weight: 0.95 },
  { latitude: 40.7592, longitude: -73.9843, weight: 0.9 },
  // Midtown cluster — heavy
  { latitude: 40.754, longitude: -73.984, weight: 0.92 },
  { latitude: 40.7528, longitude: -73.9772, weight: 0.88 },
  { latitude: 40.7549, longitude: -73.9799, weight: 0.85 },
  { latitude: 40.7506, longitude: -73.9971, weight: 0.82 },
  // Central Park South — heavy
  { latitude: 40.767, longitude: -73.979, weight: 0.9 },
  { latitude: 40.7648, longitude: -73.9733, weight: 0.84 },
  { latitude: 40.7689, longitude: -73.9815, weight: 0.8 },
  // Upper West Side — medium
  { latitude: 40.787, longitude: -73.975, weight: 0.55 },
  { latitude: 40.7831, longitude: -73.9812, weight: 0.5 },
  { latitude: 40.7952, longitude: -73.9726, weight: 0.45 },
  // Upper East Side — medium
  { latitude: 40.7736, longitude: -73.9566, weight: 0.52 },
  { latitude: 40.7794, longitude: -73.9632, weight: 0.48 },
  // Lower Manhattan — medium-heavy
  { latitude: 40.7127, longitude: -74.0059, weight: 0.72 },
  { latitude: 40.7074, longitude: -74.0113, weight: 0.68 },
  { latitude: 40.7193, longitude: -74.0001, weight: 0.6 },
  { latitude: 40.7061, longitude: -73.9969, weight: 0.58 },
  // Greenwich Village / SoHo — medium
  { latitude: 40.7308, longitude: -74.0027, weight: 0.55 },
  { latitude: 40.7243, longitude: -73.9987, weight: 0.5 },
  { latitude: 40.7282, longitude: -73.9942, weight: 0.47 },
  // Brooklyn — lighter
  { latitude: 40.6782, longitude: -73.9442, weight: 0.42 },
  { latitude: 40.6892, longitude: -73.9442, weight: 0.38 },
  { latitude: 40.6501, longitude: -73.9496, weight: 0.35 },
  { latitude: 40.6943, longitude: -73.9249, weight: 0.32 },
  // Queens — lighter
  { latitude: 40.7282, longitude: -73.7949, weight: 0.38 },
  { latitude: 40.7489, longitude: -73.8448, weight: 0.34 },
  { latitude: 40.7614, longitude: -73.8296, weight: 0.3 },
  // Harlem — medium
  { latitude: 40.8116, longitude: -73.9465, weight: 0.58 },
  { latitude: 40.8176, longitude: -73.9549, weight: 0.52 },
  // Bronx — lighter
  { latitude: 40.8448, longitude: -73.8648, weight: 0.36 },
  { latitude: 40.8679, longitude: -73.8791, weight: 0.3 },
  // Staten Island — lightest
  { latitude: 40.5795, longitude: -74.1502, weight: 0.25 },
  { latitude: 40.6295, longitude: -74.0776, weight: 0.28 },
];

const INITIAL_REGION = {
  latitude: 40.73,
  longitude: -74.006,
  latitudeDelta: 0.15,
  longitudeDelta: 0.15,
};

const RADIUS_MIN = 10;
const RADIUS_MAX = 80;
const RADIUS_STEP = 10;
const RADIUS_DEFAULT = 40;

const OPACITY_MIN = 0.2;
const OPACITY_MAX = 1.0;
const OPACITY_STEP = 0.2;
const OPACITY_DEFAULT = 0.7;

export default function HeatmapScreen(_props: Props) {
  const [radius, setRadius] = useState(RADIUS_DEFAULT);
  const [opacity, setOpacity] = useState(OPACITY_DEFAULT);

  const decrementRadius = () =>
    setRadius(prev => Math.max(RADIUS_MIN, prev - RADIUS_STEP));
  const incrementRadius = () =>
    setRadius(prev => Math.min(RADIUS_MAX, prev + RADIUS_STEP));

  const decrementOpacity = () =>
    setOpacity(prev =>
      parseFloat(Math.max(OPACITY_MIN, prev - OPACITY_STEP).toFixed(1)),
    );
  const incrementOpacity = () =>
    setOpacity(prev =>
      parseFloat(Math.min(OPACITY_MAX, prev + OPACITY_STEP).toFixed(1)),
    );

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <Header title="Heatmap" />
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
          initialRegion={INITIAL_REGION}
        >
          <Heatmap points={HEATMAP_POINTS} radius={radius} opacity={opacity} />
        </MapView>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            Radius: {radius} | Opacity: {opacity.toFixed(1)}
          </Text>
        </View>

        <View style={styles.bottomPanel}>
          <View style={styles.controlBlock}>
            <Text style={styles.controlLabel}>Radius</Text>
            <View style={styles.stepperRow}>
              <TouchableOpacity
                style={[
                  styles.stepperBtn,
                  radius <= RADIUS_MIN && styles.stepperBtnDisabled,
                ]}
                onPress={decrementRadius}
                disabled={radius <= RADIUS_MIN}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.stepperBtnText,
                    radius <= RADIUS_MIN && styles.stepperBtnTextDisabled,
                  ]}
                >
                  -
                </Text>
              </TouchableOpacity>
              <Text style={styles.stepperValue}>{radius}</Text>
              <TouchableOpacity
                style={[
                  styles.stepperBtn,
                  radius >= RADIUS_MAX && styles.stepperBtnDisabled,
                ]}
                onPress={incrementRadius}
                disabled={radius >= RADIUS_MAX}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.stepperBtnText,
                    radius >= RADIUS_MAX && styles.stepperBtnTextDisabled,
                  ]}
                >
                  +
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.controlBlock}>
            <Text style={styles.controlLabel}>Opacity</Text>
            <View style={styles.stepperRow}>
              <TouchableOpacity
                style={[
                  styles.stepperBtn,
                  opacity <= OPACITY_MIN && styles.stepperBtnDisabled,
                ]}
                onPress={decrementOpacity}
                disabled={opacity <= OPACITY_MIN}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.stepperBtnText,
                    opacity <= OPACITY_MIN && styles.stepperBtnTextDisabled,
                  ]}
                >
                  -
                </Text>
              </TouchableOpacity>
              <Text style={styles.stepperValue}>{opacity.toFixed(1)}</Text>
              <TouchableOpacity
                style={[
                  styles.stepperBtn,
                  opacity >= OPACITY_MAX && styles.stepperBtnDisabled,
                ]}
                onPress={incrementOpacity}
                disabled={opacity >= OPACITY_MAX}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.stepperBtnText,
                    opacity >= OPACITY_MAX && styles.stepperBtnTextDisabled,
                  ]}
                >
                  +
                </Text>
              </TouchableOpacity>
            </View>
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
  badge: {
    position: 'absolute',
    top: theme.spacing.md,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  badgeText: {
    color: theme.colors.white,
    fontSize: theme.typography.sizes.sm,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  bottomPanel: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  controlBlock: {
    flex: 1,
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  controlLabel: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  stepperBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperBtnDisabled: {
    backgroundColor: theme.colors.neutral50,
  },
  stepperBtnText: {
    color: theme.colors.white,
    fontSize: theme.typography.sizes.lg,
    fontWeight: '700',
    lineHeight: 20,
  },
  stepperBtnTextDisabled: {
    color: theme.colors.textDisabled,
  },
  stepperValue: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.textPrimary,
    fontWeight: '700',
    minWidth: 40,
    textAlign: 'center',
  },
  divider: {
    width: 1,
    height: 52,
    backgroundColor: theme.colors.border,
    marginHorizontal: theme.spacing.sm,
  },
});
