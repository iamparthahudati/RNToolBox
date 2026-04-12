import AsyncStorage from '@react-native-async-storage/async-storage';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type StorageEntry = {
  key: string;
  value: string;
};

// ---------------------------------------------------------------------------
// Core operations
// ---------------------------------------------------------------------------

/**
 * Write a string value for a given key.
 */
export const setItem = async (key: string, value: string): Promise<void> => {
  await AsyncStorage.setItem(key, value);
};

/**
 * Read the string value for a given key.
 * Returns null if the key does not exist.
 */
export const getItem = async (key: string): Promise<string | null> => {
  return AsyncStorage.getItem(key);
};

/**
 * Remove a single key from storage.
 */
export const removeItem = async (key: string): Promise<void> => {
  await AsyncStorage.removeItem(key);
};

/**
 * Write multiple key-value pairs in a single batch operation.
 * Uses the v3 setMany API which accepts a Record<string, string>.
 */
export const multiSet = async (pairs: StorageEntry[]): Promise<void> => {
  const record: Record<string, string> = {};
  pairs.forEach(({ key, value }) => {
    record[key] = value;
  });
  await AsyncStorage.setMany(record);
};

/**
 * Read multiple keys at once.
 * Returns an array of { key, value } objects (value is null if key missing).
 * Uses the v3 getMany API which returns Record<string, string | null>.
 */
export const multiGet = async (
  keys: string[],
): Promise<{ key: string; value: string | null }[]> => {
  const result = await AsyncStorage.getMany(keys);
  return Object.entries(result).map(([key, value]) => ({ key, value }));
};

/**
 * Remove multiple keys in a single batch operation.
 */
export const multiRemove = async (keys: string[]): Promise<void> => {
  await AsyncStorage.removeMany(keys);
};

/**
 * Retrieve all keys currently stored in AsyncStorage.
 */
export const getAllKeys = async (): Promise<string[]> => {
  const keys = await AsyncStorage.getAllKeys();
  return [...keys];
};

/**
 * Read every key-value pair currently in AsyncStorage.
 */
export const getAllEntries = async (): Promise<StorageEntry[]> => {
  const keys = await getAllKeys();
  if (keys.length === 0) {
    return [];
  }
  const pairs = await multiGet(keys);
  return pairs.map(({ key, value }) => ({ key, value: value ?? '' }));
};

/**
 * Wipe all data from AsyncStorage.
 * Uses the v3 clear() API.
 */
export const clearAll = async (): Promise<void> => {
  await AsyncStorage.clear();
};

/**
 * Store a JSON-serialisable object under a given key.
 */
export const setObject = async <T>(key: string, value: T): Promise<void> => {
  await AsyncStorage.setItem(key, JSON.stringify(value));
};

/**
 * Retrieve and parse a JSON object stored under a given key.
 * Returns null if the key does not exist or the value cannot be parsed.
 */
export const getObject = async <T>(key: string): Promise<T | null> => {
  const raw = await AsyncStorage.getItem(key);
  if (raw === null) {
    return null;
  }
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};
