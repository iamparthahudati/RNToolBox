import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Circle, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../../components/Header';
import { RootStackParamList } from '../../../navigation/types';
import { theme } from '../../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'NativeMapsGeofence'>;

const CENTER = { latitude: 40.7128, longitude: -74.006 }; // Lower Manhattan
const MIN_RADIUS = 100;
const MAX_RADIUS = 5000;
const STEP = 100;

function formatRadius(r: number): string {
  return r >= 1000 ? `${(r / 1000).toFixed(1)} km` : `${r} m`;
}

export default function GeofenceScreen(_props: Props) {
  const [radius, setRadius] = useState(500);

  const decrease = () => setRadius(r => Math.max(MIN_RADIUS, r - STEP));
  const increase = () => setRadius(r => Math.min(MAX_RADIUS, r + STEP));

  // Keep the map framed so the circle stays visible
  const latDelta = Math.max(0.005, (radius / 111320) * 5);
  const initialRegion = {
    ...CENTER,
    latitudeDelta: latDelta,
    longitudeDelta: latDelta,
  };

  const fillPercent =
    ((radius - MIN_RADIUS) / (MAX_RADIUS - MIN_RADIUS)) * 100;

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <Header title="Geofence" />
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
          initialRegion={initialRegion}
          scrollEnabled
          zoomEnabled
        >
          <Marker
            coordinate={CENTER}
            title="Geofence Center"
            description="Lower Manhattan"
          />
          <Circle
            center={CENTER}
            radius={radius}
            strokeColor={theme.colors.primary}
            strokeWidth={2}
            fillColor={theme.colors.primary + '25'}
          />
        </MapView>

        {/* Radius badge */}
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Radius: {formatRadius(radius)}</Text>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <View style={styles.controlsHeader}>
            <Text style={styles.controlsTitle}>Geofence Radius</Text>
            <Text style={styles.controlsValue}>{formatRadius(radius)}</Text>
          </View>

          <View style={styles.sliderRow}>
            <TouchableOpacity
              style={[
                styles.stepBtn,
                radius <= MIN_RADIUS && styles.stepBtnDisabled,
              ]}
              onPress={decrease}
              disabled={radius <= MIN_RADIUS}
              activeOpacity={0.7}
            >
              <Text style={styles.stepBtnText}>−</Text>
            </TouchableOpacity>

            <View style={styles.track}>
              <View style={[styles.fill, { width: `${fillPercent}%` }]} />
            </View>

            <TouchableOpacity
              style={[
                styles.stepBtn,
                radius >= MAX_RADIUS && styles.stepBtnDisabled,
              ]}
              onPress={increase}
              disabled={radius >= MAX_RADIUS}
              activeOpacity={0.7}
            >
              <Text style={styles.stepBtnText}>+</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.rangeRow}>
            <Text style={styles.rangeText}>{formatRadius(MIN_RADIUS)}</Text>
            <Text style={styles.rangeText}>{formatRadius(MAX_RADIUS)}</Text>
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

  // Floating badge
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
    fontWeight: '700',
  },

  // Bottom controls
  controls: {
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  controlsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  controlsTitle: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  controlsValue: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  stepBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnDisabled: {
    backgroundColor: theme.colors.neutral300,
  },
  stepBtnText: {
    fontSize: 22,
    color: theme.colors.white,
    fontWeight: '700',
    lineHeight: 26,
  },
  track: {
    flex: 1,
    height: 6,
    backgroundColor: theme.colors.neutral200,
    borderRadius: 3,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 3,
  },
  rangeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rangeText: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.textSecondary,
  },
});
