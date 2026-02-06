import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import Button from '../components/Button';
import { copyToClipboard } from '../services/clipboard';
import {
  getFcmToken,
  listenForegroundNotification,
  listenNotificationOpen,
} from '../services/notifications';
import { theme } from '../theme';

const DeviceScreen = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = listenForegroundNotification();

    listenNotificationOpen(data => {
      console.log('Notification tapped:', data);
    });

    return unsubscribe;
  }, []);

  const handleGetToken = async () => {
    const fcmToken = await getFcmToken();
    Alert.alert('FCM Token', fcmToken ?? 'No token');
    setToken(fcmToken);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Push Notifications</Text>

      <Button title="Get FCM Token" onPress={handleGetToken} />

      {token && <Text style={styles.token}>{token}</Text>}

      {token && (
        <>
          <Text style={styles.token}>{token}</Text>
          <Button
            title="Copy Token"
            variant="outline"
            onPress={() => copyToClipboard(token)}
          />
        </>
      )}
    </View>
  );
};

export default DeviceScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: '700',
    marginBottom: theme.spacing.md,
  },
  token: {
    fontSize: 12,
    marginTop: theme.spacing.md,
    color: theme.colors.textSecondary,
  },
});
