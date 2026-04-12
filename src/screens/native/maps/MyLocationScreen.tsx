import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useRef, useState } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../../components/Header';
import { RootStackParamList } from '../../../navigation/types';
import { theme } from '../../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'NativeMapsLocation'>;
type PermStatus = 'checking' | 'granted' | 'denied' | 'blocked';

const LOCATION_PERM =
  Platform.OS === 'android'
    ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
    : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;

const DEFAULT_REGION: Region = {
  latitude: 40.7128,
  longitude: -74.006,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

export default function MyLocationScreen(_props: Props) {
  const mapRef = useRef<MapView>(null);
  const [permStatus, setPermStatus] = useState<PermStatus>('checking');
  const [userCoords, setUserCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const checkAndRequest = async () => {
    setPermStatus('checking');
    const result = await check(LOCATION_PERM);
    if (result === RESULTS.GRANTED) {
      setPermStatus('granted');
    } else if (result === RESULTS.DENIED) {
      const requested = await request(LOCATION_PERM);
      setPermStatus(requested === RESULTS.GRANTED ? 'granted' : 'denied');
    } else if (result === RESULTS.BLOCKED) {
      setPermStatus('blocked');
    } else {
      setPermStatus('denied');
    }
  };

  useEffect(() => {
    checkAndRequest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const centerOnUser = () => {
    if (!userCoords || !mapRef.current) {
      return;
    }
    mapRef.current.animateToRegion(
      { ...userCoords, latitudeDelta: 0.01, longitudeDelta: 0.01 },
      500,
    );
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <Header title="My Location" />
      <View style={styles.mapContainer}>
        {permStatus === 'granted' ? (
          <MapView
            ref={mapRef}
            style={styles.map}
            provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
            initialRegion={DEFAULT_REGION}
            showsUserLocation
            showsMyLocationButton={false}
            followsUserLocation={false}
            onUserLocationChange={e => {
              const coord = e.nativeEvent.coordinate;
              if (coord) {
                setUserCoords({
                  latitude: coord.latitude,
                  longitude: coord.longitude,
                });
              }
            }}
          />
        ) : (
          <View style={styles.permCenter}>
            <Text style={styles.permIcon}>📍</Text>
            <Text style={styles.permTitle}>
              {permStatus === 'checking'
                ? 'Checking permission…'
                : 'Location Access Needed'}
            </Text>
            <Text style={styles.permSubtitle}>
              {permStatus === 'blocked'
                ? 'Location permission is blocked. Enable it in your device Settings.'
                : 'Grant location permission to see your GPS position on the map.'}
            </Text>
            {permStatus !== 'checking' && permStatus !== 'blocked' && (
              <TouchableOpacity
                style={styles.grantBtn}
                onPress={checkAndRequest}
                activeOpacity={0.8}
              >
                <Text style={styles.grantBtnText}>Grant Permission</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Center-on-me FAB */}
        {permStatus === 'granted' && (
          <TouchableOpacity
            style={styles.locateBtn}
            onPress={centerOnUser}
            activeOpacity={0.8}
          >
            <Text style={styles.locateBtnIcon}>◎</Text>
          </TouchableOpacity>
        )}

        {/* Coordinate bar */}
        {userCoords && (
          <View style={styles.coordBar}>
            <Text style={styles.coordText}>
              {userCoords.latitude.toFixed(6)},{' '}
              {userCoords.longitude.toFixed(6)}
            </Text>
          </View>
        )}
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

  // Permission state
  permCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  permIcon: {
    fontSize: 48,
    marginBottom: theme.spacing.md,
  },
  permTitle: {
    fontSize: theme.typography.sizes.md,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  permSubtitle: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: theme.spacing.lg,
  },
  grantBtn: {
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
  },
  grantBtnText: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: '700',
    color: theme.colors.white,
  },

  // FAB
  locateBtn: {
    position: 'absolute',
    right: theme.spacing.md,
    bottom: 64,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  locateBtnIcon: {
    fontSize: 24,
    color: theme.colors.primary,
    lineHeight: 28,
  },

  // Coordinate bar
  coordBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
  },
  coordText: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.white,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    letterSpacing: 0.5,
  },
});
