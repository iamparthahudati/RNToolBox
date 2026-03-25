import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/Header';
import { RootStackParamList } from '../../navigation/types';
import { theme } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'NativeMaps'>;

type MapItem = {
  title: string;
  description: string;
  screen: keyof RootStackParamList;
  implemented: boolean;
};

const ITEMS: MapItem[] = [
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
  const renderItem = ({ item }: { item: MapItem }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate(item.screen as any)}
      activeOpacity={0.7}
    >
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardDescription}>{item.description}</Text>
      {!item.implemented && (
        <View style={styles.soonBadge}>
          <Text style={styles.soonText}>Coming Soon</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Google Maps" />
      <FlatList
        data={ITEMS}
        keyExtractor={item => item.title}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  listContent: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  card: {
    padding: theme.spacing.lg,
    borderRadius: 8,
    backgroundColor: theme.colors.surface,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardTitle: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.textPrimary,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  cardDescription: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.textSecondary,
  },
  soonBadge: {
    backgroundColor: '#FEF2F2',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    marginTop: theme.spacing.xs,
  },
  soonText: {
    fontSize: 10,
    color: '#DC2626',
    fontWeight: '600',
  },
});
