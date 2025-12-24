import { Linking, Alert } from 'react-native';

export const openMaps = (address: string) => {
  if (!address) {
    Alert.alert('Error', 'Address is required');
    return;
  }

  const encodedAddress = encodeURIComponent(address);

  // Android-safe Google Maps URL
  const googleMapsAppUrl = `geo:0,0?q=${encodedAddress}`;
  const googleMapsWebUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;

  Linking.openURL(googleMapsAppUrl).catch(() => {
    // Fallback to browser if Maps app not available
    Linking.openURL(googleMapsWebUrl).catch(() => {
      Alert.alert('Error', 'Unable to open maps');
    });
  });
};
