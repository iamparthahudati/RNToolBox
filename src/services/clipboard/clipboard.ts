import Clipboard from '@react-native-clipboard/clipboard';
import { Alert } from 'react-native';

export const copyToClipboard = (text: string) => {
  if (!text) {
    Alert.alert('Error', 'Nothing to copy');
    return;
  }

  Clipboard.setString(text);
  Alert.alert('Copied', 'Text copied to clipboard');
};

export const getFromClipboard = async (): Promise<string> => {
  const text = await Clipboard.getString();
  return text;
};
