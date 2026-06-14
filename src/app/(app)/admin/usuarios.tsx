import { StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { TextField } from '@/components/ui/TextField';
import { colors } from '@/constants/theme';

const users = [
  { id: '1', nome: 'Administrador SCGE', email: 'admin@scge.com', perfil: 'Administrador' },
  { id: '2', nome: 'Operador Estoque', email: 'operador@scge.com', perfil: 'Operador' },
];

export default function UsuariosScreen() {
  return (
    <Screen title="Usuarios" description="Gestao de acessos e colaboradores do sistema.">
      <Card style={styles.filters}>
        <TextField label="Buscar usuario" placeholder="Nome ou e-mail" />
        <Button>Novo usuario</Button>
      </Card>

      {users.map((user) => (
        <Card key={user.id} style={styles.userCard}>
          <View>
            <Text style={styles.userName}>{user.nome}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
          </View>
          <Text style={styles.role}>{user.perfil}</Text>
        </Card>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  filters: {
    gap: 12,
  },
  userCard: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  userName: {
    color: colors.slate900,
    fontSize: 16,
    fontWeight: '800',
  },
  userEmail: {
    color: colors.slate500,
    fontSize: 13,
  },
  role: {
    color: colors.brand500,
    fontSize: 12,
    fontWeight: '900',
  },
});
