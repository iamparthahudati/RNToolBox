import {
  ActivityIndicator,
  Animated,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import Badge from '../../components/atoms/Badge';
import Button from '../../components/atoms/Button';
import Header from '../../components/atoms/Header';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../theme';

// ---------------------------------------------------------------------------
// Skeleton shimmer hook — shared across all skeleton variants
// ---------------------------------------------------------------------------
function useShimmer(): Animated.Value {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1.0,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, [opacity]);

  return opacity;
}

// ---------------------------------------------------------------------------
// Skeleton primitives
// ---------------------------------------------------------------------------
const SkeletonBox: React.FC<{
  width: number | string;
  height: number;
  borderRadius?: number;
  opacity: Animated.Value;
}> = ({ width, height, borderRadius = 6, opacity }) => (
  <Animated.View
    style={[
      styles.skeletonBox,
      { width: width as number, height, borderRadius, opacity },
    ]}
  />
);

// ---------------------------------------------------------------------------
// Section: Spinners
// ---------------------------------------------------------------------------
const SpinnersSection: React.FC = () => (
  <View>
    <Text style={[styles.sectionTitle, styles.firstSection]}>Spinners</Text>
    <View style={styles.card}>
      <Text style={styles.cardLabel}>Size Variants</Text>
      <View style={styles.row}>
        <View style={styles.centeredItem}>
          <ActivityIndicator size="small" color={theme.colors.primary600} />
          <Text style={styles.hint}>small</Text>
        </View>
        <View style={styles.centeredItem}>
          <ActivityIndicator size="large" color={theme.colors.primary600} />
          <Text style={styles.hint}>large</Text>
        </View>
      </View>

      <Text style={[styles.cardLabel, { marginTop: theme.spacing.md }]}>
        Color Variants
      </Text>
      <View style={styles.row}>
        <View style={styles.centeredItem}>
          <ActivityIndicator size="large" color={theme.colors.primary600} />
          <Text style={styles.hint}>primary</Text>
        </View>
        <View style={styles.centeredItem}>
          <ActivityIndicator size="large" color={theme.colors.successMain} />
          <Text style={styles.hint}>success</Text>
        </View>
        <View style={styles.centeredItem}>
          <ActivityIndicator size="large" color={theme.colors.errorMain} />
          <Text style={styles.hint}>error</Text>
        </View>
      </View>
    </View>
  </View>
);

// ---------------------------------------------------------------------------
// Section: Skeleton Screens
// ---------------------------------------------------------------------------
const SkeletonSection: React.FC = () => {
  const opacity = useShimmer();

  return (
    <View>
      <Text style={styles.sectionTitle}>Skeleton Screens</Text>

      {/* List item skeleton */}
      <Text style={styles.variantLabel}>List Item</Text>
      <View style={styles.card}>
        <View style={styles.skeletonListRow}>
          <SkeletonBox
            width={44}
            height={44}
            borderRadius={22}
            opacity={opacity}
          />
          <View style={styles.skeletonLines}>
            <SkeletonBox width="85%" height={14} opacity={opacity} />
            <SkeletonBox width="60%" height={12} opacity={opacity} />
          </View>
        </View>
      </View>

      {/* Card skeleton */}
      <Text style={styles.variantLabel}>Card</Text>
      <View style={styles.card}>
        <SkeletonBox
          width="100%"
          height={120}
          borderRadius={8}
          opacity={opacity}
        />
        <View style={{ marginTop: theme.spacing.sm }}>
          <SkeletonBox width="75%" height={14} opacity={opacity} />
          <View style={{ height: theme.spacing.xs }} />
          <SkeletonBox width="50%" height={12} opacity={opacity} />
        </View>
      </View>

      {/* Text block skeleton */}
      <Text style={styles.variantLabel}>Text Block</Text>
      <View style={styles.card}>
        <SkeletonBox width="100%" height={13} opacity={opacity} />
        <View style={{ height: theme.spacing.xs }} />
        <SkeletonBox width="85%" height={13} opacity={opacity} />
        <View style={{ height: theme.spacing.xs }} />
        <SkeletonBox width="60%" height={13} opacity={opacity} />
      </View>
    </View>
  );
};

