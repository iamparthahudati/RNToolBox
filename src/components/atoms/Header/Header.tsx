import Icon from '@react-native-vector-icons/material-design-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../../theme';

type HeaderProps = {
  title: string;
  rightAction?: React.ReactNode;
  headerRight?: React.ReactNode;
};

const Header = ({ title, rightAction, headerRight }: HeaderProps) => {
  const navigation = useNavigation();
  const { colors, typography, spacing } = useTheme();
  const canGoBack = navigation.canGoBack();

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        height: 56,
        paddingHorizontal: spacing.lg,
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      }}
    >
      <View style={{ flex: 1, alignItems: 'flex-start' }}>
        {canGoBack && (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={{ padding: 2 }}
          >
            <Icon name={'arrow-left' as any} size={24} color={colors.primary} />
          </TouchableOpacity>
        )}
      </View>

      <Text
        numberOfLines={1}
        style={[
          typography.presets.h3,
          {
            color: colors.textPrimary,
            textAlign: 'center',
            flexShrink: 1,
          },
        ]}
      >
        {title}
      </Text>

      <View style={{ flex: 1, alignItems: 'flex-end' }}>
        {rightAction ?? headerRight ?? null}
      </View>
    </View>
  );
};

export default Header;
