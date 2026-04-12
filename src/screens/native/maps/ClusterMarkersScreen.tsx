import MapView, {
  Callout,
  LatLng,
  Marker,
  PROVIDER_GOOGLE,
  Region,
} from 'react-native-maps';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useCallback, useMemo, useRef, useState } from 'react';

import Header from '../../../components/Header';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'NativeMapsCluster'>;

// ---------------------------------------------------------------------------
// Data types
// ---------------------------------------------------------------------------
interface PlaceMarker {
  id: string;
  coordinate: LatLng;
  title: string;
}

interface ClusterGroup {
  id: string;
  coordinate: LatLng;
  count: number;
  markers: PlaceMarker[];
}

type RenderItem =
  | { type: 'cluster'; data: ClusterGroup }
  | { type: 'single'; data: PlaceMarker };

// ---------------------------------------------------------------------------
// 60 fixed markers across NYC boroughs
// Manhattan ~20, Brooklyn ~15, Queens ~10, Bronx ~8, Staten Island ~7
// ---------------------------------------------------------------------------
const ALL_MARKERS: PlaceMarker[] = [
  // Manhattan (20)
  {
    id: 'm01',
    coordinate: { latitude: 40.758, longitude: -73.9855 },
    title: 'Times Square',
  },
  {
    id: 'm02',
    coordinate: { latitude: 40.7484, longitude: -73.9967 },
    title: 'Penn Station',
  },
  {
    id: 'm03',
    coordinate: { latitude: 40.7527, longitude: -73.9772 },
    title: 'Grand Central',
  },
  {
    id: 'm04',
    coordinate: { latitude: 40.7614, longitude: -73.9776 },
    title: 'Rockefeller Center',
  },
  {
    id: 'm05',
    coordinate: { latitude: 40.7061, longitude: -74.0088 },
    title: 'Wall Street',
  },
  {
    id: 'm06',
    coordinate: { latitude: 40.7128, longitude: -74.006 },
    title: 'City Hall',
  },
  {
    id: 'm07',
    coordinate: { latitude: 40.7282, longitude: -73.9942 },
    title: 'SoHo',
  },
  {
    id: 'm08',
    coordinate: { latitude: 40.7209, longitude: -74.0007 },
    title: 'Tribeca',
  },
  {
    id: 'm09',
    coordinate: { latitude: 40.7831, longitude: -73.9712 },
    title: 'Upper West Side',
  },
  {
    id: 'm10',
    coordinate: { latitude: 40.7794, longitude: -73.9632 },
    title: 'Central Park North',
  },
  {
    id: 'm11',
    coordinate: { latitude: 40.7736, longitude: -73.9566 },
    title: 'Museum Mile',
  },
  {
    id: 'm12',
    coordinate: { latitude: 40.7549, longitude: -73.984 },
    title: 'Midtown West',
  },
  {
    id: 'm13',
    coordinate: { latitude: 40.7505, longitude: -73.9934 },
    title: 'Chelsea',
  },
  {
    id: 'm14',
    coordinate: { latitude: 40.7411, longitude: -73.9897 },
    title: 'Flatiron',
  },
  {
    id: 'm15',
    coordinate: { latitude: 40.7359, longitude: -74.0027 },
    title: 'West Village',
  },
  {
    id: 'm16',
    coordinate: { latitude: 40.7265, longitude: -73.9815 },
    title: 'East Village',
  },
  {
    id: 'm17',
    coordinate: { latitude: 40.7157, longitude: -73.997 },
    title: 'Lower East Side',
  },
  {
    id: 'm18',
    coordinate: { latitude: 40.768, longitude: -73.9819 },
    title: 'Columbus Circle',
  },
  {
    id: 'm19',
    coordinate: { latitude: 40.744, longitude: -73.9935 },
    title: 'Hudson Yards',
  },
  {
    id: 'm20',
    coordinate: { latitude: 40.7033, longitude: -74.017 },
    title: 'Battery Park',
  },

  // Brooklyn (15)
  {
    id: 'b01',
    coordinate: { latitude: 40.6782, longitude: -73.9442 },
    title: 'Brooklyn Heights',
  },
  {
    id: 'b02',
    coordinate: { latitude: 40.6892, longitude: -73.9442 },
    title: 'Williamsburg',
  },
  {
    id: 'b03',
    coordinate: { latitude: 40.6501, longitude: -73.9496 },
    title: 'Park Slope',
  },
  {
    id: 'b04',
    coordinate: { latitude: 40.6501, longitude: -73.92 },
    title: 'Crown Heights',
  },
  {
    id: 'b05',
    coordinate: { latitude: 40.6311, longitude: -74.0099 },
    title: 'Bay Ridge',
  },
  {
    id: 'b06',
    coordinate: { latitude: 40.6448, longitude: -73.9782 },
    title: 'Sunset Park',
  },
  {
    id: 'b07',
    coordinate: { latitude: 40.662, longitude: -73.9496 },
    title: 'Prospect Heights',
  },
  {
    id: 'b08',
    coordinate: { latitude: 40.696, longitude: -73.9496 },
    title: 'Greenpoint',
  },
  {
    id: 'b09',
    coordinate: { latitude: 40.6782, longitude: -73.92 },
    title: 'Bushwick',
  },
  {
    id: 'b10',
    coordinate: { latitude: 40.662, longitude: -73.92 },
    title: 'East New York',
  },
  {
    id: 'b11',
    coordinate: { latitude: 40.6311, longitude: -73.9496 },
    title: 'Flatbush',
  },
  {
    id: 'b12',
    coordinate: { latitude: 40.617, longitude: -73.9496 },
    title: 'Midwood',
  },
  {
    id: 'b13',
    coordinate: { latitude: 40.5795, longitude: -73.9496 },
    title: 'Coney Island',
  },
  {
    id: 'b14',
    coordinate: { latitude: 40.6448, longitude: -73.92 },
    title: 'Brownsville',
  },
  {
    id: 'b15',
    coordinate: { latitude: 40.696, longitude: -73.92 },
    title: 'Ridgewood Border',
  },

  // Queens (10)
  {
    id: 'q01',
    coordinate: { latitude: 40.7282, longitude: -73.7949 },
    title: 'Jamaica',
  },
  {
    id: 'q02',
    coordinate: { latitude: 40.7489, longitude: -73.8441 },
    title: 'Jackson Heights',
  },
  {
    id: 'q03',
    coordinate: { latitude: 40.7282, longitude: -73.8441 },
    title: 'Forest Hills',
  },
  {
    id: 'q04',
    coordinate: { latitude: 40.7489, longitude: -73.7949 },
    title: 'Flushing',
  },
  {
    id: 'q05',
    coordinate: { latitude: 40.7696, longitude: -73.8441 },
    title: 'Astoria',
  },
  {
    id: 'q06',
    coordinate: { latitude: 40.7075, longitude: -73.8441 },
    title: 'Richmond Hill',
  },
  {
    id: 'q07',
    coordinate: { latitude: 40.7075, longitude: -73.7949 },
    title: 'South Jamaica',
  },
  {
    id: 'q08',
    coordinate: { latitude: 40.7696, longitude: -73.7949 },
    title: 'Bayside',
  },
  {
    id: 'q09',
    coordinate: { latitude: 40.7489, longitude: -73.87 },
    title: 'Woodside',
  },
  {
    id: 'q10',
    coordinate: { latitude: 40.6868, longitude: -73.8441 },
    title: 'Howard Beach',
  },

  // Bronx (8)
  {
    id: 'x01',
    coordinate: { latitude: 40.8448, longitude: -73.8648 },
    title: 'Fordham',
  },
  {
    id: 'x02',
    coordinate: { latitude: 40.8655, longitude: -73.8648 },
    title: 'Norwood',
  },
  {
    id: 'x03',
    coordinate: { latitude: 40.8448, longitude: -73.92 },
    title: 'Highbridge',
  },
  {
    id: 'x04',
    coordinate: { latitude: 40.8655, longitude: -73.92 },
    title: 'Kingsbridge',
  },
  {
    id: 'x05',
    coordinate: { latitude: 40.8241, longitude: -73.8648 },
    title: 'Soundview',
  },
  {
    id: 'x06',
    coordinate: { latitude: 40.8241, longitude: -73.92 },
    title: 'Mott Haven',
  },
  {
    id: 'x07',
    coordinate: { latitude: 40.8862, longitude: -73.8648 },
    title: 'Woodlawn',
  },
  {
    id: 'x08',
    coordinate: { latitude: 40.8862, longitude: -73.92 },
    title: 'Riverdale',
  },

  // Staten Island (7)
  {
    id: 's01',
    coordinate: { latitude: 40.5795, longitude: -74.1502 },
    title: 'St. George',
  },
  {
    id: 's02',
    coordinate: { latitude: 40.5588, longitude: -74.1502 },
    title: 'Stapleton',
  },
  {
    id: 's03',
    coordinate: { latitude: 40.5381, longitude: -74.1502 },
    title: 'Great Kills',
  },
  {
    id: 's04',
    coordinate: { latitude: 40.5795, longitude: -74.18 },
    title: 'Mariners Harbor',
  },
  {
    id: 's05',
    coordinate: { latitude: 40.5588, longitude: -74.18 },
    title: 'New Springville',
  },
  {
    id: 's06',
    coordinate: { latitude: 40.5381, longitude: -74.18 },
    title: 'Tottenville',
  },
  {
    id: 's07',
    coordinate: { latitude: 40.6002, longitude: -74.1502 },
    title: 'Bayonne Border',
  },
];

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const INITIAL_REGION: Region = {
  latitude: 40.7128,
  longitude: -73.98,
  latitudeDelta: 0.6,
  longitudeDelta: 0.6,
};

