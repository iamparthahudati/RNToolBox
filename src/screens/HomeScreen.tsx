import Icon from '@react-native-vector-icons/material-design-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { SafeAreaView } from 'react-native-safe-area-context';
import Badge from '../components/atoms/Badge';
import SectionHeader from '../components/molecules/SectionHeader';
import { RootStackParamList } from '../navigation/types';
import { useTheme } from '../theme';
import { MenuItem } from '../types/menu';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const MENU_ITEMS: MenuItem[] = [
  {
    title: 'UI Components',
    description: 'Buttons, inputs, selection, lists, images',
    screen: 'Components',
    implemented: true,
    icon: 'palette-outline',
  },
  {
    title: 'Native Actions',
    description: 'Call, email, maps, share, camera, haptics',
    screen: 'NativeActions',
    implemented: true,
    icon: 'cellphone',
  },
  {
    title: 'Permissions',
    description: 'Camera, location, microphone, contacts',
    screen: 'Permissions',
    implemented: true,
    icon: 'shield-check-outline',
  },
  {
    title: 'Hooks & Utilities',
    description: 'Custom hooks and helpers',
    screen: 'Hooks',
    implemented: true,
    icon: 'hook',
  },
  {
    title: 'System & Device',
    description: 'Device info, network, dark mode, localization',
    screen: 'System',
    implemented: true,
    icon: 'monitor-cellphone',
  },
  {
    title: 'Forms',
    description: 'Validation, React Hook Form, date picker, search',
    screen: 'Forms',
    implemented: false,
    icon: 'form-select',
  },
  {
    title: 'Animations',
    description: 'Animated API, Reanimated, gestures, Lottie',
    screen: 'Animations',
    implemented: false,
    icon: 'animation-play-outline',
  },
  {
    title: 'Navigation Patterns',
    description: 'Tabs, drawer, modal stack, deep linking, auth flow',
    screen: 'NavigationPatterns',
    implemented: false,
    icon: 'compass-outline',
  },
  {
    title: 'Storage',
    description: 'AsyncStorage, MMKV, secure storage, SQLite',
    screen: 'Storage',
    implemented: false,
    icon: 'database-outline',
  },
  {
    title: 'Authentication',
    description: 'Firebase Auth — email, Google, Apple sign-in',
    screen: 'Auth',
    implemented: false,
    icon: 'lock-outline',
  },
  {
    title: 'Networking',
    description: 'Fetch, Axios, interceptors, offline, WebSocket',
    screen: 'Networking',
    implemented: false,
    icon: 'wifi',
  },
  {
    title: 'Testing',
    description: 'Unit, component and E2E test patterns',
    screen: 'Testing',
    implemented: false,
    icon: 'test-tube',
  },
  {
    title: 'Code Refactoring',
    description: 'Folder structure, hooks, services, types, performance',
    screen: 'Refactoring',
    implemented: false,
    icon: 'wrench-outline',
  },
];

const IMPLEMENTED_COUNT = MENU_ITEMS.filter(i => i.implemented).length;
const TOTAL_COUNT = MENU_ITEMS.length;

// ---------------------------------------------------------------------------
// GridCard
// ---------------------------------------------------------------------------

interface GridCardProps {
  item: MenuItem;
  onPress: () => void;
}

const GridCard = ({ item, onPress }: GridCardProps) => {
  const { colors, spacing, typography, shadows, isDark } = useTheme();
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 30,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 6,
    }).start();
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={{ flex: 1, marginVertical: spacing.sm }}
    >
      <Animated.View
        style={{
          transform: [{ scale }],
          flex: 1,
          padding: spacing.md,
          borderRadius: spacing.radii.lg,
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
          alignItems: 'center',
          minHeight: 140,
          justifyContent: 'space-between',
          ...shadows.sm,
        }}
      >
        {/* Icon circle */}
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: isDark ? colors.primary900 : colors.primary50,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: spacing.sm,
          }}
        >
          <Icon name={item.icon as any} size={24} color={colors.primary} />
        </View>

        {/* Title */}
        <Text
          style={{
            ...typography.presets.label,
            color: colors.textPrimary,
            marginTop: spacing.sm,
            textAlign: 'center',
          }}
          numberOfLines={2}
        >
          {item.title}
        </Text>

        {/* Description */}
        <Text
          style={{
            ...typography.presets.caption,
            color: colors.textSecondary,
            textAlign: 'center',
            marginTop: 2,
            flexGrow: 1,
          }}
          numberOfLines={2}
        >
          {item.description}
        </Text>

        {/* Status indicator */}
        <View style={{ marginTop: spacing.sm, alignItems: 'center' }}>
          {item.implemented ? (
            <View
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: colors.successMain,
              }}
            />
          ) : (
            <Badge label="Soon" variant="comingSoon" />
          )}
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

