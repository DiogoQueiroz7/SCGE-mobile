import { StyleSheet, Text, View } from 'react-native';

import { colors, radius } from '@/constants/theme';

type FeedbackProps = {
  type: 'success' | 'error' | 'warning';
  message?: string;
};

export function Feedback({ type, message }: FeedbackProps) {
  if (!message) return null;

  return (
    <View style={[styles.box, styles[type]]}>
      <Text style={[styles.text, styles[`${type}Text`]]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    borderRadius: radius.md,
    borderWidth: 1,
    padding: 12,
  },
  text: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  success: {
    backgroundColor: colors.green50,
    borderColor: '#bbf7d0',
  },
  error: {
    backgroundColor: colors.red50,
    borderColor: '#fecaca',
  },
  warning: {
    backgroundColor: colors.amber50,
    borderColor: '#fde68a',
  },
  successText: {
    color: colors.green700,
  },
  errorText: {
    color: colors.red700,
  },
  warningText: {
    color: colors.amber700,
  },
});
