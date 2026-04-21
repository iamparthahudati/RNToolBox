import Icon from '@react-native-vector-icons/material-design-icons';
import {
  BiometricStrength,
  authenticateWithOptions,
  createKeys,
  deleteKeys,
  getKeyAttributes,
  isSensorAvailable,
  simplePrompt,
  startBiometricChangeDetection,
  stopBiometricChangeDetection,
  subscribeToBiometricChanges,
  unsubscribeFromBiometricChanges,
  verifyKeySignature,
  type BiometricChangeEvent,
} from '@sbaiahmed1/react-native-biometrics';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  AppState,
  AppStateStatus,
  EventSubscription,
  Modal,
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

// ─── Constants ────────────────────────────────────────────────────────────────

const KEY_ALIAS = 'rntoolbox_biometric_key';

// ─── Pure-JS SHA-256 (Hermes-compatible) ──────────────────────────────────────

function sha256(message: string): string {
  const K = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1,
    0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
    0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786,
    0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147,
    0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
    0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b,
    0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a,
    0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
    0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
  ];
  const H = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c,
    0x1f83d9ab, 0x5be0cd19,
  ];
  const rotr = (x: number, n: number) => (x >>> n) | (x << (32 - n));
  const bytes: number[] = [];
  for (let i = 0; i < message.length; i++) {
    const c = message.charCodeAt(i);
    if (c < 0x80) {
      bytes.push(c);
    } else if (c < 0x800) {
      bytes.push(0xc0 | (c >> 6), 0x80 | (c & 0x3f));
    } else {
      bytes.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 0x3f), 0x80 | (c & 0x3f));
    }
  }
  const bitLen = bytes.length * 8;
  bytes.push(0x80);
  while (bytes.length % 64 !== 56) {
    bytes.push(0);
  }
  for (let i = 7; i >= 0; i--) {
    bytes.push((bitLen / Math.pow(2, i * 8)) & 0xff);
  }
  for (let i = 0; i < bytes.length; i += 64) {
    const w: number[] = [];
    for (let j = 0; j < 16; j++) {
      w[j] =
        (bytes[i + j * 4] << 24) |
        (bytes[i + j * 4 + 1] << 16) |
        (bytes[i + j * 4 + 2] << 8) |
        bytes[i + j * 4 + 3];
    }
    for (let j = 16; j < 64; j++) {
      const s0 = rotr(w[j - 15], 7) ^ rotr(w[j - 15], 18) ^ (w[j - 15] >>> 3);
      const s1 = rotr(w[j - 2], 17) ^ rotr(w[j - 2], 19) ^ (w[j - 2] >>> 10);
      w[j] = (w[j - 16] + s0 + w[j - 7] + s1) | 0;
    }
    let [a, b, c, d, e, f, g, h] = H;
    for (let j = 0; j < 64; j++) {
      const S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
      const ch = (e & f) ^ (~e & g);
      const temp1 = (h + S1 + ch + K[j] + w[j]) | 0;
      const S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (S0 + maj) | 0;
      h = g;
      g = f;
      f = e;
      e = (d + temp1) | 0;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) | 0;
    }
    H[0] = (H[0] + a) | 0;
    H[1] = (H[1] + b) | 0;
    H[2] = (H[2] + c) | 0;
    H[3] = (H[3] + d) | 0;
    H[4] = (H[4] + e) | 0;
    H[5] = (H[5] + f) | 0;
    H[6] = (H[6] + g) | 0;
    H[7] = (H[7] + h) | 0;
  }
  return H.map(v => (v >>> 0).toString(16).padStart(8, '0')).join('');
}

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

// ─── Action Button ─────────────────────────────────────────────────────────────