// ---------------------------------------------------------------------------
// Section: Progress Bar
// ---------------------------------------------------------------------------
const ProgressBarSection: React.FC = () => {
  const progress = useRef(new Animated.Value(0)).current;
  const [displayPct, setDisplayPct] = useState(0);
  const listenerRef = useRef<string | null>(null);

  const startAnimation = useCallback(() => {
    progress.setValue(0);
    setDisplayPct(0);

    if (listenerRef.current !== null) {
      progress.removeListener(listenerRef.current);
    }
    listenerRef.current = progress.addListener(({ value }) => {
      setDisplayPct(Math.round(value * 100));
    });

    Animated.timing(progress, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  useEffect(() => {
    startAnimation();
    return () => {
      if (listenerRef.current !== null) {
        progress.removeListener(listenerRef.current);
      }
    };
  }, [startAnimation, progress]);

  const barWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View>
      <Text style={styles.sectionTitle}>Progress Bar</Text>
      <View style={styles.card}>
        <View style={styles.progressHeader}>
          <Text style={styles.cardLabel}>Loading assets...</Text>
          <Text style={styles.progressPct}>{displayPct}%</Text>
        </View>
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, { width: barWidth }]} />
        </View>
        <View style={styles.restartButton}>
          <Button title="Restart" variant="outline" onPress={startAnimation} />
        </View>
      </View>
    </View>
  );
};

// ---------------------------------------------------------------------------
// Section: Pulse Loader
// ---------------------------------------------------------------------------
const PulseSection: React.FC = () => {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scale, {
            toValue: 1.3,
            duration: 700,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0.4,
            duration: 700,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(scale, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
          }),
        ]),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, [scale, opacity]);

  return (
    <View>
      <Text style={styles.sectionTitle}>Pulse Loader</Text>
      <View style={[styles.card, styles.centeredCard]}>
        <Animated.View
          style={[styles.pulseCircle, { transform: [{ scale }], opacity }]}
        />
        <Text style={[styles.hint, { marginTop: theme.spacing.sm }]}>
          Syncing data...
        </Text>
      </View>
    </View>
  );
};

