import messaging from '@react-native-firebase/messaging';
import { Alert } from 'react-native';

/* ----------- REQUEST PERMISSION ----------- */
export const requestNotificationPermission = async () => {
  const authStatus = await messaging().requestPermission();

  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  return enabled;
};

/* ----------- GET FCM TOKEN ----------- */
export const getFcmToken = async (): Promise<string | null> => {
  try {
    const token = await messaging().getToken();
    return token;
  } catch (error) {
    console.log('FCM token error', error);
    return null;
  }
};

/* ----------- FOREGROUND HANDLER ----------- */
export const listenForegroundNotification = () => {
  return messaging().onMessage(async remoteMessage => {
    Alert.alert(
      remoteMessage.notification?.title || 'Notification',
      remoteMessage.notification?.body || '',
    );
  });
};

/* ----------- BACKGROUND HANDLER ----------- */
export const setBackgroundHandler = () => {
  messaging().setBackgroundMessageHandler(
    async remoteMessage => {
      console.log('Background message:', remoteMessage);
    },
  );
};

/* ----------- TAP HANDLER ----------- */
export const listenNotificationOpen = (
  callback: (data: any) => void,
) => {
  // App opened from background
  messaging().onNotificationOpenedApp(remoteMessage => {
    callback(remoteMessage?.data);
  });

  // App opened from killed state
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        callback(remoteMessage.data);
      }
    });
};
