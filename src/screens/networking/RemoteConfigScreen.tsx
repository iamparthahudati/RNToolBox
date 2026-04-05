import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Button from '../../components/atoms/Button/Button';
import Header from '../../components/atoms/Header';
import InfoRow from '../../components/molecules/InfoRow';
import SectionHeader from '../../components/molecules/SectionHeader';
import { RootStackParamList } from '../../navigation/types';
import {
  DEFAULT_REMOTE_CONFIG_VALUES,
  fetchAndActivate,
  getFetchStatus,
  getFirebaseProjectId,
  getLastFetchTime,
  getRemoteConfigValues,
  initRemoteConfig,
  RemoteConfigValues,
} from '../../services/remoteConfig';
import { useTheme } from '../../theme';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'NetworkingRemoteConfig'
>;

function formatFetchStatus(status: string): string {
  if (!status) {
    return 'Unknown';
  }
  return status
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function formatDate(date: Date | null): string {
  if (!date) {
    return 'Never';
  }
  return date.toLocaleString();
}

export default function RemoteConfigScreen({
  navigation,
}: Props): React.JSX.Element {
  const { colors, spacing, typography } = useTheme();

  const [loading, setLoading] = useState<boolean>(true);
  const [fetching, setFetching] = useState<boolean>(false);
  const [values, setValues] = useState<RemoteConfigValues>(
    DEFAULT_REMOTE_CONFIG_VALUES,
  );
  const [lastFetchTime, setLastFetchTime] = useState<Date | null>(null);
  const [fetchStatus, setFetchStatus] = useState<string>('');
  const [projectId, setProjectId] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      try {
        await initRemoteConfig();
        setValues(getRemoteConfigValues());
        setLastFetchTime(getLastFetchTime());
        setFetchStatus(getFetchStatus());
        setProjectId(getFirebaseProjectId());
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to initialize Remote Config',
        );
      } finally {
        setLoading(false);
      }
    }

    init();
  }, []);

  async function handleFetchAndActivate() {
    setFetching(true);
    setError(null);
    try {
      await fetchAndActivate();
      setValues(getRemoteConfigValues());
      setLastFetchTime(getLastFetchTime());
      setFetchStatus(getFetchStatus());
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to fetch Remote Config',
      );
    } finally {
      setFetching(false);
    }
  }

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]}>
      <Header title="Remote Config" />

      {error !== null && (
        <View
          style={[
            styles.errorContainer,
            {
              marginHorizontal: spacing.lg,
              marginTop: spacing.sm,
              padding: spacing.md,
              backgroundColor: colors.errorLight,
              borderColor: colors.errorMain,
              borderRadius: spacing.radii.md,
            },
          ]}
        >
          <Text
            style={[typography.presets.bodySmall, { color: colors.errorMain }]}
          >
            {error}
          </Text>
        </View>
      )}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={{ paddingBottom: spacing.xxl }}
          showsVerticalScrollIndicator={false}
        >
          {/* STATUS */}
          <SectionHeader title="STATUS" />
          <InfoRow label="Firebase Project" value={projectId || '—'} />
          <InfoRow
            label="Fetch Status"
            value={formatFetchStatus(fetchStatus)}
          />
          <InfoRow label="Last Fetched" value={formatDate(lastFetchTime)} />

          {/* CONFIG VALUES */}
          <SectionHeader title="CONFIG VALUES" />
          <InfoRow label="Welcome Message" value={values.welcome_message} />
          <InfoRow
            label="Maintenance Mode"
            value={values.maintenance_mode ? 'Enabled' : 'Disabled'}
          />
          <InfoRow
            label="Max Retry Count"
            value={String(values.max_retry_count)}
          />
          <InfoRow
            label="Feature Banner"
            value={values.feature_banner_enabled ? 'Enabled' : 'Disabled'}
          />
          <InfoRow label="API Base URL" value={values.api_base_url} />
          <InfoRow label="Min App Version" value={values.min_app_version} />

          {/* ACTIONS */}
          <SectionHeader title="ACTIONS" />
          <View
            style={[
              styles.actionContainer,
              { marginHorizontal: spacing.lg, marginVertical: spacing.md },
            ]}
          >
            <Button
              title="Fetch & Activate"
              variant="primary"
              onPress={handleFetchAndActivate}
              loading={fetching}
              disabled={fetching}
              fullWidth
            />
            <View style={{ marginTop: spacing.sm }}>
              <Button
                title="Firebase Console Setup Guide"
                variant="outline"
                onPress={() =>
                  navigation.navigate('NetworkingRemoteConfigSetup')
                }
                fullWidth
              />
            </View>
          </View>

          {/* HOW IT WORKS */}
          <SectionHeader title="HOW IT WORKS" />
          <View
            style={[
              styles.infoCard,
              {
                backgroundColor: colors.surface,
                marginHorizontal: spacing.lg,
                marginVertical: spacing.md,
                padding: spacing.lg,
                borderRadius: spacing.radii.md,
                borderColor: colors.border,
                gap: spacing.sm,
              },
            ]}
          >
            <Text
              style={[
                typography.presets.bodySmall,
                { color: colors.textSecondary },
              ]}
            >
              Remote Config lets you change app behavior and appearance without
              publishing an app update.
            </Text>
            <Text
              style={[
                typography.presets.bodySmall,
                { color: colors.textSecondary },
              ]}
            >
              Values are fetched from Firebase and cached locally on the device
              for efficient access.
            </Text>
            <Text
              style={[
                typography.presets.bodySmall,
                { color: colors.textSecondary },
              ]}
            >
              fetchAndActivate() fetches the latest values from Firebase and
              immediately makes them active in the current session.
            </Text>
            <Text
              style={[
                typography.presets.bodySmall,
                { color: colors.textSecondary },
              ]}
            >
              minimumFetchIntervalMillis is set to 0 for this demo to allow
              immediate re-fetching. The production default is 12 hours to
              prevent excessive network requests.
            </Text>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    borderWidth: 1,
  },
  scrollView: {
    flex: 1,
  },
  actionContainer: {},
  infoCard: {
    borderWidth: 1,
  },
});
