import {
  check,
  request,
  openSettings,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';
import { Platform, PermissionsAndroid } from 'react-native';

export type PermissionStatus =
  | 'unavailable'
  | 'denied'
  | 'blocked'
  | 'granted'
  | 'limited';

type PermissionType = 'camera' | 'location' | 'notification';

/* ---------------- CAMERA & LOCATION ---------------- */

const getPermissionKey = (type: PermissionType) => {
  if (Platform.OS !== 'android') return null;

  switch (type) {
    case 'camera':
      return PERMISSIONS.ANDROID.CAMERA;

    case 'location':
      return PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

    default:
      return null;
  }
};

/* ---------------- CHECK PERMISSION ---------------- */

export const checkPermission = async (
  type: PermissionType,
): Promise<PermissionStatus> => {
  const androidVersion = Number(Platform.Version);

  // 🔔 Notification permission (Android 13+)
  if (type === 'notification') {
    if (androidVersion < 33) return 'granted';

    const result = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );

    return result ? 'granted' : 'denied';
  }

  const permission = getPermissionKey(type);
  if (!permission) return 'unavailable';

  return await check(permission);
};

/* ---------------- REQUEST PERMISSION ---------------- */

export const requestPermission = async (
  type: PermissionType,
): Promise<PermissionStatus> => {
  const androidVersion = Number(Platform.Version);

  // 🔔 Notification permission (Android 13+)
  if (type === 'notification') {
    if (androidVersion < 33) return 'granted';

    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );

    return result === PermissionsAndroid.RESULTS.GRANTED
      ? 'granted'
      : 'denied';
  }

  const permission = getPermissionKey(type);
  if (!permission) return 'unavailable';

  return await request(permission);
};

/* ---------------- OPEN SETTINGS ---------------- */

export const openAppSettings = () => {
  openSettings().catch(() => {
    console.warn('Unable to open app settings');
  });
};