// ---------------------------------------------------------------------------
// Section: Overlay Loader
// ---------------------------------------------------------------------------
const OverlaySection: React.FC = () => {
  const [visible, setVisible] = useState(false);

  const handlePress = () => {
    setVisible(true);
    setTimeout(() => setVisible(false), 2000);
  };

  return (
    <View>
      <Text style={styles.sectionTitle}>Overlay Loader</Text>
      <View style={styles.card}>
        <Text style={styles.cardLabel}>
          Tap the button to show a full-screen loading overlay for 2 seconds.
        </Text>
        <View style={{ marginTop: theme.spacing.md }}>
          <Button
            title="Show Overlay"
            variant="primary"
            onPress={handlePress}
          />
        </View>
      </View>

      <Modal
        transparent
        animationType="fade"
        visible={visible}
        statusBarTranslucent
      >
        <View style={styles.overlayBackdrop}>
          <View style={styles.overlayCard}>
            <ActivityIndicator size="large" color={theme.colors.primary600} />
            <Text style={styles.overlayText}>Loading...</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// ---------------------------------------------------------------------------
// Section: Skeleton Toggle
// ---------------------------------------------------------------------------
const SkeletonToggleSection: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const opacity = useShimmer();

  return (
    <View>
      <Text style={styles.sectionTitle}>Skeleton Toggle</Text>
      <View style={styles.card}>
        <View style={styles.toggleRow}>
          <Text style={styles.cardLabel}>Show skeleton</Text>
          <Switch
            value={isLoading}
            onValueChange={setIsLoading}
            trackColor={{
              false: theme.colors.light.border,
              true: theme.colors.primary600,
            }}
            thumbColor={theme.colors.white}
          />
        </View>

        <View style={{ marginTop: theme.spacing.md }}>
          {isLoading ? (
            <View>
              <View style={styles.skeletonListRow}>
                <SkeletonBox
                  width={48}
                  height={48}
                  borderRadius={8}
                  opacity={opacity}
                />
                <View style={styles.skeletonLines}>
                  <SkeletonBox width="70%" height={14} opacity={opacity} />
                  <SkeletonBox width="45%" height={12} opacity={opacity} />
                  <SkeletonBox
                    width={60}
                    height={20}
                    borderRadius={10}
                    opacity={opacity}
                  />
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.realContentCard}>
              <View style={styles.realContentIcon}>
                <Text style={styles.realContentIconText}>RN</Text>
              </View>
              <View style={styles.realContentBody}>
                <Text style={styles.realContentTitle}>React Native</Text>
                <Text style={styles.realContentSubtitle}>
                  Cross-platform mobile framework
                </Text>
                <View style={{ marginTop: theme.spacing.xs }}>
                  <Badge label="New" variant="new" showDot />
                </View>
              </View>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

// ---------------------------------------------------------------------------
// Root screen
// ---------------------------------------------------------------------------
const LoadingScreen: React.FC = () => (
  <SafeAreaView style={styles.root}>
    <Header title="Loading States" />
    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <SpinnersSection />
      <SkeletonSection />
      <ProgressBarSection />
      <PulseSection />
      <OverlaySection />
      <SkeletonToggleSection />
    </ScrollView>
  </SafeAreaView>
);

export default LoadingScreen;

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.light.background,
  },
  content: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },

  // Section titles
  sectionTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: '700',
    color: theme.colors.light.textPrimary,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  firstSection: {
    marginTop: 0,
  },

  // Card container
  card: {
    backgroundColor: theme.colors.light.surface,
    borderRadius: 12,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.light.border,
  },
  centeredCard: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  cardLabel: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: '600',
    color: theme.colors.light.textSecondary,
    marginBottom: theme.spacing.sm,
  },

  // Row / layout helpers
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xl,
  },
  centeredItem: {
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  hint: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.light.textSecondary,
  },

  // Skeleton
  variantLabel: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: '600',
    color: theme.colors.light.textSecondary,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  skeletonBox: {
    backgroundColor: theme.colors.light.border,
  },
  skeletonListRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  skeletonLines: {
    flex: 1,
    gap: theme.spacing.xs,
  },

  // Progress bar
  restartButton: {
    marginTop: theme.spacing.md,
    alignSelf: 'flex-start',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  progressPct: {
    fontSize: theme.typography.sizes.md,
    fontWeight: '700',
    color: theme.colors.primary600,
  },
  progressTrack: {
    height: 10,
    backgroundColor: theme.colors.light.border,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary600,
    borderRadius: 5,
  },

  // Pulse
  pulseCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.primary600,
  },

  // Overlay
  overlayBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    padding: theme.spacing.xxl,
    alignItems: 'center',
    gap: theme.spacing.md,
    minWidth: 160,
  },
  overlayText: {
    fontSize: theme.typography.sizes.md,
    fontWeight: '600',
    color: theme.colors.light.textPrimary,
  },

  // Toggle row
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  // Real content card (skeleton toggle revealed state)
  realContentCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.md,
  },
  realContentIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: theme.colors.primary600,
    justifyContent: 'center',
    alignItems: 'center',
  },
  realContentIconText: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: '700',
    color: theme.colors.white,
  },
  realContentBody: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  realContentTitle: {
    fontSize: theme.typography.sizes.md,
    fontWeight: '700',
    color: theme.colors.light.textPrimary,
  },
  realContentSubtitle: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.light.textSecondary,
  },
});