// ---------------------------------------------------------------------------
// Clustering helpers
// ---------------------------------------------------------------------------
function getClusterColor(count: number): string {
  if (count < 5) return theme.colors.success;
  if (count <= 15) return theme.colors.warning;
  return theme.colors.error;
}

function getClusterSize(count: number): number {
  // Scale from 40 (min) to 70 (max)
  return Math.min(40 + Math.floor(count * 1.5), 70);
}

function computeRenderItems(
  markers: PlaceMarker[],
  region: Region,
): RenderItem[] {
  const cellSize = region.latitudeDelta / 6;

  // Assign each marker to a grid cell key
  const cellMap = new Map<string, PlaceMarker[]>();

  for (const marker of markers) {
    const cellLat = Math.floor(marker.coordinate.latitude / cellSize);
    const cellLng = Math.floor(marker.coordinate.longitude / cellSize);
    const key = `${cellLat}:${cellLng}`;
    const existing = cellMap.get(key);
    if (existing) {
      existing.push(marker);
    } else {
      cellMap.set(key, [marker]);
    }
  }

  const items: RenderItem[] = [];

  cellMap.forEach((group, key) => {
    if (group.length >= 2) {
      // Compute centroid of the group
      const avgLat =
        group.reduce((sum, m) => sum + m.coordinate.latitude, 0) / group.length;
      const avgLng =
        group.reduce((sum, m) => sum + m.coordinate.longitude, 0) /
        group.length;

      items.push({
        type: 'cluster',
        data: {
          id: `cluster-${key}`,
          coordinate: { latitude: avgLat, longitude: avgLng },
          count: group.length,
          markers: group,
        },
      });
    } else {
      items.push({ type: 'single', data: group[0] });
    }
  });

  return items;
}

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------
export default function ClusterMarkersScreen(_props: Props) {
  const mapRef = useRef<MapView>(null);
  const [region, setRegion] = useState<Region>(INITIAL_REGION);

  const handleRegionChangeComplete = useCallback((newRegion: Region) => {
    setRegion(newRegion);
  }, []);

  const renderItems = useMemo(
    () => computeRenderItems(ALL_MARKERS, region),
    [region],
  );

  const visibleClusters = useMemo(
    () => renderItems.filter(item => item.type === 'cluster').length,
    [renderItems],
  );

  const visibleSingles = useMemo(
    () => renderItems.filter(item => item.type === 'single').length,
    [renderItems],
  );

  const handleClusterPress = useCallback(
    (cluster: ClusterGroup) => {
      mapRef.current?.animateToRegion(
        {
          latitude: cluster.coordinate.latitude,
          longitude: cluster.coordinate.longitude,
          latitudeDelta: region.latitudeDelta / 2,
          longitudeDelta: region.longitudeDelta / 2,
        },
        350,
      );
    },
    [region],
  );

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <Header title="Cluster Markers" />
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
          initialRegion={INITIAL_REGION}
          onRegionChangeComplete={handleRegionChangeComplete}
        >
          {renderItems.map(item => {
            if (item.type === 'cluster') {
              const cluster = item.data;
              const size = getClusterSize(cluster.count);
              const color = getClusterColor(cluster.count);
              return (
                <Marker
                  key={cluster.id}
                  coordinate={cluster.coordinate}
                  tracksViewChanges={false}
                  anchor={{ x: 0.5, y: 0.5 }}
                  onPress={() => handleClusterPress(cluster)}
                >
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => handleClusterPress(cluster)}
                    style={[
                      styles.clusterBubble,
                      {
                        width: size,
                        height: size,
                        borderRadius: size / 2,
                        backgroundColor: color,
                      },
                    ]}
                  >
                    <Text style={styles.clusterCount}>{cluster.count}</Text>
                  </TouchableOpacity>
                </Marker>
              );
            }

            const marker = item.data;
            return (
              <Marker
                key={marker.id}
                coordinate={marker.coordinate}
                tracksViewChanges={false}
                anchor={{ x: 0.5, y: 1 }}
              >
                <View style={styles.pin} />
                <Callout tooltip={false}>
                  <View style={styles.callout}>
                    <Text style={styles.calloutTitle}>{marker.title}</Text>
                    <Text style={styles.calloutId}>
                      {marker.id.toUpperCase()}
                    </Text>
                  </View>
                </Callout>
              </Marker>
            );
          })}
        </MapView>

        {/* Floating zoom badge */}
        <View style={styles.badge} pointerEvents="none">
          <Text style={styles.badgeText}>
            {visibleClusters > 0
              ? `${visibleClusters} cluster${
                  visibleClusters !== 1 ? 's' : ''
                } visible`
              : 'Zoomed in — individual markers'}
          </Text>
        </View>

        {/* Bottom info panel */}
        <View style={styles.bottomPanel}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Total Markers</Text>
            <Text style={styles.infoValue}>{ALL_MARKERS.length}</Text>
          </View>
          <View style={styles.infoDivider} />
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Clusters</Text>
            <Text
              style={[
                styles.infoValue,
                visibleClusters > 0 && styles.infoValueActive,
              ]}
            >
              {visibleClusters}
            </Text>
          </View>
          <View style={styles.infoDivider} />
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Singles</Text>
            <Text style={styles.infoValue}>{visibleSingles}</Text>
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

  // Cluster bubble
  clusterBubble: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: theme.colors.white,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  clusterCount: {
    color: theme.colors.white,
    fontSize: theme.typography.sizes.sm,
    fontWeight: '800',
    letterSpacing: 0.3,
  },

  // Individual marker pin
  pin: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: theme.colors.primary,
    borderWidth: 2,
    borderColor: theme.colors.white,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 3,
  },

  // Callout
  callout: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    minWidth: 130,
    maxWidth: 200,
  },
  calloutTitle: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 2,
  },
  calloutId: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.textSecondary,
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
    fontSize: theme.typography.sizes.xs,
    fontWeight: '600',
    letterSpacing: 0.2,
  },

  // Bottom panel
  bottomPanel: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  infoItem: {
    flex: 1,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  infoValueActive: {
    color: theme.colors.primary,
  },
  infoDivider: {
    width: 1,
    height: 28,
    backgroundColor: theme.colors.border,
  },
});
