import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useRef, useState } from 'react';
import {
  LayoutChangeEvent,
  PanResponder,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, {
  Circle,
  LatLng,
  Marker,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../../components/Header';
import { RootStackParamList } from '../../../navigation/types';
import { theme } from '../../../theme';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Props = NativeStackScreenProps<RootStackParamList, 'NativeMapsCircleDraw'>;

interface DrawnCircle {
  id: number;
  center: LatLng;
  radiusMeters: number;
  color: string;
}

interface DraftCircle {
  center: LatLng;
  centerPx: { x: number; y: number };
  radiusMeters: number;
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

const PRESET_COLORS = [
  { key: 'blue', value: theme.colors.primary },
  { key: 'red', value: '#EF4444' },
  { key: 'green', value: '#16A34A' },
  { key: 'amber', value: '#D97706' },
] as const;

// ---------------------------------------------------------------------------
// Geo helpers
// ---------------------------------------------------------------------------

function haversine(a: LatLng, b: LatLng): number {
  const R = 6_371_000;
  const lat1 = (a.latitude * Math.PI) / 180;
  const lat2 = (b.latitude * Math.PI) / 180;
  const dLat = lat2 - lat1;
  const dLon = ((b.longitude - a.longitude) * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function formatRadius(meters: number): string {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(2)} km`;
  }
  return `${Math.round(meters)} m`;
}

function formatArea(sqm: number): string {
  if (sqm >= 1_000_000) {
    return `${(sqm / 1_000_000).toFixed(3)} km²`;
  }
  if (sqm >= 10_000) {
    return `${(sqm / 10_000).toFixed(2)} ha`;
  }
  return `${Math.round(sqm).toLocaleString()} m²`;
}

function circleArea(r: number): number {
  return Math.PI * r * r;
}

function circleCircumference(r: number): number {
  return 2 * Math.PI * r;
}

function pixelDistance(ax: number, ay: number, bx: number, by: number): number {
  return Math.sqrt((bx - ax) ** 2 + (by - ay) ** 2);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

let nextId = 1;

export default function CircleDrawScreen(_props: Props) {
  const mapRef = useRef<MapView>(null);

  // Committed circles
  const [circles, setCircles] = useState<DrawnCircle[]>([]);

  // Active draft while the user is dragging
  const [draft, setDraft] = useState<DraftCircle | null>(null);

  // Whether the gesture overlay is locked (intercepts touches) or unlocked (map pans)
  const [gestureLocked, setGestureLocked] = useState(true);

  // Map layout height — needed to compute meters-per-pixel
  const mapHeightRef = useRef<number>(0);

  // Current map region — updated via onRegionChange
  const regionRef = useRef(INITIAL_REGION);

  // Selected color for the next circle
  const [selectedColor, setSelectedColor] = useState<string>(
    PRESET_COLORS[0].value,
  );

  // Last committed/live radius for the stat display
  const [lastRadius, setLastRadius] = useState<number | null>(null);

  // Refs used inside PanResponder (avoids stale closures)
  const selectedColorRef = useRef(selectedColor);
  selectedColorRef.current = selectedColor;

  const draftRef = useRef<DraftCircle | null>(null);
  draftRef.current = draft;

  // -------------------------------------------------------------------------
  // Helpers
  // -------------------------------------------------------------------------

  const metersPerPixel = useCallback((): number => {
    const region = regionRef.current;
    const h = mapHeightRef.current;
    if (h <= 0) {
      return 1;
    }
    // 1 degree latitude ≈ 111320 m
    return (region.latitudeDelta * 111320) / h;
  }, []);

  const resolveCenter = useCallback(
    async (px: { x: number; y: number }): Promise<LatLng | null> => {
      try {
        const coord = await mapRef.current?.coordinateForPoint(px);
        return coord ?? null;
      } catch {
        return null;
      }
    },
    [],
  );

  // -------------------------------------------------------------------------
  // PanResponder
  // -------------------------------------------------------------------------

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: async evt => {
        const { locationX, locationY } = evt.nativeEvent;
        const px = { x: locationX, y: locationY };
        const center = await resolveCenter(px);
        if (!center) {
          return;
        }
        const newDraft: DraftCircle = {
          center,
          centerPx: px,
          radiusMeters: 0,
        };
        draftRef.current = newDraft;
        setDraft(newDraft);
        setLastRadius(0);
      },

      onPanResponderMove: evt => {
        const current = draftRef.current;
        if (!current) {
          return;
        }
        const { locationX, locationY } = evt.nativeEvent;
        const pxDist = pixelDistance(
          current.centerPx.x,
          current.centerPx.y,
          locationX,
          locationY,
        );
        const mpp = metersPerPixel();
        const radiusMeters = Math.max(1, pxDist * mpp);
        const updated: DraftCircle = { ...current, radiusMeters };
        draftRef.current = updated;
        setDraft(updated);
        setLastRadius(radiusMeters);
      },

      onPanResponderRelease: async evt => {
        const current = draftRef.current;
        if (!current || current.radiusMeters < 1) {
          setDraft(null);
          draftRef.current = null;
          return;
        }
        // Resolve the release point to a LatLng and use haversine for the
        // final committed radius — gives an accurate real-world measurement.
        const { locationX, locationY } = evt.nativeEvent;
        let finalRadius = current.radiusMeters;
        try {
          const edgeCoord = await mapRef.current?.coordinateForPoint({
            x: locationX,
            y: locationY,
          });
          if (edgeCoord) {
            finalRadius = haversine(current.center, edgeCoord);
          }
        } catch {
          // Fall back to pixel-scale estimate already stored in current
        }
        const committed: DrawnCircle = {
          id: nextId++,
          center: current.center,
          radiusMeters: Math.max(1, finalRadius),
          color: selectedColorRef.current,
        };
        setCircles(prev => [...prev, committed]);
        setLastRadius(committed.radiusMeters);
        setDraft(null);
        draftRef.current = null;
      },

      onPanResponderTerminate: () => {
        setDraft(null);
        draftRef.current = null;
      },
    }),
  ).current;

  // -------------------------------------------------------------------------
  // Actions
  // -------------------------------------------------------------------------

  const clearAll = () => {
    setCircles([]);
    setDraft(null);
    draftRef.current = null;
    setLastRadius(null);
  };

  const undoLast = () => {
    setCircles(prev => {
      const next = prev.slice(0, -1);
      if (next.length === 0) {
        setLastRadius(null);
      } else {
        setLastRadius(next[next.length - 1].radiusMeters);
      }
      return next;
    });
  };

  // -------------------------------------------------------------------------
  // Derived UI state
  // -------------------------------------------------------------------------

  const isDragging = draft !== null && draft.radiusMeters > 0;
  const instruction = isDragging
    ? 'Drag to set radius — release to confirm'
    : 'Tap to place center';

  const displayRadius = draft !== null ? draft.radiusMeters : lastRadius;
  const displayArea =
    displayRadius !== null && displayRadius > 0
      ? circleArea(displayRadius)
      : null;
  const displayCircumference =
    displayRadius !== null && displayRadius > 0
      ? circleCircumference(displayRadius)
      : null;

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <Header title="Circle Draw" />

      <View style={styles.mapContainer}>
        {/* Map */}
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
          initialRegion={INITIAL_REGION}
          scrollEnabled={!gestureLocked}
          zoomEnabled={!gestureLocked}
          rotateEnabled={false}
          pitchEnabled={false}
          onRegionChange={region => {
            regionRef.current = region;
          }}
          onLayout={(e: LayoutChangeEvent) => {
            mapHeightRef.current = e.nativeEvent.layout.height;
          }}
        >
          {/* Committed circles */}
          {circles.map(c => (
            <React.Fragment key={c.id}>
              <Circle
                center={c.center}
                radius={c.radiusMeters}
                strokeColor={c.color}
                strokeWidth={2}
                fillColor={c.color + '33'}
              />
              <Marker
                coordinate={c.center}
                anchor={{ x: 0.5, y: 0.5 }}
                tracksViewChanges={false}
              >
                <View
                  style={[styles.centerDot, { backgroundColor: c.color }]}
                />
              </Marker>
            </React.Fragment>
          ))}

          {/* Draft circle (live while dragging) */}
          {draft && draft.radiusMeters > 0 && (
            <>
              <Circle
                center={draft.center}
                radius={draft.radiusMeters}
                strokeColor={selectedColor}
                strokeWidth={2.5}
                fillColor={selectedColor + '28'}
              />
              <Marker
                coordinate={draft.center}
                anchor={{ x: 0.5, y: 0.5 }}
                tracksViewChanges={false}
              >
                <View
                  style={[
                    styles.centerDot,
                    styles.centerDotDraft,
                    { backgroundColor: selectedColor },
                  ]}
                />
              </Marker>
            </>
          )}
        </MapView>

        {/* Transparent gesture overlay — only active when locked */}
        {gestureLocked && (
          <View style={StyleSheet.absoluteFill} {...panResponder.panHandlers} />
        )}

        {/* Floating instruction badge */}
        <View style={[styles.badge, isDragging && styles.badgeDragging]}>
          <Text style={styles.badgeText}>{instruction}</Text>
        </View>

        {/* Lock / unlock toggle */}
        <TouchableOpacity
          style={styles.lockBtn}
          onPress={() => setGestureLocked(l => !l)}
          activeOpacity={0.8}
        >
          <Text style={styles.lockBtnText}>
            {gestureLocked ? 'Unlock Map' : 'Lock to Draw'}
          </Text>
        </TouchableOpacity>

        {/* Bottom panel */}
        <View style={styles.panel}>
          {/* Stats row */}
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{circles.length}</Text>
              <Text style={styles.statLabel}>Circles</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text
                style={styles.statValue}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {displayRadius !== null && displayRadius > 0
                  ? formatRadius(displayRadius)
                  : '—'}
              </Text>
              <Text style={styles.statLabel}>
                {draft !== null ? 'Live Radius' : 'Radius'}
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text
                style={styles.statValue}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {displayArea !== null ? formatArea(displayArea) : '—'}
              </Text>
              <Text style={styles.statLabel}>Area</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text
                style={styles.statValue}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {displayCircumference !== null
                  ? formatRadius(displayCircumference)
                  : '—'}
              </Text>
              <Text style={styles.statLabel}>Perimeter</Text>
            </View>
          </View>

          {/* Color picker */}
          <View style={styles.colorRow}>
            <Text style={styles.colorLabel}>Color</Text>
            <View style={styles.colorSwatches}>
              {PRESET_COLORS.map(preset => (
                <TouchableOpacity
                  key={preset.key}
                  style={[
                    styles.swatch,
                    { backgroundColor: preset.value },
                    selectedColor === preset.value && styles.swatchSelected,
                  ]}
                  onPress={() => setSelectedColor(preset.value)}
                  activeOpacity={0.8}
                />
              ))}
            </View>
          </View>

          {/* Action buttons */}
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={[
                styles.btn,
                styles.btnGhost,
                circles.length === 0 && styles.btnDisabled,
              ]}
              onPress={undoLast}
              disabled={circles.length === 0}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.btnGhostText,
                  circles.length === 0 && styles.btnDisabledText,
                ]}
              >
                Undo Last
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.btn,
                styles.btnGhost,
                circles.length === 0 && styles.btnDisabled,
              ]}
              onPress={clearAll}
              disabled={circles.length === 0}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.btnDangerText,
                  circles.length === 0 && styles.btnDisabledText,
                ]}
              >
                Clear All
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

  // Center dot marker
  centerDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: theme.colors.white,
  },
  centerDotDraft: {
    width: 14,
    height: 14,
    borderRadius: 7,
    opacity: 0.85,
  },

  // Floating instruction badge
  badge: {
    position: 'absolute',
    top: theme.spacing.md,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: 20,
    maxWidth: '88%',
  },
  badgeDragging: {
    backgroundColor: theme.colors.primary + 'EE',
  },
  badgeText: {
    color: theme.colors.white,
    fontSize: theme.typography.sizes.xs,
    fontWeight: '600',
    textAlign: 'center',
  },

  // Lock / unlock button
  lockBtn: {
    position: 'absolute',
    top: theme.spacing.md,
    right: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  lockBtnText: {
    fontSize: theme.typography.sizes.xs,
    fontWeight: '600',
    color: theme.colors.textPrimary,
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

  // Stats
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

  // Color picker
  colorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  colorLabel: {
    fontSize: theme.typography.sizes.xs,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    width: 36,
  },
  colorSwatches: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  swatch: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  swatchSelected: {
    borderColor: theme.colors.textPrimary,
    transform: [{ scale: 1.15 }],
  },

  // Action buttons
  actionsRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
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
});
