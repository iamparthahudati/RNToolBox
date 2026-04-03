import Config from 'react-native-config';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type AppEnv = 'development' | 'staging' | 'production';

export interface AppConfig {
  APP_NAME: string;
  APP_ENV: AppEnv;
  APP_VERSION: string;
  API_BASE_URL: string;
  API_TIMEOUT: number;
  ENABLE_LOGS: boolean;
  ENABLE_ANALYTICS: boolean;
  SENTRY_DSN: string;
  FEATURE_FLAG_NEW_UI: boolean;
  MAPS_API_KEY: string;
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

const REQUIRED_KEYS: ReadonlyArray<keyof AppConfig> = [
  'APP_NAME',
  'APP_ENV',
  'APP_VERSION',
  'API_BASE_URL',
  'API_TIMEOUT',
  'ENABLE_LOGS',
  'ENABLE_ANALYTICS',
  'SENTRY_DSN',
  'FEATURE_FLAG_NEW_UI',
  'MAPS_API_KEY',
];

const VALID_ENVS: ReadonlyArray<AppEnv> = [
  'development',
  'staging',
  'production',
];

function parseBoolean(value: string | undefined, key: string): boolean {
  if (value === 'true') return true;
  if (value === 'false') return false;
  throw new Error(
    `[Config] Invalid boolean value for "${key}": expected "true" or "false", got "${value}".`,
  );
}

function parseNumber(value: string | undefined, key: string): number {
  const parsed = Number(value);
  if (value === undefined || value === '' || isNaN(parsed)) {
    throw new Error(
      `[Config] Invalid number value for "${key}": expected a numeric string, got "${value}".`,
    );
  }
  return parsed;
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

/**
 * Validates that all required config keys are present and that APP_ENV holds
 * a recognised environment value. Throws a descriptive error on the first
 * violation found.
 */
export function validateConfig(raw: Record<string, string | undefined>): void {
  const missing: string[] = [];

  for (const key of REQUIRED_KEYS) {
    const value = raw[key];
    if (value === undefined || value === '') {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `[Config] Missing required environment variable(s): ${missing.join(
        ', ',
      )}. ` +
        'Ensure your .env file is complete and the app has been rebuilt after changes.',
    );
  }

  const env = raw.APP_ENV;
  if (!VALID_ENVS.includes(env as AppEnv)) {
    throw new Error(
      `[Config] Invalid APP_ENV value: "${env}". ` +
        `Accepted values are: ${VALID_ENVS.join(', ')}.`,
    );
  }
}

// ---------------------------------------------------------------------------
// Parsing
// ---------------------------------------------------------------------------

/**
 * Reads raw string values from react-native-config, validates them, and
 * returns a fully-typed {@link AppConfig} object with proper JS types.
 */
export function parseConfig(): AppConfig {
  const raw: Record<string, string | undefined> = Config as unknown as Record<
    string,
    string | undefined
  >;

  validateConfig(raw);

  return {
    APP_NAME: raw.APP_NAME as string,
    APP_ENV: raw.APP_ENV as AppEnv,
    APP_VERSION: raw.APP_VERSION as string,
    API_BASE_URL: raw.API_BASE_URL as string,
    API_TIMEOUT: parseNumber(raw.API_TIMEOUT, 'API_TIMEOUT'),
    ENABLE_LOGS: parseBoolean(raw.ENABLE_LOGS, 'ENABLE_LOGS'),
    ENABLE_ANALYTICS: parseBoolean(raw.ENABLE_ANALYTICS, 'ENABLE_ANALYTICS'),
    SENTRY_DSN: raw.SENTRY_DSN as string,
    FEATURE_FLAG_NEW_UI: parseBoolean(
      raw.FEATURE_FLAG_NEW_UI,
      'FEATURE_FLAG_NEW_UI',
    ),
    MAPS_API_KEY: raw.MAPS_API_KEY as string,
  };
}

// ---------------------------------------------------------------------------
// Parsed & validated config (singleton)
// ---------------------------------------------------------------------------

const appConfig: AppConfig = parseConfig();

export default appConfig;

// ---------------------------------------------------------------------------
// Convenience environment helpers
// ---------------------------------------------------------------------------

export const isDev: boolean = appConfig.APP_ENV === 'development';
export const isStaging: boolean = appConfig.APP_ENV === 'staging';
export const isProd: boolean = appConfig.APP_ENV === 'production';
