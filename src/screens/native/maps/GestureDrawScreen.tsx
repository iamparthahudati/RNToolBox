import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  PanResponder,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, {
  LatLng,
  PROVIDER_GOOGLE,
  Polygon,
  Polyline,
} from 'react-native-maps';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../../components/Header';
import { RootStackParamList } from '../../../navigation/types';
import { theme } from '../../../theme';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Props = NativeStackScreenProps<
  RootStackParamList,
  'NativeMapsGestureDraw'
>;

type DrawMode = 'draw' | 'polygon';

interface Stroke {
  points: LatLng[];
  mode: DrawMode;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const INITIAL_REGION = {
  latitude: 40.7128,
  longitude: -74.006,
  latitudeDelta: 0.04,
  longitudeDelta: 0.04,
};

// Minimum pixel distance between sampled points to avoid over-sampling
const MIN_SAMPLE_DISTANCE = 6;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function dist(ax: number, ay: number, bx: number, by: number): number {
  return Math.sqrt((ax - bx) ** 2 + (ay - by) ** 2);
}

function totalPoints(strokes: Stroke[]): number {
  return strokes.reduce((acc, s) => acc + s.points.length, 0);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function GestureDrawScreen(_props: Props) {
  const mapRef = useRef<MapView>(null);

  const [committedStrokes, setCommittedStrokes] = useState<Stroke[]>([]);
  const [livePoints, setLivePoints] = useState<LatLng[]>([]);
  const [mode, setMode] = useState<DrawMode>('draw');
  const [mapLocked, setMapLocked] = useState(true);

  // Mutable refs used inside PanResponder callbacks (avoids stale closures)
  const livePointsRef = useRef<LatLng[]>([]);
  const lastScreenPt = useRef<{ x: number; y: number } | null>(null);
  const modeRef = useRef<DrawMode>('draw');

  // Keep modeRef in sync
  const setModeSync = useCallback((m: DrawMode) => {
    modeRef.current = m;
    setMode(m);
  }, []);

  // -------------------------------------------------------------------------
  // PanResponder
  // -------------------------------------------------------------------------

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: async evt => {
          const { locationX, locationY } = evt.nativeEvent;
          livePointsRef.current = [];
          lastScreenPt.current = { x: locationX, y: locationY };

          try {
            const coord = await mapRef.current?.coordinateForPoint({
              x: locationX,
              y: locationY,
            });
            if (coord) {
              livePointsRef.current = [coord];
              setLivePoints([coord]);
            }
          } catch {
            // coordinateForPoint may fail if map not ready; silently ignore
          }
        },
        onPanResponderMove: async evt => {
          const { locationX, locationY } = evt.nativeEvent;
          const last = lastScreenPt.current;

          if (
            last &&
            dist(locationX, locationY, last.x, last.y) < MIN_SAMPLE_DISTANCE
          ) {
            return;
          }

          lastScreenPt.current = { x: locationX, y: locationY };

          try {
            const coord = await mapRef.current?.coordinateForPoint({
              x: locationX,
              y: locationY,
            });
            if (coord) {
              livePointsRef.current = [...livePointsRef.current, coord];
              setLivePoints([...livePointsRef.current]);
            }
          } catch {
            // ignore
          }
        },
        onPanResponderRelease: () => {
          const pts = livePointsRef.current;
          if (pts.length >= 2) {
            const stroke: Stroke = {
              points: pts,
              mode: modeRef.current,
            };
            setCommittedStrokes(prev => [...prev, stroke]);
          }
          livePointsRef.current = [];
          lastScreenPt.current = null;
          setLivePoints([]);
        },
        onPanResponderTerminate: () => {
          // Commit whatever we have if gesture is stolen
          const pts = livePointsRef.current;
          if (pts.length >= 2) {
            setCommittedStrokes(prev => [
              ...prev,
              { points: pts, mode: modeRef.current },
            ]);
          }
          livePointsRef.current = [];
          lastScreenPt.current = null;
          setLivePoints([]);
        },
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // -------------------------------------------------------------------------
  // Actions
  // -------------------------------------------------------------------------

  const handleClearAll = useCallback(() => {
    setCommittedStrokes([]);
    setLivePoints([]);
    livePointsRef.current = [];
  }, []);

  const handleUndoLast = useCallback(() => {
    setCommittedStrokes(prev => prev.slice(0, -1));
  }, []);

  const handleToggleMode = useCallback(() => {
    setModeSync(mode === 'draw' ? 'polygon' : 'draw');
  }, [mode, setModeSync]);

  const handleToggleLock = useCallback(() => {
    setMapLocked(v => !v);
  }, []);

  // -------------------------------------------------------------------------
  // Derived
  // -------------------------------------------------------------------------

  const strokeCount = committedStrokes.length;
  const pointCount = totalPoints(committedStrokes);

  const badgeInstruction = !mapLocked
    ? 'Map navigation active — toggle Lock Map to draw'
    : mode === 'draw'
    ? 'Drag on the map to draw a freehand stroke'
    : 'Drag on the map — stroke will close into a polygon';

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <Header title="Gesture Draw" />

      <View style={styles.mapContainer}>
        {/* Map */}
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
          initialRegion={INITIAL_REGION}
          scrollEnabled={!mapLocked}
          zoomEnabled={!mapLocked}
          rotateEnabled={!mapLocked}
          pitchEnabled={!mapLocked}
        >
          {/* Committed strokes */}
          {committedStrokes.map((stroke, idx) =>
            stroke.mode === 'polygon' && stroke.points.length >= 3 ? (
              <Polygon
                key={`polygon-${idx}`}
                coordinates={stroke.points}
                strokeColor={theme.colors.primary}
                strokeWidth={2.5}
                fillColor={theme.colors.primary + '33'}
              />
            ) : (
              <Polyline
                key={`polyline-${idx}`}
                coordinates={stroke.points}
                strokeColor={theme.colors.primary}
                strokeWidth={2.5}
              />
            ),
          )}

          {/* Live stroke being drawn */}
          {livePoints.length >= 2 && (
            <Polyline
              coordinates={livePoints}
              strokeColor={theme.colors.primary + 'CC'}
              strokeWidth={2}
            />
          )}
        </MapView>

        {/* Transparent gesture overlay — active only when map is locked */}
        <View
          {...(mapLocked ? panResponder.panHandlers : {})}
          style={styles.overlay}
          pointerEvents={mapLocked ? 'box-only' : 'none'}
        />

        {/* Floating mode badge */}
        <View
          style={[
            styles.badge,
            !mapLocked && styles.badgeNav,
            mode === 'polygon' && mapLocked && styles.badgePolygon,
          ]}
        >
          <Text style={styles.badgeModeLabel}>
            {!mapLocked ? 'Navigate' : mode === 'draw' ? 'Draw' : 'Polygon'}
          </Text>
          <Text style={styles.badgeInstruction}>{badgeInstruction}</Text>
        </View>

        {/* Bottom panel */}
        <View style={styles.panel}>
          {/* Stats row */}
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{strokeCount}</Text>
              <Text style={styles.statLabel}>Strokes</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>{pointCount}</Text>
              <Text style={styles.statLabel}>Points</Text>
            </View>
          </View>

          {/* Primary actions row */}
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={[
                styles.btn,
                styles.btnGhost,
                strokeCount === 0 && styles.btnDisabled,
              ]}
              onPress={handleClearAll}
              disabled={strokeCount === 0}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.btnDangerText,
                  strokeCount === 0 && styles.btnDisabledText,
                ]}
              >
                Clear All
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.btn,
                styles.btnGhost,
                strokeCount === 0 && styles.btnDisabled,
              ]}
              onPress={handleUndoLast}
              disabled={strokeCount === 0}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.btnGhostText,
                  strokeCount === 0 && styles.btnDisabledText,
                ]}
              >
                Undo Last
              </Text>
            </TouchableOpacity>
          </View>

          {/* Secondary actions row */}
          <View style={[styles.actionsRow, styles.actionsRowTop]}>
            {/* Mode toggle */}
            <TouchableOpacity
              style={[styles.btn, styles.btnSegment]}
              onPress={handleToggleMode}
              activeOpacity={0.8}
            >
              <View style={styles.segmentTrack}>
                <View
                  style={[
                    styles.segmentThumb,
                    mode === 'polygon' && styles.segmentThumbRight,
                  ]}
                />
                <Text
                  style={[
                    styles.segmentLabel,
                    mode === 'draw' && styles.segmentLabelActive,
                  ]}
                >
                  Draw
                </Text>
                <Text
                  style={[
                    styles.segmentLabel,
                    mode === 'polygon' && styles.segmentLabelActive,
                  ]}
                >
                  Polygon
                </Text>
              </View>
            </TouchableOpacity>

            {/* Lock map toggle */}
            <TouchableOpacity
              style={[
                styles.btn,
                styles.btnLock,
                mapLocked ? styles.btnLockActive : styles.btnGhost,
              ]}
              onPress={handleToggleLock}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.btnLockText,
                  !mapLocked && styles.btnLockTextInactive,
                ]}
              >
                {mapLocked ? 'Map Locked' : 'Lock Map'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

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

  // Gesture overlay — sits on top of the map, captures all touch events
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  // Floating badge
  badge: {
    position: 'absolute',
    top: theme.spacing.md,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    maxWidth: '90%',
    alignItems: 'center',
  },
  badgeNav: {
    backgroundColor: theme.colors.neutral700 + 'EE',
  },
  badgePolygon: {
    backgroundColor: theme.colors.primary700 + 'EE',
  },
  badgeModeLabel: {
    color: theme.colors.white,
    fontSize: theme.typography.sizes.xs,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  badgeInstruction: {
    color: theme.colors.white,
    fontSize: theme.typography.sizes.xs,
    fontWeight: '400',
    textAlign: 'center',
    opacity: 0.9,
  },

  // Bottom panel
  panel: {
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
    marginBottom: theme.spacing.sm,
  },
  stat: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: theme.colors.border,
  },
  statValue: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: '700',
    color: theme.colors.primary,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.textSecondary,
  },

  // Button rows
  actionsRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  actionsRowTop: {
    marginTop: theme.spacing.sm,
  },
  btn: {
    flex: 1,
    paddingVertical: theme.spacing.sm + 2,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnGhost: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  btnDisabled: {
    opacity: 0.4,
  },
  btnGhostText: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  btnDangerText: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: '600',
    color: theme.colors.error,
  },
  btnDisabledText: {
    opacity: 0.4,
  },

  // Segment toggle (Draw / Polygon)
  btnSegment: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingVertical: 0,
    height: 40,
  },
  segmentTrack: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    width: '100%',
    paddingHorizontal: 4,
  },
  segmentThumb: {
    position: 'absolute',
    left: 4,
    top: 4,
    bottom: 4,
    width: '50%',
    backgroundColor: theme.colors.primary,
    borderRadius: 7,
  },
  segmentThumbRight: {
    left: undefined,
    right: 4,
  },
  segmentLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: theme.typography.sizes.xs,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    zIndex: 1,
  },
  segmentLabelActive: {
    color: theme.colors.white,
  },

  // Lock map button
  btnLock: {
    borderRadius: 10,
  },
  btnLockActive: {
    backgroundColor: theme.colors.primary,
  },
  btnLockText: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: '700',
    color: theme.colors.white,
  },
  btnLockTextInactive: {
    color: theme.colors.textPrimary,
  },
});
