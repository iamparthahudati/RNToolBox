import Icon from '@react-native-vector-icons/material-design-icons';
import {
  authenticateWithOptions,
  createKeys,
  deleteKeys,
  getKeyAttributes,
  isSensorAvailable,
  sha256,
  simplePrompt,
  validateKeyIntegrity,
  verifyKeySignature,
} from '@sbaiahmed1/react-native-biometrics';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  EventSubscription,
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
import { useTheme } from '../../theme';

// ─── Types ────────────────────────────────────────────────────────────────────

type AuthStatus = 'idle' | 'loading' | 'success' | 'failed' | 'cancelled';

interface SensorInfo {
  available: boolean;
  biometryType: string | undefined;
  error?: string;
}

interface KeyInfo {
  exists: boolean;
  algorithm?: string;
  keySize?: number;
  isInsideSecureHardware?: boolean;
  userAuthenticationRequired?: boolean;
}

interface LogEntry {
  id: number;
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'error' | 'warn';
}

interface ChangeRecord {
  id: number;
  timestamp: string;
  changeType: string;
  biometryType: string;
  available: boolean;
  enrolled: boolean;
}

// ─── Action Button ─────────────────────────────────────────────────────────────

interface ActionButtonProps {
  label: string;
  icon: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'danger' | 'outline';
}

const ActionButton = ({
  label,
  icon,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
}: ActionButtonProps) => {
  const { colors, spacing, typography } = useTheme();
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () =>
    Animated.spring(scale, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 50,
      bounciness: 0,
    }).start();

  const handlePressOut = () =>
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();

  const bg =
    variant === 'danger'
      ? colors.errorMain
      : variant === 'outline'
      ? 'transparent'
      : colors.primary;

  const textColor = variant === 'outline' ? colors.primary : colors.white;

  const borderColor = variant === 'outline' ? colors.primary : undefined;

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      activeOpacity={1}
    >
      <Animated.View
        style={[
          styles.actionBtn,
          {
            backgroundColor: bg,
            borderColor,
            borderWidth: variant === 'outline' ? 1.5 : 0,
            paddingVertical: spacing.sm,
            paddingHorizontal: spacing.md,
            borderRadius: spacing.sm,
            opacity: disabled ? 0.45 : 1,
          },
          { transform: [{ scale }] },
        ]}
      >
        {loading ? (
          <ActivityIndicator size="small" color={textColor} />
        ) : (
          <>
            <Icon name={icon as any} size={16} color={textColor} />
            <Text
              style={[
                typography.presets.label,
                { color: textColor, marginLeft: spacing.xs, fontSize: 13 },
              ]}
            >
              {label}
            </Text>
          </>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

// ─── Status Badge ──────────────────────────────────────────────────────────────

const StatusBadge = ({ status }: { status: AuthStatus }) => {
  const { colors, spacing, typography } = useTheme();

  const config: Record<
    AuthStatus,
    { label: string; bg: string; text: string; icon: string }
  > = {
    idle: {
      label: 'Ready',
      bg: colors.surfaceElevated,
      text: colors.textSecondary,
      icon: 'circle-outline',
    },
    loading: {
      label: 'Authenticating...',
      bg: colors.infoLight,
      text: colors.infoMain,
      icon: 'loading',
    },
    success: {
      label: 'Authenticated',
      bg: colors.successLight,
      text: colors.successMain,
      icon: 'check-circle',
    },
    failed: {
      label: 'Failed',
      bg: colors.errorLight,
      text: colors.errorMain,
      icon: 'close-circle',
    },
    cancelled: {
      label: 'Cancelled',
      bg: colors.warningLight,
      text: colors.warningMain,
      icon: 'cancel',
    },
  };

  const c = config[status];

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: c.bg,
          paddingHorizontal: spacing.sm,
          paddingVertical: spacing.xs,
          borderRadius: spacing.xs,
        },
      ]}
    >
      <Icon name={c.icon as any} size={13} color={c.text} />
      <Text
        style={[
          typography.presets.caption,
          { color: c.text, marginLeft: 4, fontWeight: '600' },
        ]}
      >
        {c.label}
      </Text>
    </View>
  );
};

// ─── Log Panel ─────────────────────────────────────────────────────────────────

