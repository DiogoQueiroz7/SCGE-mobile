import { Link } from 'expo-router';
import { useState } from 'react';
import { StyleSheet } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Feedback } from '@/components/ui/Feedback';
import { TextField } from '@/components/ui/TextField';
import { colors } from '@/constants/theme';

type FeedbackState = {
  type: 'success' | 'error' | 'warning';
  message: string;
};

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);

  function handleSubmit() {
    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      setFeedback({ type: 'warning', message: 'Informe seu e-mail para continuar.' });
      return;
    }

    if (!normalizedEmail.includes('@')) {
      setFeedback({ type: 'error', message: 'Digite um e-mail valido.' });
      return;
    }

    setFeedback({
      type: 'success',
      message: 'Demo local: use a tela de redefinicao para simular a troca de senha.',
    });
  }

  return (
    <Screen title="Recuperar senha" description="Informe seu e-mail para receber as instrucoes de acesso.">
      <Card style={styles.card}>
        <TextField
          autoCapitalize="none"
          keyboardType="email-address"
          label="E-mail"
          onChangeText={setEmail}
          placeholder="seu.email@exemplo.com"
          value={email}
        />
        <Feedback type={feedback?.type ?? 'warning'} message={feedback?.message} />
        <Button onPress={handleSubmit}>Enviar instrucoes</Button>
        <Link href="/reset-password" style={styles.inlineLink}>
          Simular link recebido
        </Link>
      </Card>
      <Link href="/login" style={styles.link}>
        Voltar para login
      </Link>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 14,
  },
  link: {
    color: colors.brand500,
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  inlineLink: {
    color: colors.brand500,
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
});
