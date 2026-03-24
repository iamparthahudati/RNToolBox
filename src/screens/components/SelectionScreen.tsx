import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/Header';
import { theme } from '../../theme';

// ---------------------------------------------------------------------------
// CheckboxItem
// ---------------------------------------------------------------------------

interface CheckboxItemProps {
  label: string;
}

const CheckboxItem: React.FC<CheckboxItemProps> = ({ label }) => {
  const [checked, setChecked] = useState(false);

  return (
    <TouchableOpacity
      style={styles.row}
      onPress={() => setChecked(prev => !prev)}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.checkboxBox,
          {
            borderColor: checked ? theme.colors.primary : theme.colors.border,
            backgroundColor: checked
              ? theme.colors.primary
              : theme.colors.white,
          },
        ]}
      >
        {checked && <Text style={styles.checkmark}>&#10003;</Text>}
      </View>
      <Text style={styles.rowLabel}>{label}</Text>
    </TouchableOpacity>
  );
};

// ---------------------------------------------------------------------------
// SelectionScreen
// ---------------------------------------------------------------------------

const radioOptions = [
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
        {/* ---------------------------------------------------------------- */}
        {/* Switch section                                                    */}
        {/* ---------------------------------------------------------------- */}
        <Text style={styles.sectionTitle}>Switch</Text>

        <View style={styles.row}>
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

        <View style={styles.row}>
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

        <View style={styles.row}>
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

        {/* ---------------------------------------------------------------- */}
        {/* Checkbox section                                                  */}
        {/* ---------------------------------------------------------------- */}
        <Text style={styles.sectionTitle}>Checkbox</Text>

        <CheckboxItem label="Accept Terms" />
        <CheckboxItem label="Subscribe to newsletter" />
        <CheckboxItem label="Remember me" />

        {/* ---------------------------------------------------------------- */}
        {/* Radio section                                                     */}
        {/* ---------------------------------------------------------------- */}
        <Text style={styles.sectionTitle}>Radio</Text>

        {radioOptions.map(({ id, label }) => {
          const selected = selectedRadio === id;
          return (
            <TouchableOpacity
              key={id}
              style={styles.row}
              onPress={() => setSelectedRadio(id)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.radioOuter,
                  {
                    borderColor: selected
                      ? theme.colors.primary
                      : theme.colors.border,
                  },
                ]}
              >
                {selected && <View style={styles.radioInner} />}
              </View>
              <Text style={styles.rowLabel}>{label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  rowLabel: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.textPrimary,
  },
  // Checkbox
  checkboxBox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    marginRight: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: theme.colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  // Radio
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    marginRight: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: theme.colors.primary,
  },
});

export default SelectionScreen;
