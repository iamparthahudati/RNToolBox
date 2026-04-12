import MapView, {
  LatLng,
  Marker,
  PROVIDER_GOOGLE,
  Polyline,
} from 'react-native-maps';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import Header from '../../../components/Header';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../../theme';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'NativeMapsAnimatedMarker'
>;

type SpeedOption = {
  label: string;
  ms: number;
};

type Waypoint = {
  name: string;
  lat: number;
  lng: number;
};

const WAYPOINTS: Waypoint[] = [
  { name: 'JFK Airport', lat: 40.6413, lng: -73.7781 },
  { name: 'Jamaica, Queens', lat: 40.702, lng: -73.788 },
  { name: 'Brooklyn', lat: 40.678, lng: -73.944 },
  { name: 'Brooklyn Bridge', lat: 40.7061, lng: -73.9969 },
  { name: 'Lower Manhattan', lat: 40.7128, lng: -74.006 },
  { name: 'SoHo', lat: 40.723, lng: -74.0 },
  { name: 'Greenwich Village', lat: 40.733, lng: -73.998 },
  { name: 'Flatiron', lat: 40.7411, lng: -73.9897 },
  { name: 'Times Square', lat: 40.758, lng: -73.9855 },
  { name: 'Central Park', lat: 40.7851, lng: -73.9683 },
];

const COORDS: LatLng[] = WAYPOINTS.map(w => ({
  latitude: w.lat,
  longitude: w.lng,
}));

const SPEED_OPTIONS: SpeedOption[] = [
  { label: 'Slow', ms: 3000 },
  { label: 'Normal', ms: 1500 },
  { label: 'Fast', ms: 600 },
];

const INITIAL_REGION = {
  latitude: 40.72,
  longitude: -73.9,
  latitudeDelta: 0.22,
  longitudeDelta: 0.22,
};

const TOTAL = WAYPOINTS.length;

