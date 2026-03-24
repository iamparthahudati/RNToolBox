import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { theme } from '../../theme';

type HeaderProps = {
  title: string;
};

const Header = ({ title }: HeaderProps) => {
  const navigation = useNavigation();
  const canGoBack = navigation.canGoBack();

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        {canGoBack && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.backArrow}>{'‹'}</Text>
            <Text style={styles.backLabel}>Back</Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>

      {/* Right placeholder keeps title centered */}
      <View style={styles.right} />
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  left: {
    flex: 1,
    alignItems: 'flex-start',
  },
  right: {
    flex: 1,
  },
  title: {
    fontSize: theme.typography.sizes.md,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    textAlign: 'center',
    flexShrink: 1,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backArrow: {
    fontSize: 28,
    lineHeight: 30,
    color: theme.colors.primary,
    fontWeight: '300',
    marginRight: 2,
  },
  backLabel: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.primary,
    fontWeight: '500',
  },
});
