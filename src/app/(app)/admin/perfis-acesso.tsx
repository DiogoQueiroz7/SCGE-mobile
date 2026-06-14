import { StyleSheet, Text } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { TextField } from '@/components/ui/TextField';
import { colors } from '@/constants/theme';

const roles = ['Administrador', 'Operador', 'Consulta'];

export default function PerfisAcessoScreen() {
  return (
    <Screen title="Perfis de acesso" description="Cadastro de permissoes usadas pela area administrativa.">
      <Card style={styles.form}>
        <TextField label="Nome do perfil" placeholder="Ex: Operador" />
        <Button>Criar perfil</Button>
      </Card>

      {roles.map((role) => (
        <Card key={role}>
          <Text style={styles.roleName}>{role}</Text>
          <Text style={styles.roleStatus}>Ativo</Text>
        </Card>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 12,
  },
  roleName: {
    color: colors.slate900,
    fontSize: 16,
    fontWeight: '900',
  },
  roleStatus: {
    color: colors.green700,
    fontSize: 13,
    fontWeight: '800',
    marginTop: 4,
  },
});
