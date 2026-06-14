import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Feedback } from '@/components/ui/Feedback';
import { TextField } from '@/components/ui/TextField';
import { colors } from '@/constants/theme';
import { useAuth } from '@/providers/AuthProvider';

const DEMO_EMAIL = 'demo@scge.com';
const DEMO_PASSWORD = '12345678';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, signInDemo } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!email.trim() || !senha.trim()) {
      setError('Informe e-mail e senha para acessar o SCGE.');
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (normalizedEmail === DEMO_EMAIL && senha === DEMO_PASSWORD) {
      await signInDemo();
      router.replace('/dashboard');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await signIn(normalizedEmail, senha);
      router.replace('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nao foi possivel entrar.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDemo() {
    await signInDemo();
    router.replace('/dashboard');
  }

  return (
    <KeyboardAvoidingView behavior={Platform.select({ ios: 'padding', android: undefined })} style={styles.flex}>
      <Screen>
        <View style={styles.hero}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>SCGE</Text>
          </View>
          <Text style={styles.title}>Entrar no sistema</Text>
          <Text style={styles.subtitle}>Controle estoque, usuarios e movimentacoes em uma rotina simples.</Text>
        </View>

        <Card style={styles.card}>
          <TextField
            autoCapitalize="none"
            keyboardType="email-address"
            label="E-mail"
            onChangeText={setEmail}
            placeholder="seu.email@exemplo.com"
            value={email}
          />
          <TextField
            label="Senha"
            onChangeText={setSenha}
            placeholder="Digite sua senha"
            secureTextEntry
            value={senha}
          />
          <Feedback type="error" message={error} />
          <Button loading={loading} onPress={handleSubmit}>
            Entrar
          </Button>
          <Button variant="secondary" onPress={handleDemo}>
            Entrar em modo demo
          </Button>
        </Card>

        <Link href="/forgot-password" style={styles.link}>
          Esqueci minha senha
        </Link>
      </Screen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  hero: {
    alignItems: 'center',
    gap: 8,
    marginTop: 36,
  },
  logo: {
    alignItems: 'center',
    backgroundColor: colors.brand500,
    borderRadius: 12,
    height: 58,
    justifyContent: 'center',
    width: 58,
  },
  logoText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '900',
  },
  title: {
    color: colors.slate900,
    fontSize: 26,
    fontWeight: '800',
    marginTop: 10,
  },
  subtitle: {
    color: colors.slate500,
    fontSize: 14,
    lineHeight: 20,
    maxWidth: 310,
    textAlign: 'center',
  },
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
