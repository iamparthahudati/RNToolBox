import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
import { theme } from '../../theme';

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
    <SafeAreaView style={styles.root}>
      <Header title="Remote Config" />

      {error !== null && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
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
          <View style={styles.actionContainer}>
            <TouchableOpacity
              style={[
                styles.fetchButton,
                fetching && styles.fetchButtonDisabled,
              ]}
              onPress={handleFetchAndActivate}
              disabled={fetching}
              activeOpacity={0.8}
            >
              {fetching ? (
                <ActivityIndicator size="small" color={theme.colors.white} />
              ) : (
                <Text style={styles.fetchButtonText}>Fetch & Activate</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.setupButton}
              onPress={() => navigation.navigate('NetworkingRemoteConfigSetup')}
              activeOpacity={0.8}
            >
              <Text style={styles.setupButtonText}>
                Firebase Console Setup Guide
              </Text>
            </TouchableOpacity>
          </View>

          {/* HOW IT WORKS */}
          <SectionHeader title="HOW IT WORKS" />
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>
              Remote Config lets you change app behavior and appearance without
              publishing an app update.
            </Text>
            <Text style={styles.infoText}>
              Values are fetched from Firebase and cached locally on the device
              for efficient access.
            </Text>
            <Text style={styles.infoText}>
              fetchAndActivate() fetches the latest values from Firebase and
              immediately makes them active in the current session.
            </Text>
            <Text style={styles.infoText}>
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
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.sm,
    padding: theme.spacing.md,
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  errorText: {
    color: theme.colors.error,
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium as '500',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: theme.spacing.xxl,
  },
  actionContainer: {
    marginHorizontal: theme.spacing.lg,
    marginVertical: theme.spacing.md,
  },
  fetchButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fetchButtonDisabled: {
    opacity: 0.6,
  },
  fetchButtonText: {
    color: theme.colors.white,
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.semibold as '600',
  },
  setupButton: {
    marginTop: theme.spacing.sm,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.white,
  },
  setupButtonText: {
    color: theme.colors.primary,
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.semibold as '600',
  },
  infoCard: {
    backgroundColor: theme.colors.white,
    marginHorizontal: theme.spacing.lg,
    marginVertical: theme.spacing.md,
    padding: theme.spacing.lg,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: theme.spacing.sm,
  },
  infoText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.sizes.sm,
    lineHeight: 20,
  },
});
