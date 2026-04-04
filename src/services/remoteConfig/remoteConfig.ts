import remoteConfig from '@react-native-firebase/remote-config';

export interface RemoteConfigValues {
  welcome_message: string;
  maintenance_mode: boolean;
  max_retry_count: number;
  feature_banner_enabled: boolean;
  api_base_url: string;
  min_app_version: string;
}

export const DEFAULT_REMOTE_CONFIG_VALUES: RemoteConfigValues = {
  welcome_message: 'Welcome to RNToolBox',
  maintenance_mode: false,
  max_retry_count: 3,
  feature_banner_enabled: false,
  api_base_url: 'https://api.example.com',
  min_app_version: '1.0.0',
};

export async function initRemoteConfig(): Promise<void> {
  await remoteConfig().setDefaults(
    DEFAULT_REMOTE_CONFIG_VALUES as unknown as Record<
      string,
      string | number | boolean
    >,
  );
  remoteConfig().settings = {
    minimumFetchIntervalMillis: 0,
    fetchTimeMillis: 0,
  };
}

export async function fetchAndActivate(): Promise<boolean> {
  return remoteConfig().fetchAndActivate();
}

export function getRemoteConfigValues(): RemoteConfigValues {
  const all = remoteConfig().getAll();

  return {
    welcome_message:
      all.welcome_message?.asString() ??
      DEFAULT_REMOTE_CONFIG_VALUES.welcome_message,
    maintenance_mode:
      all.maintenance_mode?.asBoolean() ??
      DEFAULT_REMOTE_CONFIG_VALUES.maintenance_mode,
    max_retry_count:
      all.max_retry_count?.asNumber() ??
      DEFAULT_REMOTE_CONFIG_VALUES.max_retry_count,
    feature_banner_enabled:
      all.feature_banner_enabled?.asBoolean() ??
      DEFAULT_REMOTE_CONFIG_VALUES.feature_banner_enabled,
    api_base_url:
      all.api_base_url?.asString() ?? DEFAULT_REMOTE_CONFIG_VALUES.api_base_url,
    min_app_version:
      all.min_app_version?.asString() ??
      DEFAULT_REMOTE_CONFIG_VALUES.min_app_version,
  };
}

export function getLastFetchTime(): Date | null {
  const fetchTimeMillis = remoteConfig().fetchTimeMillis;
  return fetchTimeMillis > 0 ? new Date(fetchTimeMillis) : null;
}

export function getFetchStatus(): string {
  return remoteConfig().lastFetchStatus;
}

export function getFirebaseProjectId(): string {
  try {
    const { firebaseApp } =
      require('../firebase') as typeof import('../firebase');
    return firebaseApp.options.projectId ?? 'unknown';
  } catch {
    return 'unknown';
  }
}
