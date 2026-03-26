import React, { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/atoms/Header';
import Checkbox from '../../components/molecules/Checkbox';
import RadioGroup from '../../components/molecules/RadioGroup';
import { theme } from '../../theme';

const RADIO_OPTIONS = [
  { id: 'option1', label: 'Option One' },
  { id: 'option2', label: 'Option Two' },
  { id: 'option3', label: 'Option Three' },
];

const SelectionScreen: React.FC = () => {
  const [notif, setNotif] = useState(false);
  const [dark, setDark] = useState(false);
  const [autoUpdate, setAutoUpdate] = useState(false);
  const [selectedRadio, setSelectedRadio] = useState<string>('option1');

  return (
    <SafeAreaView style={styles.root}>
      <Header title="Selection Controls" />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Switch */}
        <Text style={styles.sectionTitle}>Switch</Text>

        <View style={styles.switchRow}>
          <Text style={styles.rowLabel}>Notifications</Text>
          <Switch
            value={notif}
            onValueChange={setNotif}
            trackColor={{
              false: theme.colors.border,
              true: theme.colors.primary,
            }}
            thumbColor={theme.colors.white}
          />
        </View>

        <View style={styles.switchRow}>
          <Text style={styles.rowLabel}>Dark Mode</Text>
          <Switch
            value={dark}
            onValueChange={setDark}
            trackColor={{
              false: theme.colors.border,
              true: theme.colors.primary,
            }}
            thumbColor={theme.colors.white}
          />
        </View>

        <View style={styles.switchRow}>
          <Text style={styles.rowLabel}>Auto Update</Text>
          <Switch
            value={autoUpdate}
            onValueChange={setAutoUpdate}
            trackColor={{
              false: theme.colors.border,
              true: theme.colors.primary,
            }}
            thumbColor={theme.colors.white}
          />
        </View>

        {/* Checkbox */}
        <Text style={styles.sectionTitle}>Checkbox</Text>
        <Checkbox label="Accept Terms" />
        <Checkbox label="Subscribe to newsletter" />
        <Checkbox label="Remember me" />

        {/* Radio */}
        <Text style={styles.sectionTitle}>Radio</Text>
        <RadioGroup
          options={RADIO_OPTIONS}
          selected={selectedRadio}
          onSelect={setSelectedRadio}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default SelectionScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.lg,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  rowLabel: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.textPrimary,
  },
});
