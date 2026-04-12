import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import MapView, {
  LatLng,
  Marker,
  Polyline,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../../components/Header';
import { RootStackParamList } from '../../../navigation/types';
import { theme } from '../../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'NativeMapsDirections'>;

const ORIGIN: LatLng = { latitude: 40.6413, longitude: -73.7781 }; // JFK Airport
const DESTINATION: LatLng = { latitude: 40.758, longitude: -73.9855 }; // Times Square

// Approximate route waypoints (illustrative; use a Directions API for real routing)
const ROUTE: LatLng[] = [
  { latitude: 40.6413, longitude: -73.7781 },
  { latitude: 40.651, longitude: -73.822 },
  { latitude: 40.668, longitude: -73.865 },
  { latitude: 40.689, longitude: -73.897 },
  { latitude: 40.706, longitude: -73.92 },
  { latitude: 40.722, longitude: -73.942 },
  { latitude: 40.737, longitude: -73.958 },
  { latitude: 40.748, longitude: -73.972 },
  { latitude: 40.758, longitude: -73.9855 },
];

const INITIAL_REGION = {
  latitude: 40.7,
  longitude: -73.885,
  latitudeDelta: 0.16,
  longitudeDelta: 0.26,
};

export default function DirectionsScreen(_props: Props) {
  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <Header title="Directions" />
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
          initialRegion={INITIAL_REGION}
          showsTraffic={Platform.OS === 'android'}
        >
          <Marker
            coordinate={ORIGIN}
            title="Origin"
            description="JFK International Airport"
            pinColor="green"
          />
          <Marker
            coordinate={DESTINATION}
            title="Destination"
            description="Times Square, New York"
            pinColor="red"
          />
          <Polyline
            coordinates={ROUTE}
            strokeColor={theme.colors.primary}
            strokeWidth={4}
            geodesic
          />
        </MapView>

        {/* Route info panel */}
        <View style={styles.panel}>
          <View style={styles.routeRow}>
            <View style={[styles.dot, { backgroundColor: '#22C55E' }]} />
            <View style={styles.routeInfo}>
              <Text style={styles.routeLabel}>Origin</Text>
              <Text style={styles.routeValue}>JFK International Airport</Text>
            </View>
          </View>
          <View style={styles.dividerLine} />
          <View style={styles.routeRow}>
            <View style={[styles.dot, { backgroundColor: '#EF4444' }]} />
            <View style={styles.routeInfo}>
              <Text style={styles.routeLabel}>Destination</Text>
              <Text style={styles.routeValue}>Times Square, New York</Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>~20 km</Text>
              <Text style={styles.statLabel}>Distance</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>~35 min</Text>
              <Text style={styles.statLabel}>Drive time</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>9 pts</Text>
              <Text style={styles.statLabel}>Waypoints</Text>
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
  panel: {
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: theme.spacing.sm,
  },
  routeInfo: {
    flex: 1,
  },
  routeLabel: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.textSecondary,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  routeValue: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },
  dividerLine: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.xs,
    marginLeft: 20,
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
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
    fontSize: theme.typography.sizes.md,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  statLabel: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.textSecondary,
  },
});
