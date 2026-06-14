import { PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '@/constants/theme';

type ScreenProps = PropsWithChildren<{
  title?: string;
  description?: string;
}>;

export function Screen({ title, description, children }: ScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {title ? (
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            {description ? <Text style={styles.description}>{description}</Text> : null}
          </View>
        ) : null}
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.slate50,
  },
  content: {
    gap: 16,
    padding: 20,
    paddingBottom: 36,
  },
  header: {
    gap: 4,
  },
  title: {
    color: colors.slate900,
    fontSize: 26,
    fontWeight: '800',
  },
  description: {
    color: colors.slate500,
    fontSize: 14,
    lineHeight: 20,
  },
});
