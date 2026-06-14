import { TextInputProps } from 'react-native';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { colors, radius } from '@/constants/theme';

type TextFieldProps = TextInputProps & {
  label: string;
  error?: string;
};

export function TextField({ label, error, style, ...props }: TextFieldProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor={colors.slate400}
        style={[styles.input, error ? styles.inputError : null, style]}
        {...props}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 6,
  },
  label: {
    color: colors.slate700,
    fontSize: 13,
    fontWeight: '700',
  },
  input: {
    minHeight: 46,
    borderColor: colors.slate200,
    borderRadius: radius.md,
    borderWidth: 1,
    color: colors.slate900,
    fontSize: 15,
    paddingHorizontal: 14,
  },
  inputError: {
    borderColor: colors.red500,
  },
  error: {
    color: colors.red700,
    fontSize: 12,
  },
});
