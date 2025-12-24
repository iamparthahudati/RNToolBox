import { Linking, Alert } from 'react-native';

export const callPhoneNumber = (phoneNumber: string) => {
  if (!phoneNumber) {
    Alert.alert('Error', 'Phone number is required');
    return;
  }

  const url = `tel:${phoneNumber}`;

  Linking.canOpenURL(url)
    .then((supported) => {
      if (!supported) {
        Alert.alert('Error', 'Calling is not supported on this device');
        return;
      }
      Linking.openURL(url);
    })
    .catch(() => {
      Alert.alert('Error', 'Something went wrong while calling');
    });
};