// ---------------------------------------------------------------------------
// HomeScreen
// ---------------------------------------------------------------------------

const HomeScreen = ({ navigation }: Props) => {
  const { colors, spacing, typography } = useTheme();
  const [query, setQuery] = useState('');

  const filtered = query.trim()
    ? MENU_ITEMS.filter(
        item =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase()),
      )
    : MENU_ITEMS;

  const handleItemPress = (item: MenuItem) => {
    navigation.navigate(item.screen as any, item.params as any);
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
      edges={['top', 'left', 'right']}
    >
      {/* ------------------------------------------------------------------ */}
      {/* HEADER                                                               */}
      {/* ------------------------------------------------------------------ */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.xl,
          paddingBottom: spacing.md,
        }}
      >
        <View style={{ flex: 1 }}>
          <Text
            style={{
              ...typography.presets.h1,
              color: colors.textPrimary,
            }}
          >
            RNToolBox
          </Text>
          <Text
            style={{
              ...typography.presets.bodySmall,
              color: colors.textSecondary,
              marginTop: 2,
            }}
          >
            React Native Developer Toolkit
          </Text>
        </View>
        <Badge label={`v${DeviceInfo.getVersion()}`} variant="pro" />
      </View>

      {/* ------------------------------------------------------------------ */}
      {/* SEARCH BAR                                                           */}
      {/* ------------------------------------------------------------------ */}
      <View
        style={{
          paddingHorizontal: spacing.lg,
          paddingBottom: spacing.md,
          paddingTop: spacing.sm,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.surface,
            borderRadius: spacing.radii.xl,
            borderWidth: 1,
            borderColor: colors.border,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm,
          }}
        >
          <Icon
            name={'magnify' as any}
            size={20}
            color={colors.textTertiary}
            style={{ marginRight: spacing.sm }}
          />
          <TextInput
            style={{
              flex: 1,
              ...typography.presets.body,
              color: colors.textPrimary,
              padding: 0,
              margin: 0,
            }}
            placeholder="Search features..."
            placeholderTextColor={colors.textTertiary}
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
            clearButtonMode="never"
            autoCorrect={false}
            autoCapitalize="none"
          />
          {query.length > 0 && (
            <TouchableOpacity
              onPress={() => setQuery('')}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Icon
                name={'close-circle' as any}
                size={18}
                color={colors.textTertiary}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* ------------------------------------------------------------------ */}
      {/* STATS ROW                                                            */}
      {/* ------------------------------------------------------------------ */}
      <View
        style={{
          paddingHorizontal: spacing.lg,
          paddingBottom: spacing.sm,
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            ...typography.presets.overline,
            color: colors.textTertiary,
            textAlign: 'center',
          }}
        >
          {`${TOTAL_COUNT} Categories  \u2022  ${IMPLEMENTED_COUNT} Implemented  \u2022  70+ Features`}
        </Text>
      </View>

      {/* ------------------------------------------------------------------ */}
      {/* SECTION LABEL + GRID                                                 */}
      {/* ------------------------------------------------------------------ */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.screen}
        numColumns={2}
        ListHeaderComponent={<SectionHeader title="Categories" />}
        renderItem={({ item }) => (
          <GridCard item={item} onPress={() => handleItemPress(item)} />
        )}
        contentContainerStyle={{
          paddingHorizontal: spacing.md,
          paddingBottom: spacing.xxl,
        }}
        columnWrapperStyle={{
          gap: spacing.sm,
          paddingHorizontal: spacing.sm,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      />
    </SafeAreaView>
  );
};

export default HomeScreen;
