import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import ScreenLayout from '../../components/molecules/ScreenLayout';
import { RootStackParamList } from '../../navigation/types';
import { MenuItem } from '../../types/menu';

type Props = NativeStackScreenProps<RootStackParamList, 'NativeMaps'>;

const ITEMS: MenuItem[] = [
  {
    title: 'Open in Maps',
    description: 'Launch native maps app with an address',
    screen: 'NativeMapsOpen',
    icon: 'map-marker-outline',
    implemented: true,
  },
  {
    title: 'Basic Map',
    description: 'Embedded interactive map with zoom and pan',
    screen: 'NativeMapsBasic',
    icon: 'map-outline',
    implemented: true,
  },
  {
    title: 'My Location',
    description: 'Show current GPS position on the map',
    screen: 'NativeMapsLocation',
    icon: 'crosshairs-gps',
    implemented: true,
  },
  {
    title: 'Markers',
    description: 'Drop and customize pins on the map',
    screen: 'NativeMapsMarkers',
    icon: 'map-marker-multiple-outline',
    implemented: true,
  },
  {
    title: 'Directions',
    description: 'Draw a route polyline between two points',
    screen: 'NativeMapsDirections',
    icon: 'road-variant',
    implemented: true,
  },
  {
    title: 'Polygon',
    description: 'Draw filled shapes and overlays on the map',
    screen: 'NativeMapsPolygon',
    icon: 'vector-polygon',
    implemented: true,
  },
  {
    title: 'Geofence',
    description: 'Define a radius circle around a coordinate',
    screen: 'NativeMapsGeofence',
    icon: 'circle-outline',
    implemented: true,
  },
];

export default function MapsScreen({ navigation }: Props) {
  return (
    <ScreenLayout
      title="Google Maps"
      items={ITEMS}
      onItemPress={item => navigation.navigate(item.screen as any)}
    />
  );
}
