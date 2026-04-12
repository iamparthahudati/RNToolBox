import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';

import Header from '../../../components/Header';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../../theme';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'NativeMapsCustomStyle'
>;

type StyleTheme = 'Standard' | 'Dark' | 'Retro' | 'Minimal';

const INITIAL_REGION = {
  latitude: 40.7128,
  longitude: -74.006,
  latitudeDelta: 0.06,
  longitudeDelta: 0.06,
};

const DARK_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#212121' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#212121' }] },
  {
    featureType: 'administrative',
    elementType: 'geometry',
    stylers: [{ color: '#757575' }],
  },
  {
    featureType: 'administrative.country',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#9e9e9e' }],
  },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#bdbdbd' }],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#757575' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#181818' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#616161' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.fill',
    stylers: [{ color: '#2c2c2c' }],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#8a8a8a' }],
  },
  {
    featureType: 'road.arterial',
    elementType: 'geometry',
    stylers: [{ color: '#373737' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#3c3c3c' }],
  },
  {
    featureType: 'road.highway.controlled_access',
    elementType: 'geometry',
    stylers: [{ color: '#4e4e4e' }],
  },
  {
    featureType: 'road.local',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#616161' }],
  },
  {
    featureType: 'transit',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#757575' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#000000' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#3d3d3d' }],
  },
];

const RETRO_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#ebe3cd' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#523735' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#f5f1e6' }] },
  {
    featureType: 'administrative',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#c9b2a6' }],
  },
  {
    featureType: 'administrative.land_parcel',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#dcd2be' }],
  },
  {
    featureType: 'administrative.land_parcel',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#ae9e90' }],
  },
  {
    featureType: 'landscape.natural',
    elementType: 'geometry',
    stylers: [{ color: '#dfd2ae' }],
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [{ color: '#dfd2ae' }],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#93817c' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry.fill',
    stylers: [{ color: '#a5b076' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#447530' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#f5f1e6' }],
  },
  {
    featureType: 'road.arterial',
    elementType: 'geometry',
    stylers: [{ color: '#fdfcf8' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#f8c967' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#e9bc62' }],
  },
  {
    featureType: 'road.highway.controlled_access',
    elementType: 'geometry',
    stylers: [{ color: '#e98d58' }],
  },
  {
    featureType: 'road.highway.controlled_access',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#db8555' }],
  },
  {
    featureType: 'road.local',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#806b63' }],
  },
  {
    featureType: 'transit.line',
    elementType: 'geometry',
    stylers: [{ color: '#dfd2ae' }],
  },
  {
    featureType: 'transit.line',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#8f7d77' }],
  },
  {
    featureType: 'transit.line',
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#ebe3cd' }],
  },
  {
    featureType: 'transit.station',
    elementType: 'geometry',
    stylers: [{ color: '#dfd2ae' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry.fill',
    stylers: [{ color: '#aee0f4' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#92998d' }],
  },
];

const MINIMAL_STYLE = [
  {
    featureType: 'poi',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'transit',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'administrative',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }],
  },
  {
    elementType: 'labels.icon',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'road.local',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'road.arterial',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.fill',
    stylers: [{ color: '#dadada' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#c0c0c0' }],
  },
  {
    featureType: 'road.arterial',
    elementType: 'geometry.fill',
    stylers: [{ color: '#efefef' }],
  },
  {
    featureType: 'road.local',
    elementType: 'geometry.fill',
    stylers: [{ color: '#f5f5f5' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry.fill',
    stylers: [{ color: '#c9e8f5' }],
  },
  {
    featureType: 'landscape',
    elementType: 'geometry.fill',
    stylers: [{ color: '#f8f8f8' }],
  },
];

const STYLE_THEMES: { label: StyleTheme; description: string }[] = [
  { label: 'Standard', description: 'Default' },
  { label: 'Dark', description: 'Grayscale' },
  { label: 'Retro', description: 'Vintage' },
  { label: 'Minimal', description: 'Clean' },
];

function getCustomStyle(styleTheme: StyleTheme) {
  switch (styleTheme) {
    case 'Dark':
      return DARK_STYLE;
    case 'Retro':
      return RETRO_STYLE;
    case 'Minimal':
      return MINIMAL_STYLE;
    default:
      return undefined;
  }
}

export default function CustomMapStyleScreen(_props: Props) {
  const [activeStyle, setActiveStyle] = useState<StyleTheme>('Standard');

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <Header title="Custom Map Style" />
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
          initialRegion={INITIAL_REGION}
          customMapStyle={getCustomStyle(activeStyle)}
          showsCompass
          showsScale
        />

        <View style={styles.badge}>
          <Text style={styles.badgeText}>{activeStyle}</Text>
        </View>

        <View style={styles.bottomPanel}>
          <View style={styles.pillRow}>
            {STYLE_THEMES.map(({ label, description }) => {
              const isActive = activeStyle === label;
              return (
                <TouchableOpacity
                  key={label}
                  style={[styles.pill, isActive && styles.pillActive]}
                  onPress={() => setActiveStyle(label)}
                  activeOpacity={0.75}
                >
                  <Text
                    style={[
                      styles.pillLabel,
                      isActive && styles.pillLabelActive,
                    ]}
                  >
                    {label}
                  </Text>
                  <Text
                    style={[
                      styles.pillDescription,
                      isActive && styles.pillDescriptionActive,
                    ]}
                  >
                    {description}
                  </Text>
                </TouchableOpacity>
              );
            })}
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
    fontSize: theme.typography.sizes.sm,
    fontWeight: '700',
    color: theme.colors.white,
    letterSpacing: 0.4,
  },
  bottomPanel: {
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  pillRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  pill: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xs,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
  },
  pillActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary,
  },
  pillLabel: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  pillLabelActive: {
    color: theme.colors.white,
  },
  pillDescription: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.textTertiary,
  },
  pillDescriptionActive: {
    color: theme.colors.white,
    opacity: 0.8,
  },
});
