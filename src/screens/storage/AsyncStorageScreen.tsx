import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  StorageEntry,
  clearAll,
  getAllEntries,
  getItem,
  getObject,
  multiRemove,
  multiSet,
  removeItem,
  setItem,
  setObject,
} from '../../services/asyncStorage';

import Button from '../../components/atoms/Button';
import Header from '../../components/atoms/Header';
import Icon from '@react-native-vector-icons/material-design-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import SectionHeader from '../../components/molecules/SectionHeader';
import { TextInput } from 'react-native-paper';
import { useTheme } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'StorageAsyncStorage'>;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const DEMO_BATCH_KEYS = ['batch:name', 'batch:role', 'batch:version'];

type UserProfile = {
  username: string;
  email: string;
  joinedAt: string;
};

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

const EmptyState = ({ message }: { message: string }) => {
  const { colors, typography } = useTheme();
  return (
    <View style={styles.emptyState}>
      <Icon name="tray-remove" size={28} color={colors.textTertiary} />
      <Text
        style={[
          typography.presets.bodySmall,
          styles.emptyStateText,
          { color: colors.textTertiary },
        ]}
      >
        {message}
      </Text>
    </View>
  );
};

const EntryRow = ({
  entry,
  onDelete,
}: {
  entry: StorageEntry;
  onDelete: (key: string) => void;
}) => {
  const { colors, typography } = useTheme();
  return (
    <View style={[styles.entryRow, { borderBottomColor: colors.border }]}>
      <View style={styles.entryText}>
        <Text
          style={[
            typography.presets.label,
            styles.entryKey,
            { color: colors.primary },
          ]}
          numberOfLines={1}
        >
          {entry.key}
        </Text>
        <Text
          style={[
            typography.presets.bodySmall,
            { color: colors.textSecondary },
          ]}
          numberOfLines={2}
        >
          {entry.value}
        </Text>
      </View>
      <Pressable
        onPress={() => onDelete(entry.key)}
        hitSlop={8}
        style={[styles.deleteBtn, { backgroundColor: colors.errorLight }]}
      >
        <Icon name="trash-can-outline" size={16} color={colors.errorMain} />
      </Pressable>
    </View>
  );
};

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------

