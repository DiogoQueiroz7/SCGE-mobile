import { Link } from 'expo-router';
import { useState } from 'react';
import { StyleSheet } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Feedback } from '@/components/ui/Feedback';
import { TextField } from '@/components/ui/TextField';
import { colors } from '@/constants/theme';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  function handleSubmit() {
    setMessage(email.trim() ? 'Se esse e-mail existir, enviaremos as instrucoes de recuperacao.' : 'Informe seu e-mail.');
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
        <Feedback type={email.trim() ? 'success' : 'warning'} message={message} />
        <Button onPress={handleSubmit}>Enviar instrucoes</Button>
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
});
