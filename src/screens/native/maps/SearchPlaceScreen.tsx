import React, { useRef, useState } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  GooglePlaceDetail,
  GooglePlacesAutocomplete,
  GooglePlacesAutocompleteRef,
} from 'react-native-google-places-autocomplete';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../../components/Header';
import { RootStackParamList } from '../../../navigation/types';
import { theme } from '../../../theme';

const MAPS_API_KEY =
  Platform.OS === 'ios'
    ? 'AIzaSyBedSN0xcQcF3H7FQnymk7w_MClwJQExEU'
    : 'AIzaSyDBuZNqygBwTMcLNkznEfm7YoHXGxsfGpI';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'NativeMapsSearchPlace'
>;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SelectedPlace {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  placeId: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const INITIAL_REGION: Region = {
  latitude: 40.7128,
  longitude: -74.006,
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function SearchPlaceScreen(_props: Props) {
  const mapRef = useRef<MapView>(null);
  const autocompleteRef = useRef<GooglePlacesAutocompleteRef>(null);

  const [selectedPlace, setSelectedPlace] = useState<SelectedPlace | null>(
    null,
  );

  const handlePlaceSelect = (detail: GooglePlaceDetail | null) => {
    if (!detail) {
      return;
    }

    const { lat, lng } = detail.geometry.location;
    const place: SelectedPlace = {
      name: detail.name,
      address: detail.formatted_address,
      latitude: lat,
      longitude: lng,
      placeId: detail.place_id,
    };

    setSelectedPlace(place);

    mapRef.current?.animateToRegion(
      {
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      600,
    );
  };

  const handleClear = () => {
    setSelectedPlace(null);
    autocompleteRef.current?.setAddressText('');
    mapRef.current?.animateToRegion(INITIAL_REGION, 500);
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <Header title="Search Place" />

      {/* Search bar sits above the map */}
      <View style={styles.searchWrapper}>
        <GooglePlacesAutocomplete
          ref={autocompleteRef}
          placeholder="Search for a place..."
          fetchDetails
          onPress={(_data, detail) => handlePlaceSelect(detail)}
          onFail={error => console.warn('[Places] API error:', error)}
          query={{
            key: MAPS_API_KEY,
            language: 'en',
          }}
          enablePoweredByContainer={false}
          keyboardShouldPersistTaps="handled"
          debounce={300}
          minLength={2}
          styles={{
            container: styles.autocompleteContainer,
            textInputContainer: styles.textInputContainer,
            textInput: styles.textInput,
            listView: styles.listView,
            row: styles.row,
            description: styles.description,
            separator: styles.separator,
            poweredContainer: styles.poweredContainer,
          }}
          renderRightButton={() =>
            selectedPlace ? (
              <TouchableOpacity
                style={styles.clearBtn}
                onPress={handleClear}
                activeOpacity={0.7}
              >
                <Text style={styles.clearBtnText}>Clear</Text>
              </TouchableOpacity>
            ) : null
          }
        />
      </View>

      {/* Map */}
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
          initialRegion={INITIAL_REGION}
        >
          {selectedPlace && (
            <Marker
              identifier="search-result"
              coordinate={{
                latitude: selectedPlace.latitude,
                longitude: selectedPlace.longitude,
              }}
              title={selectedPlace.name}
              description={selectedPlace.address}
            />
          )}
        </MapView>

        {/* Floating hint when no place selected */}
        {!selectedPlace && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              Type an address or place name above
            </Text>
          </View>
        )}

        {/* Place info card */}
        {selectedPlace && (
          <View style={styles.card}>
            <View style={styles.cardAccent} />
            <View style={styles.cardBody}>
              <Text style={styles.cardName} numberOfLines={1}>
                {selectedPlace.name}
              </Text>
              <Text style={styles.cardAddress} numberOfLines={2}>
                {selectedPlace.address}
              </Text>
              <View style={styles.coordRow}>
                <View style={styles.coordChip}>
                  <Text style={styles.coordLabel}>LAT</Text>
                  <Text style={styles.coordValue}>
                    {selectedPlace.latitude.toFixed(5)}
                  </Text>
                </View>
                <View style={styles.coordChip}>
                  <Text style={styles.coordLabel}>LNG</Text>
                  <Text style={styles.coordValue}>
                    {selectedPlace.longitude.toFixed(5)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}
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

  // ---------------------------------------------------------------------------
  // Search bar
  // ---------------------------------------------------------------------------
  searchWrapper: {
    zIndex: 10,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  autocompleteContainer: {
    flex: 0,
  },
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.sm,
  },
  textInput: {
    flex: 1,
    height: 44,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textPrimary,
    backgroundColor: 'transparent',
    marginBottom: 0,
    paddingHorizontal: theme.spacing.xs,
  },
  listView: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 10,
    marginTop: theme.spacing.xs,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  row: {
    backgroundColor: theme.colors.background,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    minHeight: 44,
  },
  description: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textPrimary,
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.border,
  },
  poweredContainer: {
    display: 'none',
  },
  clearBtn: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: 6,
    backgroundColor: theme.colors.errorLight,
    marginLeft: theme.spacing.xs,
  },
  clearBtnText: {
    fontSize: theme.typography.sizes.xs,
    fontWeight: '600',
    color: theme.colors.error,
  },

  // ---------------------------------------------------------------------------
  // Map
  // ---------------------------------------------------------------------------
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },

  // Floating hint badge
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
  },

  // Place info card
  card: {
    position: 'absolute',
    bottom: theme.spacing.xl,
    left: theme.spacing.md,
    right: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderRadius: 14,
    flexDirection: 'row',
    overflow: 'hidden',
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardAccent: {
    width: 4,
    backgroundColor: theme.colors.primary,
  },
  cardBody: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.xs,
  },
  cardName: {
    fontSize: theme.typography.sizes.md,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  cardAddress: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
  coordRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.xs,
  },
  coordChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: theme.colors.primary50,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 3,
    borderRadius: 6,
  },
  coordLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.primary700,
    letterSpacing: 0.5,
  },
  coordValue: {
    fontSize: theme.typography.sizes.xs,
    fontWeight: '600',
    color: theme.colors.primary,
    fontVariant: ['tabular-nums'],
  },
});
