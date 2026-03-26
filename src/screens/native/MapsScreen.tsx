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
    implemented: true,
  },
  {
    title: 'Basic Map',
    description: 'Embedded interactive map with zoom and pan',
    screen: 'NativeMapsBasic',
    implemented: false,
  },
  {
    title: 'My Location',
    description: 'Show current GPS position on the map',
    screen: 'NativeMapsLocation',
    implemented: false,
  },
  {
    title: 'Markers',
    description: 'Drop and customize pins on the map',
    screen: 'NativeMapsMarkers',
    implemented: false,
  },
  {
    title: 'Directions',
    description: 'Draw a route polyline between two points',
    screen: 'NativeMapsDirections',
    implemented: false,
  },
  {
    title: 'Polygon',
    description: 'Draw filled shapes and overlays on the map',
    screen: 'NativeMapsPolygon',
    implemented: false,
  },
  {
    title: 'Geofence',
    description: 'Define a radius circle around a coordinate',
    screen: 'NativeMapsGeofence',
    implemented: false,
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
