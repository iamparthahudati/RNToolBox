import { Linking, Alert } from 'react-native';

type EmailOptions = {
  to: string;
  subject?: string;
  body?: string;
};

export const sendEmail = ({ to, subject = '', body = '' }: EmailOptions) => {
  if (!to) {
    Alert.alert('Error', 'Email address is required');
    return;
  }

  const url =
    `mailto:${to}` +
    `?subject=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(body)}`;

  Linking.canOpenURL(url)
    .then((supported) => {
      if (!supported) {
        Alert.alert('Error', 'No email app found');
        return;
      }
      Linking.openURL(url);
    })
    .catch(() => {
      Alert.alert('Error', 'Something went wrong while opening email');
    });
};
