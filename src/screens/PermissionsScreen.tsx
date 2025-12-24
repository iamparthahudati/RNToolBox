import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Button from '../components/Button';
import { theme } from '../theme';
import {
  checkPermission,
  requestPermission,
  openAppSettings,
  PermissionStatus,
} from '../services/permissions';

type PermissionType = 'camera' | 'location' | 'notification';

const PermissionItem = ({
  title,
  type,
}: {
  title: string;
  type: PermissionType;
}) => {
  const [status, setStatus] = useState<PermissionStatus>('denied');

  const loadStatus = async () => {
    const result = await checkPermission(type);
    setStatus(result);
  };

  useEffect(() => {
    loadStatus();
  }, []);

  const handleRequest = async () => {
    const result = await requestPermission(type);
    setStatus(result);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.permissionTitle}>{title}</Text>
      <Text style={styles.status}>Status: {status}</Text>

      {status === 'blocked' ? (
        <Button
          title="Open Settings"
          variant="outline"
          onPress={openAppSettings}
        />
      ) : (
        <Button
          title="Request Permission"
          onPress={handleRequest}
        />
      )}
    </View>
  );
};

const PermissionsScreen = () => {
  return (
    <View style={styles.container}>
      <PermissionItem title="Camera Permission" type="camera" />
      <PermissionItem title="Location Permission" type="location" />
      <PermissionItem title="Notification Permission" type="notification" />
    </View>
  );
};

export default PermissionsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
  },
  card: {
    padding: theme.spacing.lg,
    borderRadius: 8,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.lg,
  },
  permissionTitle: {
    fontSize: theme.typography.sizes.md,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
    color: theme.colors.textPrimary,
  },
  status: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
});