const LogPanel = ({ entries }: { entries: LogEntry[] }) => {
  const { colors, spacing, typography } = useTheme();

  const typeColor: Record<LogEntry['type'], string> = {
    info: colors.infoMain,
    success: colors.successMain,
    error: colors.errorMain,
    warn: colors.warningMain,
  };

  const typeIcon: Record<LogEntry['type'], string> = {
    info: 'information-outline',
    success: 'check-circle-outline',
    error: 'alert-circle-outline',
    warn: 'alert-outline',
  };

  if (entries.length === 0) {
    return (
      <View
        style={[
          styles.logEmpty,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            padding: spacing.md,
            borderRadius: spacing.xs,
          },
        ]}
      >
        <Text
          style={[typography.presets.caption, { color: colors.textTertiary }]}
        >
          No activity yet. Trigger an action above.
        </Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.logPanel,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderRadius: spacing.xs,
        },
      ]}
    >
      {entries.map(entry => (
        <View
          key={entry.id}
          style={[
            styles.logRow,
            {
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.xs,
              borderBottomWidth: StyleSheet.hairlineWidth,
              borderBottomColor: colors.border,
            },
          ]}
        >
          <Icon
            name={typeIcon[entry.type] as any}
            size={13}
            color={typeColor[entry.type]}
            style={{ marginTop: 1 }}
          />
          <View style={{ flex: 1, marginLeft: spacing.xs }}>
            <Text
              style={[
                typography.presets.caption,
                { color: colors.textTertiary },
              ]}
            >
              {entry.timestamp}
            </Text>
            <Text
              style={[
                typography.presets.bodySmall,
                { color: typeColor[entry.type], lineHeight: 18 },
              ]}
            >
              {entry.message}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
};

// ─── Main Screen ───────────────────────────────────────────────────────────────

export default function BiometricsScreen(): React.JSX.Element {
  const { colors, spacing, typography } = useTheme();

  const [sensorInfo, setSensorInfo] = useState<SensorInfo | null>(null);
  const [sensorLoading, setSensorLoading] = useState(true);
  const [authStatus, setAuthStatus] = useState<AuthStatus>('idle');
  const [authWithFallbackStatus, setAuthWithFallbackStatus] =
    useState<AuthStatus>('idle');
  const [keyInfo, setKeyInfo] = useState<KeyInfo>({ exists: false });
  const [keyLoading, setKeyLoading] = useState(false);
  const [sigStatus, setSigStatus] = useState<AuthStatus>('idle');
  const [hashResult, setHashResult] = useState<string | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const logIdRef = useRef(0);

  // ── Change detection state ─────────────────────────────────────────────────
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionLoading, setDetectionLoading] = useState(false);
  const [changeHistory, setChangeHistory] = useState<ChangeRecord[]>([]);
  const changeIdRef = useRef(0);
  const subscriptionRef = useRef<EventSubscription | null>(null);

  const addLog = useCallback(
    (message: string, type: LogEntry['type'] = 'info') => {
      const now = new Date();
      const timestamp = `${now.getHours().toString().padStart(2, '0')}:${now
        .getMinutes()
        .toString()
        .padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
      setLogs(prev => [
        { id: logIdRef.current++, timestamp, message, type },
        ...prev.slice(0, 19),
      ]);
    },
    [],
  );

  // ── Sensor check on mount ──────────────────────────────────────────────────

  useEffect(() => {
    const checkSensor = async () => {
      try {
        const result = await isSensorAvailable();
        setSensorInfo({
          available: result.available,
          biometryType: result.biometryType,
        });
        addLog(
          result.available
            ? `Sensor available: ${result.biometryType}`
            : 'No biometric sensor available',
          result.available ? 'success' : 'warn',
        );
      } catch (e: any) {
        setSensorInfo({
          available: false,
          biometryType: undefined,
          error: e?.message,
        });
        addLog(`Sensor check failed: ${e?.message}`, 'error');
      } finally {
        setSensorLoading(false);
      }
    };

    checkSensor();
  }, [addLog]);

  // ── Refresh key info ───────────────────────────────────────────────────────

  const refreshKeyInfo = useCallback(async () => {
    try {
      const integrity = await validateKeyIntegrity();
      if (integrity.keyExists) {
        try {
          const attrs = await getKeyAttributes();
          setKeyInfo({
            exists: true,
            algorithm: (attrs as any)?.keyType ?? (attrs as any)?.algorithm,
            keySize: (attrs as any)?.keySize,
            isInsideSecureHardware: (attrs as any)?.isInsideSecureHardware,
            userAuthenticationRequired: (attrs as any)
              ?.userAuthenticationRequired,
          });
        } catch {
          setKeyInfo({ exists: true });
        }
      } else {
        setKeyInfo({ exists: false });
      }
    } catch {
      setKeyInfo({ exists: false });
    }
  }, []);

  useEffect(() => {
    refreshKeyInfo();
  }, [refreshKeyInfo]);

  // ── Simple prompt ──────────────────────────────────────────────────────────

  const handleSimplePrompt = async () => {
    setAuthStatus('loading');
    addLog('Triggering simple biometric prompt...', 'info');
    try {
      const result = await simplePrompt('Verify your identity');
      if (result) {
        setAuthStatus('success');
        addLog('Simple prompt: authentication successful', 'success');
      } else {
        setAuthStatus('cancelled');
        addLog('Simple prompt: user cancelled', 'warn');
      }
    } catch (e: any) {
      setAuthStatus('failed');
      addLog(`Simple prompt error: ${e?.message}`, 'error');
    }
  };

  // ── Auth with options (device credential fallback) ─────────────────────────

  const handleAuthWithFallback = async () => {
    setAuthWithFallbackStatus('loading');
    addLog('Triggering auth with device credential fallback...', 'info');
    try {
      const result = await authenticateWithOptions({
        promptMessage: 'Authenticate to continue',
        cancelButtonText: 'Cancel',
        allowDeviceCredentials: true,
      });
      if ((result as any)?.success || result === true) {
        setAuthWithFallbackStatus('success');
        const authType = (result as any)?.authType;
        addLog(
          `Auth with fallback: success${authType ? ` via ${authType}` : ''}`,
          'success',
        );
      } else {
        setAuthWithFallbackStatus('cancelled');
        addLog('Auth with fallback: user cancelled', 'warn');
      }
    } catch (e: any) {
      setAuthWithFallbackStatus('failed');
      addLog(`Auth with fallback error: ${e?.message}`, 'error');
    }
  };

  // ── Create key ─────────────────────────────────────────────────────────────

  const handleCreateKey = async () => {
    setKeyLoading(true);
    addLog('Creating biometric-bound EC256 key...', 'info');
    try {
      await createKeys('rntoolbox_key', 'EC256', undefined, false, false);
      addLog('Key created successfully', 'success');
      await refreshKeyInfo();
    } catch (e: any) {
      addLog(`Key creation failed: ${e?.message}`, 'error');
    } finally {
      setKeyLoading(false);
    }
  };

  // ── Delete key ─────────────────────────────────────────────────────────────

  const handleDeleteKey = async () => {
    setKeyLoading(true);
    addLog('Deleting biometric key...', 'info');
    try {
      await deleteKeys('rntoolbox_key');
      addLog('Key deleted successfully', 'success');
      await refreshKeyInfo();
    } catch (e: any) {
      addLog(`Key deletion failed: ${e?.message}`, 'error');
    } finally {
      setKeyLoading(false);
    }
  };

  // ── Verify signature ───────────────────────────────────────────────────────

  const handleVerifySignature = async () => {
    setSigStatus('loading');
    addLog('Requesting biometric signature verification...', 'info');
    try {
      const payload = `rntoolbox-payload-${Date.now()}`;
      const result = await verifyKeySignature({
        promptMessage: 'Sign to verify identity',
        payload,
        keyAlias: 'rntoolbox_key',
      });
      if ((result as any)?.success || (result as any)?.signature) {
        setSigStatus('success');
        addLog('Signature verified successfully', 'success');
      } else {
        setSigStatus('cancelled');
        addLog('Signature: user cancelled', 'warn');
      }
    } catch (e: any) {
      setSigStatus('failed');
      addLog(`Signature error: ${e?.message}`, 'error');
    }
  };

  // ── SHA-256 hash ───────────────────────────────────────────────────────────

  const handleHash = async () => {
    addLog('Computing SHA-256 hash via native module...', 'info');
    try {
      const input = `rntoolbox-${Date.now()}`;
      const hash = await sha256(input);
      setHashResult(hash);
      addLog(`SHA-256 computed: ${hash.slice(0, 16)}...`, 'success');
    } catch (e: any) {
      addLog(`SHA-256 error: ${e?.message}`, 'error');
    }
  };

  // ── Biometric change detection ─────────────────────────────────────────────

  const handleBiometricChange = useCallback(
    (event: BiometricChangeEvent) => {
      const now = new Date();
      const timestamp = `${now.getHours().toString().padStart(2, '0')}:${now
        .getMinutes()
        .toString()
        .padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

      setChangeHistory(prev => [
        {
          id: changeIdRef.current++,
          timestamp,
          changeType: event.changeType,
          biometryType: event.biometryType ?? 'Unknown',
          available: event.available,
          enrolled: event.enrolled,
        },
        ...prev.slice(0, 29),
      ]);

      const logType =
        event.changeType === 'BIOMETRIC_DISABLED' ? 'warn' : 'success';
      addLog(
        `Change detected: ${event.changeType} — ${
          event.biometryType ?? 'Unknown'
        } — enrolled: ${event.enrolled}`,
        logType,
      );
    },
    [addLog],
  );

  const handleStartDetection = async () => {
    setDetectionLoading(true);
    addLog('Starting biometric change detection...', 'info');
    try {
      const sub = subscribeToBiometricChanges(handleBiometricChange);
      subscriptionRef.current = sub;
      await startBiometricChangeDetection();
      setIsDetecting(true);
      addLog(
        'Change detection active — monitoring enrollment changes',
        'success',
      );
    } catch (e: any) {
      addLog(`Failed to start detection: ${e?.message}`, 'error');
    } finally {
      setDetectionLoading(false);
    }
  };

  const handleStopDetection = async () => {
    setDetectionLoading(true);
    addLog('Stopping biometric change detection...', 'info');
    try {
      if (subscriptionRef.current) {
        unsubscribeFromBiometricChanges(subscriptionRef.current);
        subscriptionRef.current = null;
      }
      await stopBiometricChangeDetection();
      setIsDetecting(false);
      addLog('Change detection stopped', 'warn');
    } catch (e: any) {
      addLog(`Failed to stop detection: ${e?.message}`, 'error');
    } finally {
      setDetectionLoading(false);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (subscriptionRef.current) {
        unsubscribeFromBiometricChanges(subscriptionRef.current);
      }
      stopBiometricChangeDetection().catch(() => {});
    };
  }, []);

  // ── Derived display values ─────────────────────────────────────────────────

  const sensorAvailableValue = sensorLoading
    ? 'Checking...'
    : sensorInfo?.available
    ? 'Available'
    : 'Not available';

  const sensorAvailableColor = sensorLoading
    ? colors.textSecondary
    : sensorInfo?.available
    ? colors.successMain
    : colors.errorMain;

  const biometryTypeValue =
    sensorInfo?.biometryType ?? (sensorLoading ? '—' : 'None');

  const biometryIcon =
    sensorInfo?.biometryType === 'FaceID'
      ? 'face-recognition'
      : sensorInfo?.biometryType === 'TouchID'
      ? 'fingerprint'
      : 'cellphone-key';

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]}>
      <Header title="Biometrics" />

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: spacing.xxl }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── SENSOR STATUS ─────────────────────────────────────────────── */}
        <View>
          <SectionHeader title="SENSOR STATUS" />
          {sensorLoading ? (
            <View
              style={[
                styles.loaderRow,
                {
                  backgroundColor: colors.surface,
                  paddingVertical: spacing.lg,
                },
              ]}
            >
              <ActivityIndicator color={colors.primary} />
            </View>
          ) : (
            <>
              <InfoRow
                label="Biometric sensor"
                value={sensorAvailableValue}
                valueColor={sensorAvailableColor}
                icon={biometryIcon}
              />
              <InfoRow
                label="Biometry type"
                value={biometryTypeValue}
                icon="shield-check-outline"
              />
              {sensorInfo?.error && (
                <InfoRow
                  multiline
                  label="Error"
                  value={sensorInfo.error}
                  valueColor={colors.errorMain}
                />
              )}
            </>
          )}
        </View>

        {/* ── SIMPLE AUTHENTICATION ──────────────────────────────────────── */}
        <View>
          <SectionHeader title="SIMPLE AUTHENTICATION" />
          <View
            style={[
              styles.actionCard,
              {
                backgroundColor: colors.surface,
                padding: spacing.lg,
                borderBottomWidth: StyleSheet.hairlineWidth,
                borderBottomColor: colors.border,
              },
            ]}
          >
            <View style={styles.actionCardHeader}>
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    typography.presets.bodySmall,
                    { color: colors.textSecondary, lineHeight: 20 },
                  ]}
                >
                  Triggers the native biometric prompt using{' '}
                  <Text style={{ color: colors.primary, fontWeight: '600' }}>
                    simplePrompt()
                  </Text>
                  . No key required.
                </Text>
              </View>
              <StatusBadge status={authStatus} />
            </View>
            <View style={[styles.btnRow, { marginTop: spacing.md }]}>
              <ActionButton
                label="Authenticate"
                icon="fingerprint"
                onPress={handleSimplePrompt}
                loading={authStatus === 'loading'}
                disabled={!sensorInfo?.available}
              />
            </View>
          </View>
        </View>

        {/* ── AUTH WITH DEVICE CREDENTIAL FALLBACK ──────────────────────── */}
        <View>
          <SectionHeader title="AUTH WITH FALLBACK" />
          <View
            style={[
              styles.actionCard,
              {
                backgroundColor: colors.surface,
                padding: spacing.lg,
                borderBottomWidth: StyleSheet.hairlineWidth,
                borderBottomColor: colors.border,
              },
            ]}
          >
            <View style={styles.actionCardHeader}>
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    typography.presets.bodySmall,
                    { color: colors.textSecondary, lineHeight: 20 },
                  ]}
                >
                  Uses{' '}
                  <Text style={{ color: colors.primary, fontWeight: '600' }}>
                    authenticateWithOptions()
                  </Text>{' '}
                  with{' '}
                  <Text style={{ color: colors.primary, fontWeight: '600' }}>
                    allowDeviceCredentials: true
                  </Text>
                  . Falls back to PIN/password if biometrics fail.
                </Text>
              </View>
              <StatusBadge status={authWithFallbackStatus} />
            </View>
            <View style={[styles.btnRow, { marginTop: spacing.md }]}>
              <ActionButton
                label="Auth + Fallback"
                icon="cellphone-key"
                onPress={handleAuthWithFallback}
                loading={authWithFallbackStatus === 'loading'}
              />
            </View>
          </View>
        </View>

        {/* ── KEY MANAGEMENT ─────────────────────────────────────────────── */}
        <View>
          <SectionHeader title="KEY MANAGEMENT" />
          <InfoRow
            label="Key exists"
            value={keyInfo.exists ? 'Yes' : 'No'}
            valueColor={
              keyInfo.exists ? colors.successMain : colors.textSecondary
            }
            icon="key-outline"
          />
          {keyInfo.exists && (
            <>
              {keyInfo.algorithm && (
                <InfoRow
                  label="Algorithm"
                  value={keyInfo.algorithm}
                  icon="code-braces"
                />
              )}
              {keyInfo.keySize !== undefined && (
                <InfoRow
                  label="Key size"
                  value={`${keyInfo.keySize} bits`}
                  icon="ruler"
                />
              )}
              {keyInfo.isInsideSecureHardware !== undefined && (
                <InfoRow
                  label="Secure hardware"
                  value={
                    keyInfo.isInsideSecureHardware
                      ? 'Yes (StrongBox/SE)'
                      : 'No (TEE)'
                  }
                  valueColor={
                    keyInfo.isInsideSecureHardware
                      ? colors.successMain
                      : colors.warningMain
                  }
                  icon="chip"
                />
              )}
              {keyInfo.userAuthenticationRequired !== undefined && (
                <InfoRow
                  label="Auth required"
                  value={keyInfo.userAuthenticationRequired ? 'Yes' : 'No'}
                  icon="lock-outline"
                />
              )}
            </>
          )}
          <View
            style={[
              styles.actionCard,
              {
                backgroundColor: colors.surface,
                padding: spacing.lg,
                borderBottomWidth: StyleSheet.hairlineWidth,
                borderBottomColor: colors.border,
              },
            ]}
          >
            <View style={styles.btnRow}>
              <ActionButton
                label="Create Key"
                icon="key-plus"
                onPress={handleCreateKey}
                loading={keyLoading}
                disabled={keyInfo.exists}
              />
              <ActionButton
                label="Delete Key"
                icon="key-remove"
                onPress={handleDeleteKey}
                loading={keyLoading}
                disabled={!keyInfo.exists}
                variant="danger"
              />
            </View>
          </View>
        </View>

        {/* ── SIGNATURE VERIFICATION ─────────────────────────────────────── */}
        <View>
          <SectionHeader title="SIGNATURE VERIFICATION" />
          <View
            style={[
              styles.actionCard,
              {
                backgroundColor: colors.surface,
                padding: spacing.lg,
                borderBottomWidth: StyleSheet.hairlineWidth,
                borderBottomColor: colors.border,
              },
            ]}
          >
            <View style={styles.actionCardHeader}>
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    typography.presets.bodySmall,
                    { color: colors.textSecondary, lineHeight: 20 },
                  ]}
                >
                  Uses{' '}
                  <Text style={{ color: colors.primary, fontWeight: '600' }}>
                    verifyKeySignature()
                  </Text>{' '}
                  to sign a payload with the biometric-bound private key.
                  Requires a key to exist first.
                </Text>
              </View>
              <StatusBadge status={sigStatus} />
            </View>
            <View style={[styles.btnRow, { marginTop: spacing.md }]}>
              <ActionButton
                label="Sign Payload"
                icon="pen"
                onPress={handleVerifySignature}
                loading={sigStatus === 'loading'}
                disabled={!keyInfo.exists || !sensorInfo?.available}
              />
            </View>
          </View>
        </View>

        {/* ── SHA-256 HASHING ────────────────────────────────────────────── */}
        <View>
          <SectionHeader title="NATIVE SHA-256 HASHING" />
          <View
            style={[
              styles.actionCard,
              {
                backgroundColor: colors.surface,
                padding: spacing.lg,
                borderBottomWidth: StyleSheet.hairlineWidth,
                borderBottomColor: colors.border,
              },
            ]}
          >
            <Text
              style={[
                typography.presets.bodySmall,
                { color: colors.textSecondary, lineHeight: 20 },
              ]}
            >
              Computes a SHA-256 hash using the platform-native implementation
              via{' '}
              <Text style={{ color: colors.primary, fontWeight: '600' }}>
                sha256()
              </Text>
              .
            </Text>
            {hashResult && (
              <View
                style={[
                  styles.hashBox,
                  {
                    backgroundColor: colors.surfaceElevated,
                    borderColor: colors.border,
                    borderRadius: spacing.xs,
                    padding: spacing.sm,
                    marginTop: spacing.sm,
                  },
                ]}
              >
                <Text
                  style={[
                    typography.presets.caption,
                    {
                      color: colors.successMain,
                      fontFamily: 'monospace',
                      letterSpacing: 0.5,
                    },
                  ]}
                  numberOfLines={2}
                >
                  {hashResult}
                </Text>
              </View>
            )}
            <View style={[styles.btnRow, { marginTop: spacing.md }]}>
              <ActionButton
                label="Compute Hash"
                icon="pound"
                onPress={handleHash}
              />
            </View>
          </View>
        </View>

        {/* ── BIOMETRIC CHANGE DETECTION ─────────────────────────────────── */}
        <View>
          <SectionHeader title="CHANGE DETECTION" />

          {/* Status row */}
          <InfoRow
            label="Detection status"
            value={isDetecting ? 'Active — monitoring' : 'Inactive'}
            valueColor={isDetecting ? colors.successMain : colors.textSecondary}
            icon={isDetecting ? 'radar' : 'radar'}
          />
          <InfoRow
            label="Events captured"
            value={String(changeHistory.length)}
            icon="bell-ring-outline"
          />

          {/* Controls */}
          <View
            style={[
              styles.actionCard,
              {
                backgroundColor: colors.surface,
                padding: spacing.lg,
                borderBottomWidth: StyleSheet.hairlineWidth,
                borderBottomColor: colors.border,
              },
            ]}
          >
            <Text
              style={[
                typography.presets.bodySmall,
                {
                  color: colors.textSecondary,
                  lineHeight: 20,
                  marginBottom: spacing.md,
                },
              ]}
            >
              Uses{' '}
              <Text style={{ color: colors.primary, fontWeight: '600' }}>
                subscribeToBiometricChanges()
              </Text>{' '}
              +{' '}
              <Text style={{ color: colors.primary, fontWeight: '600' }}>
                startBiometricChangeDetection()
              </Text>
              . Fires when enrollments are added, removed, or hardware changes.
              Go to device Settings and add/remove a fingerprint or Face ID to
              trigger an event.
            </Text>
            <View style={styles.btnRow}>
              <ActionButton
                label="Start Detection"
                icon="play-circle-outline"
                onPress={handleStartDetection}
                loading={detectionLoading && !isDetecting}
                disabled={isDetecting}
              />
              <ActionButton
                label="Stop"
                icon="stop-circle-outline"
                onPress={handleStopDetection}
                loading={detectionLoading && isDetecting}
                disabled={!isDetecting}
                variant="danger"
              />
            </View>
          </View>

          {/* Change event history */}
          {changeHistory.length > 0 && (
            <View
              style={[
                styles.changeList,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  marginHorizontal: spacing.lg,
                  marginTop: spacing.sm,
                  borderRadius: spacing.xs,
                },
              ]}
            >
              {changeHistory.map((record, index) => {
                const isLast = index === changeHistory.length - 1;
                const changeColor =
                  record.changeType === 'BIOMETRIC_DISABLED'
                    ? colors.errorMain
                    : record.changeType === 'ENROLLMENT_CHANGED'
                    ? colors.warningMain
                    : colors.successMain;
                const changeIcon =
                  record.changeType === 'BIOMETRIC_DISABLED'
                    ? 'close-circle-outline'
                    : record.changeType === 'ENROLLMENT_CHANGED'
                    ? 'account-edit-outline'
                    : record.changeType === 'BIOMETRIC_ENABLED'
                    ? 'check-circle-outline'
                    : 'information-outline';

                return (
                  <View
                    key={record.id}
                    style={[
                      styles.changeRow,
                      {
                        paddingHorizontal: spacing.md,
                        paddingVertical: spacing.sm,
                        borderBottomWidth: isLast
                          ? 0
                          : StyleSheet.hairlineWidth,
                        borderBottomColor: colors.border,
                      },
                    ]}
                  >
                    <Icon
                      name={changeIcon as any}
                      size={16}
                      color={changeColor}
                      style={{ marginTop: 1 }}
                    />
                    <View style={{ flex: 1, marginLeft: spacing.sm }}>
                      <View style={styles.changeRowHeader}>
                        <View
                          style={[
                            styles.changeTypePill,
                            {
                              backgroundColor: changeColor + '22',
                              paddingHorizontal: spacing.xs,
                              paddingVertical: 2,
                              borderRadius: 4,
                            },
                          ]}
                        >
                          <Text
                            style={[
                              typography.presets.caption,
                              {
                                color: changeColor,
                                fontWeight: '700',
                                fontSize: 10,
                              },
                            ]}
                          >
                            {record.changeType}
                          </Text>
                        </View>
                        <Text
                          style={[
                            typography.presets.caption,
                            {
                              color: colors.textTertiary,
                              marginLeft: spacing.xs,
                            },
                          ]}
                        >
                          {record.timestamp}
                        </Text>
                      </View>
                      <View style={[styles.changeRowMeta, { marginTop: 4 }]}>
                        <Text
                          style={[
                            typography.presets.caption,
                            { color: colors.textSecondary },
                          ]}
                        >
                          {record.biometryType}
                        </Text>
                        <View style={styles.changeRowDots}>
                          <View
                            style={[
                              styles.dot,
                              {
                                backgroundColor: record.available
                                  ? colors.successMain
                                  : colors.errorMain,
                              },
                            ]}
                          />
                          <Text
                            style={[
                              typography.presets.caption,
                              { color: colors.textTertiary, marginLeft: 4 },
                            ]}
                          >
                            {record.available ? 'available' : 'unavailable'}
                          </Text>
                          <View
                            style={[
                              styles.dot,
                              {
                                backgroundColor: record.enrolled
                                  ? colors.successMain
                                  : colors.errorMain,
                                marginLeft: spacing.sm,
                              },
                            ]}
                          />
                          <Text
                            style={[
                              typography.presets.caption,
                              { color: colors.textTertiary, marginLeft: 4 },
                            ]}
                          >
                            {record.enrolled ? 'enrolled' : 'not enrolled'}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        {/* ── ACTIVITY LOG ───────────────────────────────────────────────── */}
        <View>
          <SectionHeader title="ACTIVITY LOG" />
          <View
            style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.sm }}
          >
            <LogPanel entries={logs} />
          </View>
        </View>

        {/* ── HOW IT WORKS ───────────────────────────────────────────────── */}
        <View>
          <SectionHeader title="HOW IT WORKS" />
          <InfoRow
            multiline
            label="isSensorAvailable()"
            value="Checks if the device has a biometric sensor enrolled and available"
          />
          <InfoRow
            multiline
            label="simplePrompt(message)"
            value="Shows the native biometric dialog. Returns true on success, false on cancel"
          />
          <InfoRow
            multiline
            label="authenticateWithOptions(opts)"
            value="Full-featured auth with custom prompt text, cancel label, and device credential fallback"
          />
          <InfoRow
            multiline
            label="createKeys(alias, type)"
            value="Generates an EC256 or RSA2048 key pair stored in the device Secure Enclave / StrongBox"
          />
          <InfoRow
            multiline
            label="validateKeyIntegrity()"
            value="Checks whether the biometric key exists and has not been invalidated by enrollment changes"
          />
          <InfoRow
            multiline
            label="verifyKeySignature(opts)"
            value="Signs a payload with the private key after biometric auth — used for server-side verification"
          />
          <InfoRow
            multiline
            label="deleteKeys(alias)"
            value="Permanently removes the biometric key pair from the secure store"
          />
          <InfoRow
            multiline
            label="sha256(input)"
            value="Computes a SHA-256 hash using the platform-native crypto implementation"
          />
          <InfoRow
            multiline
            label="subscribeToBiometricChanges(cb)"
            value="Registers a callback that fires whenever biometric enrollment or hardware state changes"
          />
          <InfoRow
            multiline
            label="startBiometricChangeDetection()"
            value="Begins active monitoring. iOS uses evaluatedPolicyDomainState; Android uses BiometricManager + KeyStore key count"
          />
          <InfoRow
            multiline
            label="stopBiometricChangeDetection()"
            value="Stops monitoring and releases native resources. Always call on unmount"
          />
        </View>

        {/* ── PLATFORM NOTES ─────────────────────────────────────────────── */}
        <View>
          <SectionHeader title="PLATFORM NOTES" />
          <InfoRow
            multiline
            label="iOS — Face ID"
            value="Requires NSFaceIDUsageDescription in Info.plist. Uses Secure Enclave for key storage"
          />
          <InfoRow
            multiline
            label="iOS — Touch ID"
            value="Uses the Keychain with kSecAttrAccessibleWhenPasscodeSetThisDeviceOnly"
          />
          <InfoRow
            multiline
            label="Android — Fingerprint"
            value="Uses BiometricPrompt API (API 28+). Keys stored in StrongBox or TEE"
          />
          <InfoRow
            multiline
            label="Android — Permissions"
            value="USE_BIOMETRIC + USE_FINGERPRINT required in AndroidManifest.xml"
          />
          <InfoRow
            multiline
            label="Key invalidation"
            value="Adding or removing biometric enrollments invalidates existing keys — handle gracefully"
            valueColor={colors.warningMain}
          />
        </View>

        {/* ── SECURITY NOTES ─────────────────────────────────────────────── */}
        <View>
          <SectionHeader title="SECURITY NOTES" />
          <InfoRow
            multiline
            label="Biometrics alone"
            value="Not a replacement for server-side auth — use as a second factor or local gate"
            valueColor={colors.warningMain}
          />
          <InfoRow
            multiline
            label="Key-based flow"
            value="Create key on enrolment, sign a server challenge on login — verify signature server-side"
            valueColor={colors.successMain}
          />
          <InfoRow
            multiline
            label="Jailbroken devices"
            value="Biometric checks can be bypassed on compromised devices — combine with integrity checks"
            valueColor={colors.errorMain}
          />
          <InfoRow
            multiline
            label="Fallback risk"
            value="Allowing device credentials widens the attack surface — use only when UX demands it"
            valueColor={colors.warningMain}
          />
          <InfoRow
            multiline
            label="Library"
            value="@sbaiahmed1/react-native-biometrics — functional API, TurboModule-ready, Swift + Kotlin"
            valueColor={colors.primary}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
  },
  loaderRow: {
    alignItems: 'center',
  },
  actionCard: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  actionCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  logPanel: {
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  logEmpty: {
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
  },
  logRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  hashBox: {
    borderWidth: StyleSheet.hairlineWidth,
  },
  changeList: {
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  changeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  changeRowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeTypePill: {
    alignSelf: 'flex-start',
  },
  changeRowMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
  },
  changeRowDots: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
