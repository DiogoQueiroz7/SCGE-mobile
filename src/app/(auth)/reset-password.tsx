import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Feedback } from '@/components/ui/Feedback';
import { TextField } from '@/components/ui/TextField';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const [senha, setSenha] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [feedback, setFeedback] = useState('');

  function handleSubmit() {
    if (senha.length < 8) {
      setFeedback('A senha deve ter pelo menos 8 caracteres.');
      return;
    }

    if (senha !== confirmacao) {
      setFeedback('As senhas precisam ser iguais.');
      return;
    }

    router.replace('/login');
  }

  return (
    <Screen title="Redefinir senha" description="Crie uma senha segura para voltar a acessar o SCGE.">
      <Card style={styles.card}>
        <TextField label="Nova senha" onChangeText={setSenha} secureTextEntry value={senha} />
        <TextField label="Confirmar senha" onChangeText={setConfirmacao} secureTextEntry value={confirmacao} />
        <Feedback type="error" message={feedback} />
        <Button onPress={handleSubmit}>Salvar nova senha</Button>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 14,
  },
});