export default function AsyncStorageScreen(_props: Props) {
  const { colors, spacing, isDark } = useTheme();

  // ── Set / Get state ───────────────────────────────────────────────────────
  const [writeKey, setWriteKey] = useState('');
  const [writeValue, setWriteValue] = useState('');
  const [readKey, setReadKey] = useState('');
  const [readResult, setReadResult] = useState<string | null>(undefined as any);
  const [readAttempted, setReadAttempted] = useState(false);

  // ── Remove state ──────────────────────────────────────────────────────────
  const [removeKey, setRemoveKey] = useState('');

  // ── All entries state ─────────────────────────────────────────────────────
  const [entries, setEntries] = useState<StorageEntry[]>([]);
  const [loadingEntries, setLoadingEntries] = useState(false);

  // ── JSON object state ─────────────────────────────────────────────────────
  const [profileUsername, setProfileUsername] = useState('john_doe');
  const [profileEmail, setProfileEmail] = useState('john@example.com');
  const [savedProfile, setSavedProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  // ── Loading flags ─────────────────────────────────────────────────────────
  const [saving, setSaving] = useState(false);
  const [reading, setReading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [batchSaving, setBatchSaving] = useState(false);

  const paperTheme = {
    colors: {
      primary: colors.primary,
      background: colors.surface,
      error: colors.errorMain,
    },
  };

  // ── Load all entries ──────────────────────────────────────────────────────
  const loadEntries = useCallback(async () => {
    setLoadingEntries(true);
    try {
      const all = await getAllEntries();
      setEntries(all.sort((a, b) => a.key.localeCompare(b.key)));
    } catch {
      Alert.alert('Error', 'Failed to load entries');
    } finally {
      setLoadingEntries(false);
    }
  }, []);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  // ── Load saved profile on mount ───────────────────────────────────────────
  useEffect(() => {
    getObject<UserProfile>('profile:user').then(p => {
      if (p) {
        setSavedProfile(p);
      }
    });
  }, []);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleSave = async () => {
    if (!writeKey.trim() || !writeValue.trim()) {
      Alert.alert('Validation', 'Both key and value are required.');
      return;
    }
    setSaving(true);
    try {
      await setItem(writeKey.trim(), writeValue.trim());
      setWriteKey('');
      setWriteValue('');
      await loadEntries();
    } catch {
      Alert.alert('Error', 'Failed to save item.');
    } finally {
      setSaving(false);
    }
  };

  const handleRead = async () => {
    if (!readKey.trim()) {
      Alert.alert('Validation', 'Enter a key to read.');
      return;
    }
    setReading(true);
    setReadAttempted(true);
    try {
      const val = await getItem(readKey.trim());
      setReadResult(val);
    } catch {
      Alert.alert('Error', 'Failed to read item.');
    } finally {
      setReading(false);
    }
  };

  const handleRemove = async () => {
    if (!removeKey.trim()) {
      Alert.alert('Validation', 'Enter a key to remove.');
      return;
    }
    setRemoving(true);
    try {
      await removeItem(removeKey.trim());
      setRemoveKey('');
      await loadEntries();
    } catch {
      Alert.alert('Error', 'Failed to remove item.');
    } finally {
      setRemoving(false);
    }
  };

  const handleDeleteEntry = async (key: string) => {
    try {
      await removeItem(key);
      await loadEntries();
    } catch {
      Alert.alert('Error', 'Failed to delete entry.');
    }
  };

  const handleBatchSave = async () => {
    setBatchSaving(true);
    try {
      await multiSet([
        { key: DEMO_BATCH_KEYS[0], value: 'RNToolBox User' },
        { key: DEMO_BATCH_KEYS[1], value: 'Developer' },
        { key: DEMO_BATCH_KEYS[2], value: '1.0.0' },
      ]);
      await loadEntries();
      Alert.alert('Batch Write', '3 keys written successfully.');
    } catch {
      Alert.alert('Error', 'Batch write failed.');
    } finally {
      setBatchSaving(false);
    }
  };

  const handleBatchRemove = async () => {
    try {
      await multiRemove(DEMO_BATCH_KEYS);
      await loadEntries();
      Alert.alert('Batch Remove', '3 keys removed.');
    } catch {
      Alert.alert('Error', 'Batch remove failed.');
    }
  };

  const handleSaveProfile = async () => {
    if (!profileUsername.trim() || !profileEmail.trim()) {
      Alert.alert('Validation', 'Username and email are required.');
      return;
    }
    setLoadingProfile(true);
    try {
      const profile: UserProfile = {
        username: profileUsername.trim(),
        email: profileEmail.trim(),
        joinedAt: new Date().toISOString(),
      };
      await setObject<UserProfile>('profile:user', profile);
      setSavedProfile(profile);
      await loadEntries();
    } catch {
      Alert.alert('Error', 'Failed to save profile.');
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear All Storage',
      'This will permanently delete every key in AsyncStorage. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            setClearing(true);
            try {
              await clearAll();
              setSavedProfile(null);
              setReadResult(null as any);
              setReadAttempted(false);
              await loadEntries();
            } catch {
              Alert.alert('Error', 'Failed to clear storage.');
            } finally {
              setClearing(false);
            }
          },
        },
      ],
    );
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]}>
      <Header title="AsyncStorage" />
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ------------------------------------------------------------------ */}
        {/* Hero                                                                */}
        {/* ------------------------------------------------------------------ */}
        <View
          style={[
            styles.hero,
            {
              backgroundColor: isDark ? colors.primary900 : colors.primary50,
              marginTop: spacing.lg,
              marginBottom: spacing.sm,
              padding: spacing.lg,
            },
          ]}
        >
          <Icon name="archive-outline" size={28} color={colors.primary} />
          <Text
            style={[
              styles.heroTitle,
              { color: colors.textPrimary, marginTop: spacing.sm },
            ]}
          >
            AsyncStorage
          </Text>
          <Text style={[styles.heroSubtitle, { color: colors.textSecondary }]}>
            Persistent, unencrypted, asynchronous key-value storage. Data
            survives app restarts but is cleared on uninstall.
          </Text>
        </View>

        {/* ------------------------------------------------------------------ */}
        {/* 1. Write (setItem)                                                  */}
        {/* ------------------------------------------------------------------ */}
        <SectionHeader title="setItem — Write a value" />
        <View
          style={[
            styles.card,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <TextInput
            mode="outlined"
            label="Key"
            value={writeKey}
            onChangeText={setWriteKey}
            autoCapitalize="none"
            autoCorrect={false}
            left={<TextInput.Icon icon="key-outline" />}
            right={
              writeKey.length > 0 ? (
                <TextInput.Icon icon="close" onPress={() => setWriteKey('')} />
              ) : undefined
            }
            style={[styles.input, { backgroundColor: colors.surface }]}
            theme={paperTheme}
          />
          <TextInput
            mode="outlined"
            label="Value"
            value={writeValue}
            onChangeText={setWriteValue}
            autoCapitalize="none"
            autoCorrect={false}
            left={<TextInput.Icon icon="pencil-outline" />}
            right={
              writeValue.length > 0 ? (
                <TextInput.Icon
                  icon="close"
                  onPress={() => setWriteValue('')}
                />
              ) : undefined
            }
            style={[styles.input, { backgroundColor: colors.surface }]}
            theme={paperTheme}
          />
          <Button
            title={saving ? 'Saving...' : 'Save Item'}
            variant="primary"
            onPress={handleSave}
            loading={saving}
            disabled={!writeKey.trim() || !writeValue.trim()}
            fullWidth
          />
        </View>

        {/* ------------------------------------------------------------------ */}
        {/* 2. Read (getItem)                                                   */}
        {/* ------------------------------------------------------------------ */}
        <SectionHeader title="getItem — Read a value" />
        <View
          style={[
            styles.card,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <TextInput
            mode="outlined"
            label="Key to Read"
            value={readKey}
            onChangeText={text => {
              setReadKey(text);
              setReadAttempted(false);
            }}
            autoCapitalize="none"
            autoCorrect={false}
            left={<TextInput.Icon icon="magnify" />}
            right={
              readKey.length > 0 ? (
                <TextInput.Icon
                  icon="close"
                  onPress={() => {
                    setReadKey('');
                    setReadAttempted(false);
                  }}
                />
              ) : undefined
            }
            style={[styles.input, { backgroundColor: colors.surface }]}
            theme={paperTheme}
          />
          <Button
            title={reading ? 'Reading...' : 'Read Item'}
            variant="outline"
            onPress={handleRead}
            loading={reading}
            disabled={!readKey.trim()}
            fullWidth
          />
          {readAttempted && (
            <View
              style={[
                styles.resultBox,
                {
                  backgroundColor: isDark
                    ? colors.surfaceElevated
                    : colors.primary50,
                  borderColor: colors.primary200,
                  marginTop: spacing.md,
                },
              ]}
            >
              <Text
                style={[styles.resultLabel, { color: colors.textTertiary }]}
              >
                Result
              </Text>
              {readResult !== null ? (
                <Text
                  style={[styles.resultValue, { color: colors.textPrimary }]}
                >
                  {readResult}
                </Text>
              ) : (
                <Text
                  style={[styles.resultNull, { color: colors.textTertiary }]}
                >
                  null — key not found
                </Text>
              )}
            </View>
          )}
        </View>

        {/* ------------------------------------------------------------------ */}
        {/* 3. Remove (removeItem)                                              */}
        {/* ------------------------------------------------------------------ */}
        <SectionHeader title="removeItem — Delete a key" />
        <View
          style={[
            styles.card,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <TextInput
            mode="outlined"
            label="Key to Remove"
            value={removeKey}
            onChangeText={setRemoveKey}
            autoCapitalize="none"
            autoCorrect={false}
            left={<TextInput.Icon icon="trash-can-outline" />}
            right={
              removeKey.length > 0 ? (
                <TextInput.Icon icon="close" onPress={() => setRemoveKey('')} />
              ) : undefined
            }
            style={[styles.input, { backgroundColor: colors.surface }]}
            theme={paperTheme}
          />
          <Button
            title={removing ? 'Removing...' : 'Remove Item'}
            variant="outline"
            onPress={handleRemove}
            loading={removing}
            disabled={!removeKey.trim()}
            fullWidth
          />
        </View>

        {/* ------------------------------------------------------------------ */}
        {/* 4. Batch operations (multiSet / multiRemove)                        */}
        {/* ------------------------------------------------------------------ */}
        <SectionHeader title="multiSet / multiRemove — Batch operations" />
        <View
          style={[
            styles.card,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.batchDesc, { color: colors.textSecondary }]}>
            Writes or removes 3 demo keys atomically:{'\n'}
            <Text style={{ color: colors.primary }}>
              {DEMO_BATCH_KEYS.join('  ·  ')}
            </Text>
          </Text>
          <View style={styles.batchButtons}>
            <View style={styles.batchBtn}>
              <Button
                title={batchSaving ? 'Writing...' : 'Batch Write'}
                variant="primary"
                onPress={handleBatchSave}
                loading={batchSaving}
                fullWidth
              />
            </View>
            <View style={styles.batchBtn}>
              <Button
                title="Batch Remove"
                variant="outline"
                onPress={handleBatchRemove}
                fullWidth
              />
            </View>
          </View>
        </View>

        {/* ------------------------------------------------------------------ */}
        {/* 5. JSON object (setObject / getObject)                              */}
        {/* ------------------------------------------------------------------ */}
        <SectionHeader title="setObject / getObject — Store JSON" />
        <View
          style={[
            styles.card,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <TextInput
            mode="outlined"
            label="Username"
            value={profileUsername}
            onChangeText={setProfileUsername}
            autoCapitalize="none"
            autoCorrect={false}
            left={<TextInput.Icon icon="account-outline" />}
            style={[styles.input, { backgroundColor: colors.surface }]}
            theme={paperTheme}
          />
          <TextInput
            mode="outlined"
            label="Email"
            value={profileEmail}
            onChangeText={setProfileEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            left={<TextInput.Icon icon="email-outline" />}
            style={[styles.input, { backgroundColor: colors.surface }]}
            theme={paperTheme}
          />
          <Button
            title={loadingProfile ? 'Saving...' : 'Save Profile as JSON'}
            variant="primary"
            onPress={handleSaveProfile}
            loading={loadingProfile}
            disabled={!profileUsername.trim() || !profileEmail.trim()}
            fullWidth
          />

          {savedProfile && (
            <View
              style={[
                styles.profileCard,
                {
                  backgroundColor: isDark
                    ? colors.surfaceElevated
                    : colors.primary50,
                  borderColor: colors.primary200,
                  marginTop: spacing.md,
                },
              ]}
            >
              <Text
                style={[styles.resultLabel, { color: colors.textTertiary }]}
              >
                Stored at key: profile:user
              </Text>
              <View style={styles.profileRow}>
                <Icon
                  name="account-circle-outline"
                  size={36}
                  color={colors.primary}
                />
                <View style={styles.profileBody}>
                  <Text
                    style={[styles.profileName, { color: colors.textPrimary }]}
                  >
                    {savedProfile.username}
                  </Text>
                  <Text
                    style={[
                      styles.profileEmail,
                      { color: colors.textSecondary },
                    ]}
                  >
                    {savedProfile.email}
                  </Text>
                  <Text
                    style={[styles.profileDate, { color: colors.textTertiary }]}
                  >
                    Saved: {new Date(savedProfile.joinedAt).toLocaleString()}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* ------------------------------------------------------------------ */}
        {/* 6. All entries (getAllKeys + multiGet)                              */}
        {/* ------------------------------------------------------------------ */}
        <SectionHeader
          title="getAllKeys — Browse all entries"
          action={{ label: 'Refresh', onPress: loadEntries }}
        />
        <View
          style={[
            styles.card,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          {loadingEntries ? (
            <ActivityIndicator
              color={colors.primary}
              style={{ paddingVertical: spacing.lg }}
            />
          ) : entries.length === 0 ? (
            <EmptyState message="No entries in AsyncStorage yet." />
          ) : (
            entries.map(entry => (
              <EntryRow
                key={entry.key}
                entry={entry}
                onDelete={handleDeleteEntry}
              />
            ))
          )}
        </View>

        {/* ------------------------------------------------------------------ */}
        {/* 7. Clear all                                                        */}
        {/* ------------------------------------------------------------------ */}
        <SectionHeader title="clear — Wipe all storage" />
        <View
          style={[
            styles.card,
            styles.dangerCard,
            {
              backgroundColor: colors.errorLight,
              borderColor: colors.errorMain,
            },
          ]}
        >
          <View style={styles.dangerRow}>
            <Icon
              name="alert-circle-outline"
              size={20}
              color={colors.errorMain}
            />
            <Text style={[styles.dangerText, { color: colors.errorMain }]}>
              Permanently deletes every key stored in AsyncStorage. This action
              cannot be undone.
            </Text>
          </View>
          <Button
            title={clearing ? 'Clearing...' : 'Clear All Storage'}
            variant="outline"
            onPress={handleClearAll}
            loading={clearing}
            fullWidth
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {},

  // Hero
  hero: {
    alignItems: 'center',
    borderRadius: 16,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 6,
  },

  // Card
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginHorizontal: 16,
    gap: 12,
  },
  dangerCard: {
    gap: 12,
  },

  // Input
  input: {},

  // Result box
  resultBox: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
  },
  resultLabel: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  resultValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  resultNull: {
    fontSize: 13,
    fontStyle: 'italic',
  },

  // Batch
  batchDesc: {
    fontSize: 13,
    lineHeight: 20,
  },
  batchButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  batchBtn: {
    flex: 1,
  },

  // Profile card
  profileCard: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  profileName: {
    fontSize: 15,
    fontWeight: '700',
  },
  profileEmail: {
    fontSize: 13,
    marginTop: 2,
  },
  profileDate: {
    fontSize: 11,
    marginTop: 2,
  },

  // Entry row
  entryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    gap: 10,
  },
  entryText: {
    flex: 1,
  },
  entryKey: {
    marginBottom: 2,
  },
  profileBody: {
    marginLeft: 8,
    flex: 1,
  },
  deleteBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Empty state
  emptyState: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyStateText: {
    marginTop: 8,
  },

  // Danger
  dangerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  dangerText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '500',
  },
});
