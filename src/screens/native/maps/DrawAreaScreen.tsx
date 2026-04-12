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
  LatLng,
  Marker,
  Polygon,
  Polyline,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../../components/Header';
import { RootStackParamList } from '../../../navigation/types';
import { theme } from '../../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'NativeMapsDrawArea'>;

// ---------------------------------------------------------------------------
// Geo math
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

function calcPerimeter(pts: LatLng[]): number {
  if (pts.length < 2) {
    return 0;
  }
  let total = 0;
  for (let i = 0; i < pts.length; i++) {
    total += haversine(pts[i], pts[(i + 1) % pts.length]);
  }
  return total;
}

// Spherical excess formula — accurate for geographic polygons
function calcArea(pts: LatLng[]): number {
  if (pts.length < 3) {
    return 0;
  }
  const R = 6_371_000;
  let sum = 0;
  const n = pts.length;
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    const lat1 = (pts[i].latitude * Math.PI) / 180;
    const lat2 = (pts[j].latitude * Math.PI) / 180;
    const dLon = ((pts[j].longitude - pts[i].longitude) * Math.PI) / 180;
    sum += (2 + Math.sin(lat1) + Math.sin(lat2)) * dLon;
  }
  return Math.abs((sum * R * R) / 2);
}

function fmtDist(m: number): string {
  return m >= 1000 ? `${(m / 1000).toFixed(2)} km` : `${Math.round(m)} m`;
}

function fmtArea(sqm: number): string {
  return sqm >= 1_000_000
    ? `${(sqm / 1_000_000).toFixed(3)} km²`
    : `${Math.round(sqm).toLocaleString()} m²`;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const INITIAL_REGION = {
  latitude: 40.7128,
  longitude: -74.006,
  latitudeDelta: 0.04,
  longitudeDelta: 0.04,
};

export default function DrawAreaScreen(_props: Props) {
  const [points, setPoints] = useState<LatLng[]>([]);
  const [closed, setClosed] = useState(false);

  const handleMapPress = (e: { nativeEvent: { coordinate: LatLng } }) => {
    if (closed) {
      return;
    }
    setPoints(prev => [...prev, e.nativeEvent.coordinate]);
  };

  const undo = () => {
    if (closed) {
      setClosed(false);
    } else {
      setPoints(prev => prev.slice(0, -1));
    }
  };

  const clear = () => {
    setPoints([]);
    setClosed(false);
  };

  const toggleClose = () => {
    if (points.length >= 3) {
      setClosed(c => !c);
    }
  };

  const canClose = points.length >= 3;
  const area = closed ? calcArea(points) : 0;
  const perimeter = closed ? calcPerimeter(points) : 0;

  const instruction = closed
    ? 'Shape complete — tap Reopen to keep editing'
    : points.length === 0
      ? 'Tap the map to place your first vertex'
      : points.length < 3
        ? `${points.length} point${points.length > 1 ? 's' : ''} — add ${3 - points.length} more to close`
        : 'Keep tapping to add vertices, or tap Close Shape';

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <Header title="Draw Area" />
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
          initialRegion={INITIAL_REGION}
          onPress={handleMapPress}
        >
          {/* Filled polygon once closed */}
          {closed && (
            <Polygon
              coordinates={points}
              strokeColor={theme.colors.primary}
              strokeWidth={2}
              fillColor={theme.colors.primary + '33'}
            />
          )}

          {/* Live polyline while drawing */}
          {!closed && points.length >= 2 && (
            <Polyline
              coordinates={points}
              strokeColor={theme.colors.primary}
              strokeWidth={2.5}
            />
          )}

          {/* Dashed closing-edge preview (last → first) */}
          {!closed && points.length >= 3 && (
            <Polyline
              coordinates={[points[points.length - 1], points[0]]}
              strokeColor={theme.colors.primary + '80'}
              strokeWidth={2}
              lineDashPattern={[8, 6]}
            />
          )}

          {/* Numbered vertex markers */}
          {points.map((pt, idx) => (
            <Marker
              key={`v-${idx}`}
              coordinate={pt}
              anchor={{ x: 0.5, y: 0.5 }}
              tracksViewChanges={false}
            >
              <View style={styles.vertex}>
                <Text style={styles.vertexLabel}>{idx + 1}</Text>
              </View>
            </Marker>
          ))}
        </MapView>

        {/* Floating instruction badge */}
        <View style={[styles.badge, closed && styles.badgeDone]}>
          <Text style={styles.badgeText}>{instruction}</Text>
        </View>

        {/* Bottom panel */}
        <View style={styles.panel}>
          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{points.length}</Text>
              <Text style={styles.statLabel}>Vertices</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>
                {closed ? fmtDist(perimeter) : '—'}
              </Text>
              <Text style={styles.statLabel}>Perimeter</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>
                {closed ? fmtArea(area) : '—'}
              </Text>
              <Text style={styles.statLabel}>Area</Text>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={[
                styles.btn,
                styles.btnGhost,
                points.length === 0 && styles.btnDisabled,
              ]}
              onPress={undo}
              disabled={points.length === 0}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.btnGhostText,
                  points.length === 0 && styles.btnDisabledText,
                ]}
              >
                {closed ? 'Reopen' : 'Undo'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.btn,
                styles.btnGhost,
                points.length === 0 && styles.btnDisabled,
              ]}
              onPress={clear}
              disabled={points.length === 0}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.btnDangerText,
                  points.length === 0 && styles.btnDisabledText,
                ]}
              >
                Clear
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.btn,
                styles.btnPrimary,
                !canClose && styles.btnDisabled,
              ]}
              onPress={toggleClose}
              disabled={!canClose}
              activeOpacity={0.8}
            >
              <Text style={styles.btnPrimaryText}>
                {closed ? 'Edit Shape' : 'Close Shape'}
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

  // Instruction badge
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
  badgeDone: {
    backgroundColor: theme.colors.success + 'EE',
  },
  badgeText: {
    color: theme.colors.white,
    fontSize: theme.typography.sizes.xs,
    fontWeight: '600',
    textAlign: 'center',
  },

  // Vertex marker
  vertex: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: theme.colors.primary,
    borderWidth: 2,
    borderColor: theme.colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vertexLabel: {
    color: theme.colors.white,
    fontSize: 11,
    fontWeight: '700',
    lineHeight: 14,
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

  // Buttons
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
  btnPrimary: {
    backgroundColor: theme.colors.primary,
  },
  btnGhost: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  btnDisabled: {
    opacity: 0.4,
  },
  btnPrimaryText: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: '700',
    color: theme.colors.white,
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