interface ActionButtonProps {
  label: string;
  icon: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'danger' | 'outline' | 'warning';
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
      : variant === 'warning'
      ? colors.warningMain
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
            opacity: disabled ? 0.4 : 1,
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

// ─── Re-auth Modal ─────────────────────────────────────────────────────────────

interface ReAuthModalProps {
  visible: boolean;
  biometryType: string;
  onAuthenticate: () => void;
  onDismiss: () => void;
}

const ReAuthModal = ({
  visible,
  biometryType,
  onAuthenticate,
  onDismiss,
}: ReAuthModalProps) => {
  const { colors, spacing, typography } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.modalCard,
            {
              backgroundColor: colors.surface,
              borderRadius: spacing.md,
              padding: spacing.xl,
              margin: spacing.xl,
            },
          ]}
        >
          <View
            style={[
              styles.modalIconWrap,
              {
                backgroundColor: colors.warningLight,
                borderRadius: 40,
                padding: spacing.md,
                marginBottom: spacing.md,
              },
            ]}
          >
            <Icon
              name="shield-alert-outline"
              size={36}
              color={colors.warningMain}
            />
          </View>

          <Text
            style={[
              typography.presets.h3,
              {
                color: colors.textPrimary,
                textAlign: 'center',
                marginBottom: spacing.sm,
              },
            ]}
          >
            Biometrics Changed
          </Text>

          <Text
            style={[
              typography.presets.bodySmall,
              {
                color: colors.textSecondary,
                textAlign: 'center',
                lineHeight: 20,
                marginBottom: spacing.xl,
              },
            ]}
          >
            A new {biometryType} enrollment was detected on this device. Please
            re-authenticate to confirm it is still you.
          </Text>

          <ActionButton
            label="Re-authenticate"
            icon="fingerprint"
            onPress={onAuthenticate}
          />

          <TouchableOpacity
            onPress={onDismiss}
            style={{ marginTop: spacing.md, alignItems: 'center' }}
          >
            <Text
              style={[
                typography.presets.bodySmall,
                { color: colors.textTertiary },
              ]}
            >
              Dismiss
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// ─── Main Screen ───────────────────────────────────────────────────────────────

