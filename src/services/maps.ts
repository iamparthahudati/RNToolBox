import { Alert, Linking, Platform } from 'react-native';

export const openMaps = (address: string) => {
  if (!address) {
    Alert.alert('Error', 'Address is required');
    return;
  }

  const encodedAddress = encodeURIComponent(address);

  const url = Platform.select({
    ios: `maps:0,0?q=${encodedAddress}`,
    android: `geo:0,0?q=${encodedAddress}`,
  });

  const fallbackUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;

  Linking.openURL(url!).catch(() => {
    Linking.openURL(fallbackUrl).catch(() => {
      Alert.alert('Error', 'Unable to open maps');
    });
  });
};
