import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/Header';
import { theme } from '../../theme';

interface InputFieldProps extends TextInputProps {
  label: string;
}

const InputField = ({ label, style, ...rest }: InputFieldProps) => (
  <View style={styles.fieldWrapper}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={[
        styles.input,
        rest.editable === false && styles.inputDisabled,
        style,
      ]}
      {...rest}
    />
  </View>
);

const InputsScreen = () => {
  const [textValue, setTextValue] = useState('');

  return (
    <SafeAreaView style={styles.root}>
      <Header title="Inputs" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>Basic</Text>
        <InputField label="Default" placeholder="Enter text..." />
        <InputField
          label="With Value"
          value={textValue}
          onChangeText={setTextValue}
          placeholder="Type something..."
        />

        <Text style={styles.sectionTitle}>Secure</Text>
        <InputField
          label="Password"
          placeholder="Enter password"
          secureTextEntry={true}
        />

        <Text style={styles.sectionTitle}>Keyboard Types</Text>
        <InputField
          label="Email"
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <InputField
          label="Phone"
          placeholder="+1 555 000 0000"
          keyboardType="phone-pad"
        />
        <InputField label="Number" placeholder="0" keyboardType="numeric" />

        <Text style={styles.sectionTitle}>Multiline</Text>
        <InputField
          label="Multiline"
          placeholder="Write something..."
          multiline={true}
          numberOfLines={4}
          style={styles.multilineInput}
        />

        <Text style={styles.sectionTitle}>States</Text>
        <InputField
          label="Disabled"
          value="Cannot edit this"
          editable={false}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  fieldWrapper: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    paddingHorizontal: theme.spacing.md,
    fontSize: theme.typography.sizes.md,
    color: theme.colors.textPrimary,
    backgroundColor: theme.colors.white,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  inputDisabled: {
    backgroundColor: theme.colors.surface,
    color: theme.colors.textSecondary,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
    marginTop: theme.spacing.lg,
  },
});

export default InputsScreen;