export default function BiometricsScreen(): React.JSX.Element {
  const { colors, spacing, typography } = useTheme();

  // ── Sensor ─────────────────────────────────────────────────────────────────
  const [sensorInfo, setSensorInfo] = useState<SensorInfo | null>(null);
  const [sensorLoading, setSensorLoading] = useState(true);

  // ── Simple auth ────────────────────────────────────────────────────────────
  const [authStatus, setAuthStatus] = useState<AuthStatus>('idle');
  const [authWithFallbackStatus, setAuthWithFallbackStatus] =
    useState<AuthStatus>('idle');

  // ── Key management ─────────────────────────────────────────────────────────
  const [keyInfo, setKeyInfo] = useState<KeyInfo>({ exists: false });
  const [keyLoading, setKeyLoading] = useState(false);

  // ── Signature ──────────────────────────────────────────────────────────────
  const [sigStatus, setSigStatus] = useState<AuthStatus>('idle');
  const [sigResult, setSigResult] = useState<string | null>(null);

  // ── Hash ───────────────────────────────────────────────────────────────────
  const [hashResult, setHashResult] = useState<string | null>(null);

  // ── Re-auth on biometric change ────────────────────────────────────────────
  const [reAuthVisible, setReAuthVisible] = useState(false);
  const [, setReAuthStatus] = useState<AuthStatus>('idle');
  const detectedBiometryType = useRef<string>('biometric');

  // ── Change detection ───────────────────────────────────────────────────────
  const subscriptionRef = useRef<EventSubscription | null>(null);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);
  const appStateSubRef = useRef<ReturnType<
    typeof AppState.addEventListener
  > | null>(null);

  // ── Logs ───────────────────────────────────────────────────────────────────
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const logIdRef = useRef(0);

  const addLog = useCallback(
    (message: string, type: LogEntry['type'] = 'info') => {
      const now = new Date();
      const timestamp = `${now.getHours().toString().padStart(2, '0')}:${now
        .getMinutes()
        .toString()
        .padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
      setLogs(prev => [
        { id: logIdRef.current++, timestamp, message, type },
        ...prev.slice(0, 29),
      ]);
    },
    [],
  );

  const refreshKeyInfo = useCallback(async () => {
    try {
      // Use getKeyAttributes directly — validateKeyIntegrity internally runs a
      // CryptoObject biometric prompt which fails when the key is not auth-bound
      const attrs = await getKeyAttributes(KEY_ALIAS);
      if (attrs.exists && attrs.attributes) {
        setKeyInfo({
          exists: true,
          algorithm: attrs.attributes.algorithm,
          keySize: attrs.attributes.keySize,
          isInsideSecureHardware: attrs.attributes.hardwareBacked,
          userAuthenticationRequired:
            attrs.attributes.userAuthenticationRequired,
        });
      } else {
        setKeyInfo({ exists: false });
      }
    } catch {
      setKeyInfo({ exists: false });
    }
  }, []);

  // ── Sensor check + key refresh on mount ───────────────────────────────────

  useEffect(() => {
    const init = async () => {
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
      await refreshKeyInfo();
    };
    init();
  }, [addLog, refreshKeyInfo]);

  // ── Biometric change handler ───────────────────────────────────────────────

  const handleBiometricChange = useCallback(
    (event: BiometricChangeEvent) => {
      addLog(
        `Biometric change detected: ${event.changeType} — enrolled: ${event.enrolled}`,
        'warn',
      );
      // Only prompt re-auth if a key is registered and enrollment changed
      if (
        keyInfo.exists &&
        (event.changeType === 'ENROLLMENT_CHANGED' ||
          event.changeType === 'BIOMETRIC_ENABLED' ||
          event.changeType === 'STATE_CHANGED')
      ) {
        detectedBiometryType.current = event.biometryType ?? 'biometric';
        setReAuthVisible(true);
      }
    },
    [addLog, keyInfo.exists],
  );

  // ── Start change detection (auto on mount when key exists) ─────────────────

  const startDetection = useCallback(async () => {
    try {
      if (subscriptionRef.current) {
        return; // already running
      }
      subscriptionRef.current = subscribeToBiometricChanges(
        handleBiometricChange,
      );
      await startBiometricChangeDetection();
      addLog('Biometric change monitoring active', 'info');

      // AppState listener: when app returns from background, force a re-check
      appStateRef.current = AppState.currentState;
      appStateSubRef.current = AppState.addEventListener(
        'change',
        async (nextState: AppStateStatus) => {
          const prev = appStateRef.current;
          appStateRef.current = nextState;
          if (
            (prev === 'background' || prev === 'inactive') &&
            nextState === 'active'
          ) {
            addLog(
              'App foregrounded — checking for biometric changes...',
              'info',
            );
            try {
              await stopBiometricChangeDetection();
              await startBiometricChangeDetection();
            } catch {
              // ignore
            }
          }
        },
      );
    } catch (e: any) {
      addLog(`Change detection error: ${e?.message}`, 'error');
    }
  }, [addLog, handleBiometricChange]);

  const stopDetection = useCallback(async () => {
    appStateSubRef.current?.remove();
    appStateSubRef.current = null;
    if (subscriptionRef.current) {
      unsubscribeFromBiometricChanges(subscriptionRef.current);
      subscriptionRef.current = null;
    }
    await stopBiometricChangeDetection().catch(() => {});
  }, []);

  // Start/stop detection based on whether a key is registered
  useEffect(() => {
    if (keyInfo.exists) {
      startDetection();
    } else {
      stopDetection();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyInfo.exists]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopDetection();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Re-auth prompt ─────────────────────────────────────────────────────────

  const handleReAuthenticate = async () => {
    setReAuthStatus('loading');
    addLog('Re-authenticating after biometric change...', 'info');
    try {
      const result = await simplePrompt('Confirm your identity');
      if (result.success) {
        setReAuthStatus('success');
        setReAuthVisible(false);
        addLog('Re-authentication successful — session confirmed', 'success');
        // Refresh key info after re-auth (key may have been invalidated)
        await refreshKeyInfo();
      } else {
        setReAuthStatus('failed');
        addLog(
          `Re-authentication failed: ${result.error ?? 'cancelled'}`,
          'error',
        );
        Alert.alert(
          'Authentication Failed',
          'Could not verify your identity. Please try again.',
          [{ text: 'OK' }],
        );
      }
    } catch (e: any) {
      setReAuthStatus('failed');
      addLog(`Re-auth error: ${e?.message}`, 'error');
    } finally {
      setReAuthStatus('idle');
    }
  };

  // ── Simple prompt ──────────────────────────────────────────────────────────

  const handleSimplePrompt = async () => {
    setAuthStatus('loading');
    addLog('Triggering simple biometric prompt...', 'info');
    try {
      const result = await simplePrompt('Verify your identity');
      if (result.success) {
        setAuthStatus('success');
        addLog('Simple prompt: authentication successful', 'success');
      } else {
        setAuthStatus('cancelled');
        addLog(`Simple prompt: ${result.error ?? 'user cancelled'}`, 'warn');
      }
    } catch (e: any) {
      setAuthStatus('failed');
      addLog(`Simple prompt error: ${e?.message}`, 'error');
    }
  };

  // ── Auth with fallback ─────────────────────────────────────────────────────

  const handleAuthWithFallback = async () => {
    setAuthWithFallbackStatus('loading');
    addLog('Triggering auth with device credential fallback...', 'info');
    try {
      const result = await authenticateWithOptions({
        title: 'Authenticate to continue',
        cancelLabel: 'Cancel',
        allowDeviceCredentials: true,
      });
      if (result.success) {
        setAuthWithFallbackStatus('success');
        addLog('Auth with fallback: success', 'success');
      } else {
        setAuthWithFallbackStatus('cancelled');
        addLog(
          `Auth with fallback: ${result.error ?? 'user cancelled'}`,
          'warn',
        );
      }
    } catch (e: any) {
      setAuthWithFallbackStatus('failed');
      addLog(`Auth with fallback error: ${e?.message}`, 'error');
    }
  };

  const handleCreateKey = async () => {
    setKeyLoading(true);
    addLog(`Registering biometric key (alias: ${KEY_ALIAS})...`, 'info');
    try {
      // BiometricStrength.Weak works on both emulators (Class 2) and real
      // devices (Class 3). Strong requires hardware-backed Class 3 biometrics
      // which are unavailable on most emulators and causes key creation to fail.
      await createKeys(KEY_ALIAS, 'rsa2048', BiometricStrength.Strong);
      addLog('Key registered — change monitoring started', 'success');
      await refreshKeyInfo();
    } catch (e: any) {
      addLog(`Key registration failed: ${e?.message}`, 'error');
    } finally {
      setKeyLoading(false);
    }
  };

  // ── Delete key ─────────────────────────────────────────────────────────────

  const handleDeleteKey = async () => {
    Alert.alert(
      'Delete Biometric Key',
      'This will remove the registered biometric key and stop change monitoring. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setKeyLoading(true);
            addLog('Deleting biometric key...', 'info');
            try {
              await deleteKeys(KEY_ALIAS);
              addLog('Key deleted — change monitoring stopped', 'warn');
              setSigResult(null);
              await refreshKeyInfo();
            } catch (e: any) {
              addLog(`Key deletion failed: ${e?.message}`, 'error');
            } finally {
              setKeyLoading(false);
            }
          },
        },
      ],
    );
  };

  // ── Sign payload ───────────────────────────────────────────────────────────

  const handleVerifySignature = async () => {
    setSigStatus('loading');
    setSigResult(null);
    addLog('Requesting biometric signature...', 'info');
    try {
      const payload = `rntoolbox-${Date.now()}`;
      const result = await verifyKeySignature(
        KEY_ALIAS,
        payload,
        'Sign to verify identity',
      );
      if (result.success && result.signature) {
        setSigStatus('success');
        setSigResult(result.signature.slice(0, 32) + '...');
        addLog('Payload signed successfully', 'success');
      } else {
        setSigStatus('cancelled');
        addLog(`Signature: ${result.error ?? 'user cancelled'}`, 'warn');
      }
    } catch (e: any) {
      setSigStatus('failed');
      addLog(`Signature error: ${e?.message}`, 'error');
    }
  };

  // ── SHA-256 hash ───────────────────────────────────────────────────────────

  const handleHash = () => {
    addLog('Computing SHA-256 hash...', 'info');
    try {
      const input = `rntoolbox-${Date.now()}`;
      const hash = sha256(input);
      setHashResult(hash);
      addLog(`SHA-256: ${hash.slice(0, 16)}...`, 'success');
    } catch (e: any) {
      addLog(`SHA-256 error: ${e?.message}`, 'error');
    }
  };

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

  const monitoringActive = subscriptionRef.current !== null;

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]}>
      <Header title="Biometrics" />

      {/* ── Re-auth Modal ──────────────────────────────────────────────────── */}
      <ReAuthModal
        visible={reAuthVisible}
        biometryType={detectedBiometryType.current}
        onAuthenticate={handleReAuthenticate}
        onDismiss={() => {
          setReAuthVisible(false);
          addLog('Re-auth dismissed by user', 'warn');
        }}
      />

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

        {/* ── KEY MANAGEMENT ─────────────────────────────────────────────── */}
        <View>
          <SectionHeader title="KEY MANAGEMENT" />
          <InfoRow
            label="Key registered"
            value={keyInfo.exists ? 'Yes' : 'No'}
            valueColor={
              keyInfo.exists ? colors.successMain : colors.textSecondary
            }
            icon="key-outline"
          />
          <InfoRow
            label="Change monitoring"
            value={monitoringActive ? 'Active' : 'Inactive'}
            valueColor={
              monitoringActive ? colors.successMain : colors.textSecondary
            }
            icon="radar"
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
              Register a biometric key to enable change detection. When a new
              fingerprint or face is added to the device, you will be prompted
              to re-authenticate.
            </Text>
            <View style={styles.btnRow}>
              <ActionButton
                label="Register Key"
                icon="key-plus"
                onPress={handleCreateKey}
                loading={keyLoading && !keyInfo.exists}
                disabled={keyInfo.exists}
              />
              <ActionButton
                label="Delete Key"
                icon="key-remove"
                onPress={handleDeleteKey}
                loading={keyLoading && keyInfo.exists}
                disabled={!keyInfo.exists}
                variant="danger"
              />
            </View>
          </View>
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

        {/* ── AUTH WITH FALLBACK ─────────────────────────────────────────── */}
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
                  Signs a payload with the registered private key after
                  biometric auth. Requires a key to be registered first.
                </Text>
              </View>
              <StatusBadge status={sigStatus} />
            </View>
            {sigResult && (
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
                  {sigResult}
                </Text>
              </View>
            )}
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
              Computes a SHA-256 hash using a pure-JS implementation compatible
              with Hermes.
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
            label="Register Key"
            value="Creates an RSA-2048 key pair bound to the device Keystore under a fixed alias. Starts change monitoring automatically."
          />
          <InfoRow
            multiline
            label="Change Detection"
            value="Uses subscribeToBiometricChanges() + AppState listener. When the app returns from background, the native layer compares the current biometric enrollment against the snapshot taken at registration."
          />
          <InfoRow
            multiline
            label="Re-auth Prompt"
            value="When an ENROLLMENT_CHANGED event fires and a key is registered, a modal prompts the user to re-authenticate via simplePrompt()."
          />
          <InfoRow
            multiline
            label="simplePrompt(message)"
            value="Shows the native biometric dialog. Returns { success, error } — no key required."
          />
          <InfoRow
            multiline
            label="authenticateWithOptions(opts)"
            value="Full-featured auth with custom prompt text and device credential fallback."
          />
          <InfoRow
            multiline
            label="verifyKeySignature(alias, data)"
            value="Signs a payload with the private key after biometric auth — used for server-side verification."
          />
          <InfoRow
            multiline
            label="deleteKeys(alias)"
            value="Permanently removes the biometric key pair and stops change monitoring."
          />
        </View>

        {/* ── PLATFORM NOTES ─────────────────────────────────────────────── */}
        <View>
          <SectionHeader title="PLATFORM NOTES" />
          <InfoRow
            multiline
            label="Android — Fingerprint"
            value="Uses BiometricPrompt API (API 28+). Keys stored in StrongBox or TEE. Change detection compares BiometricManager state + KeyStore key count on each foreground."
          />
          <InfoRow
            multiline
            label="iOS — Face ID / Touch ID"
            value="Uses Secure Enclave / Keychain. Change detection uses evaluatedPolicyDomainState which changes on any enrollment modification."
          />
          <InfoRow
            multiline
            label="Key invalidation"
            value="Adding or removing biometric enrollments may invalidate existing keys — always handle gracefully."
            valueColor={colors.warningMain}
          />
          <InfoRow
            multiline
            label="Security note"
            value="Biometrics alone are not a replacement for server-side auth. Use as a second factor or local gate combined with a signed challenge."
            valueColor={colors.warningMain}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { flexGrow: 1 },
  loaderRow: { alignItems: 'center' },
  actionCard: { borderBottomWidth: StyleSheet.hairlineWidth },
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
  hashBox: { borderWidth: StyleSheet.hairlineWidth },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 12,
  },
  modalIconWrap: { alignItems: 'center', justifyContent: 'center' },
});
