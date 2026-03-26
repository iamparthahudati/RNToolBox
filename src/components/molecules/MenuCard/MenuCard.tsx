import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { theme } from '../../../theme';
import Badge from '../../atoms/Badge';
import { styles } from '../../Button/styles';

type MenuCardProps = {
  title: string;
  description: string;
  implemented: boolean;
  onPress: () => void;
};

const MenuCard = ({
  title,
  description,
  implemented,
  onPress,
}: MenuCardProps) => (
  <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.description}>{description}</Text>
    {!implemented && <Badge label="Coming Soon" variant="comingSoon" />}
  </TouchableOpacity>
);

export default MenuCard;

const styles = StyleSheet.create({
  card: {
    padding: theme.spacing.lg,
    borderRadius: 8,
    backgroundColor: theme.colors.surface,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  title: {
    fontSize: theme.typography.sizes.md,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  description: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.textSecondary,
  },
});