export default function AnimatedMarkerScreen(_props: Props) {
  const mapRef = useRef<MapView>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const indexRef = useRef<number>(0);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speedMs, setSpeedMs] = useState<number>(1500);
  const [autoFollow, setAutoFollow] = useState<boolean>(true);

  const stopInterval = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const advance = useCallback(() => {
    const next = indexRef.current + 1;
    if (next >= TOTAL) {
      stopInterval();
      setIsPlaying(false);
      return;
    }
    indexRef.current = next;
    setCurrentIndex(next);
    if (autoFollow) {
      mapRef.current?.animateCamera(
        {
          center: {
            latitude: COORDS[next].latitude,
            longitude: COORDS[next].longitude,
          },
          zoom: 13,
        },
        { duration: 900 },
      );
    }
  }, [autoFollow, stopInterval]);

  const startInterval = useCallback(
    (ms: number) => {
      stopInterval();
      intervalRef.current = setInterval(advance, ms);
    },
    [advance, stopInterval],
  );

  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      stopInterval();
      setIsPlaying(false);
    } else {
      if (indexRef.current >= TOTAL - 1) {
        return;
      }
      startInterval(speedMs);
      setIsPlaying(true);
    }
  }, [isPlaying, speedMs, startInterval, stopInterval]);

  const handleReset = useCallback(() => {
    stopInterval();
    setIsPlaying(false);
    indexRef.current = 0;
    setCurrentIndex(0);
    mapRef.current?.animateToRegion(INITIAL_REGION, 600);
  }, [stopInterval]);

  const handleSpeedSelect = useCallback(
    (ms: number) => {
      setSpeedMs(ms);
      if (isPlaying) {
        startInterval(ms);
      }
    },
    [isPlaying, startInterval],
  );

  const toggleAutoFollow = useCallback(() => {
    setAutoFollow(prev => !prev);
  }, []);

  // Restart interval when advance changes (autoFollow toggled while playing)
  useEffect(() => {
    if (isPlaying) {
      startInterval(speedMs);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [advance]);

  useEffect(() => {
    return () => {
      stopInterval();
    };
  }, [stopInterval]);

  const isFinished = currentIndex >= TOTAL - 1;
  const progressPercent = currentIndex / (TOTAL - 1);
  const currentWaypoint = WAYPOINTS[currentIndex];

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <Header title="Animated Marker" />
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
          initialRegion={INITIAL_REGION}
          scrollEnabled
          zoomEnabled
        >
          {/* Full route polyline (faded) */}
          <Polyline
            key="route-full"
            coordinates={COORDS}
            strokeColor={theme.colors.primary + '55'}
            strokeWidth={3}
            lineDashPattern={[6, 4]}
          />

          {/* Travelled segment — always mounted, zero-length coords when at start */}
          <Polyline
            key="route-travelled"
            coordinates={
              currentIndex > 0
                ? COORDS.slice(0, currentIndex + 1)
                : [COORDS[0], COORDS[0]]
            }
            strokeColor={theme.colors.primary}
            strokeWidth={4}
          />

          {/* Origin marker */}
          <Marker
            key="marker-origin"
            identifier="origin"
            coordinate={COORDS[0]}
            anchor={{ x: 0.5, y: 0.5 }}
            title={WAYPOINTS[0].name}
          >
            <View style={styles.endpointMarker}>
              <View style={styles.endpointInner} />
            </View>
          </Marker>

          {/* Destination marker */}
          <Marker
            key="marker-destination"
            identifier="destination"
            coordinate={COORDS[TOTAL - 1]}
            anchor={{ x: 0.5, y: 0.5 }}
            title={WAYPOINTS[TOTAL - 1].name}
          >
            <View style={[styles.endpointMarker, styles.destinationMarker]}>
              <View style={[styles.endpointInner, styles.destinationInner]} />
            </View>
          </Marker>

          {/* Moving vehicle marker */}
          <Marker
            key="marker-vehicle"
            identifier="vehicle"
            coordinate={COORDS[currentIndex]}
            anchor={{ x: 0.5, y: 0.5 }}
            tracksViewChanges={isPlaying}
          >
            <View style={styles.vehicleOuter}>
              <View style={styles.vehicleMarker} />
            </View>
          </Marker>
        </MapView>

        {/* Floating waypoint badge */}
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{currentWaypoint.name}</Text>
        </View>

        {/* Bottom panel */}
        <View style={styles.panel}>
          {/* Progress bar */}
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${progressPercent * 100}%` },
              ]}
            />
          </View>

          {/* Step label */}
          <View style={styles.stepRow}>
            <Text style={styles.stepLabel}>
              Stop {currentIndex + 1} of {TOTAL}
            </Text>
            <Text style={styles.stepName}>{currentWaypoint.name}</Text>
          </View>

          {/* Controls row */}
          <View style={styles.controlsRow}>
            {/* Play / Pause */}
            <TouchableOpacity
              style={[
                styles.ctrlBtn,
                styles.ctrlBtnPrimary,
                isFinished && !isPlaying && styles.ctrlBtnDisabled,
              ]}
              onPress={togglePlayPause}
              activeOpacity={0.75}
              disabled={isFinished && !isPlaying}
            >
              <Text style={styles.ctrlBtnPrimaryText}>
                {isPlaying ? 'Pause' : isFinished ? 'Done' : 'Play'}
              </Text>
            </TouchableOpacity>

            {/* Reset */}
            <TouchableOpacity
              style={[styles.ctrlBtn, styles.ctrlBtnSecondary]}
              onPress={handleReset}
              activeOpacity={0.75}
            >
              <Text style={styles.ctrlBtnSecondaryText}>Reset</Text>
            </TouchableOpacity>

            {/* Auto-follow toggle */}
            <TouchableOpacity
              style={[
                styles.ctrlBtn,
                styles.ctrlBtnSecondary,
                autoFollow && styles.ctrlBtnFollowActive,
              ]}
              onPress={toggleAutoFollow}
              activeOpacity={0.75}
            >
              <Text
                style={[
                  styles.ctrlBtnSecondaryText,
                  autoFollow && styles.ctrlBtnFollowActiveText,
                ]}
              >
                Follow
              </Text>
            </TouchableOpacity>
          </View>

          {/* Speed selector */}
          <View style={styles.speedRow}>
            <Text style={styles.speedLabel}>Speed</Text>
            <View style={styles.pillGroup}>
              {SPEED_OPTIONS.map(option => (
                <TouchableOpacity
                  key={option.label}
                  style={[
                    styles.pill,
                    speedMs === option.ms && styles.pillActive,
                  ]}
                  onPress={() => handleSpeedSelect(option.ms)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.pillText,
                      speedMs === option.ms && styles.pillTextActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
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

  // Origin / destination endpoint markers
  endpointMarker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.success + '33',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: theme.colors.success,
  },
  endpointInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.success,
  },
  destinationMarker: {
    backgroundColor: theme.colors.error + '33',
    borderColor: theme.colors.error,
  },
  destinationInner: {
    backgroundColor: theme.colors.error,
  },

  // Moving vehicle marker
  vehicleOuter: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.primary + '33',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vehicleMarker: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.primary,
    borderWidth: 3,
    borderColor: theme.colors.white,
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
    letterSpacing: 0.3,
  },

  // Bottom panel
  panel: {
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    gap: theme.spacing.sm,
  },

  // Progress bar
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.border,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: theme.colors.primary,
  },

  // Step info
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepLabel: {
    fontSize: theme.typography.sizes.xs,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  stepName: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },

  // Controls row
  controlsRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  ctrlBtn: {
    flex: 1,
    paddingVertical: theme.spacing.sm + 2,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  ctrlBtnPrimary: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  ctrlBtnPrimaryText: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: '700',
    color: theme.colors.white,
  },
  ctrlBtnSecondary: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
  },
  ctrlBtnSecondaryText: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  ctrlBtnDisabled: {
    backgroundColor: theme.colors.border,
    borderColor: theme.colors.border,
  },
  ctrlBtnFollowActive: {
    backgroundColor: theme.colors.primary50,
    borderColor: theme.colors.primary,
  },
  ctrlBtnFollowActiveText: {
    color: theme.colors.primary,
    fontWeight: '700',
  },

  // Speed selector
  speedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  speedLabel: {
    fontSize: theme.typography.sizes.xs,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    minWidth: 44,
  },
  pillGroup: {
    flex: 1,
    flexDirection: 'row',
    gap: theme.spacing.xs,
  },
  pill: {
    flex: 1,
    paddingVertical: theme.spacing.xs + 2,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary50,
  },
  pillText: {
    fontSize: theme.typography.sizes.xs,
    fontWeight: '500',
    color: theme.colors.textSecondary,
  },
  pillTextActive: {
    color: theme.colors.primary,
    fontWeight: '700',
  },
});
