import { Picker } from '@react-native-picker/picker';
import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Feedback } from '@/components/ui/Feedback';
import { TextField } from '@/components/ui/TextField';
import { colors, radius } from '@/constants/theme';
import { AppUser, useData } from '@/providers/DataProvider';

type FormState = {
  nome: string;
  email: string;
  perfil: string;
};
type FeedbackState = {
  type: 'success' | 'error' | 'warning';
  message: string;
};

const emptyForm: FormState = {
  nome: '',
  email: '',
  perfil: 'Operador',
};

export default function UsuariosScreen() {
  const { addUser, roles, setUserStatus, updateUser, users } = useData();
  const activeRoles = roles.filter((role) => role.status === 'ativo');
  const [busca, setBusca] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<AppUser | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);

  const filteredUsers = useMemo(() => {
    const query = busca.trim().toLowerCase();

    return users.filter(
      (user) =>
        user.nome.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.perfil.toLowerCase().includes(query),
    );
  }, [busca, users]);

  const activeUsers = users.filter((user) => user.status === 'ativo').length;

  function updateField(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function resetForm() {
    setForm({ ...emptyForm, perfil: activeRoles[0]?.nome ?? 'Operador' });
    setEditingUser(null);
    setShowForm(false);
  }

  function handleNewUser() {
    setFeedback(null);
    setEditingUser(null);
    setForm({ ...emptyForm, perfil: activeRoles[0]?.nome ?? 'Operador' });
    setShowForm(true);
  }

  function handleEditUser(user: AppUser) {
    setFeedback(null);
    setEditingUser(user);
    setForm({
      nome: user.nome,
      email: user.email,
      perfil: user.perfil,
    });
    setShowForm(true);
  }

  function handleSubmit() {
    if (!form.nome.trim() || !form.email.trim()) {
      setFeedback({ type: 'warning', message: 'Preencha nome e e-mail do usuario.' });
      return;
    }

    if (!form.email.includes('@')) {
      setFeedback({ type: 'error', message: 'Digite um e-mail valido.' });
      return;
    }

    const payload = {
      nome: form.nome.trim(),
      email: form.email.trim().toLowerCase(),
      perfil: form.perfil,
    };

    if (editingUser) {
      updateUser(editingUser.id, payload);
      setFeedback({ type: 'success', message: 'Usuario atualizado na area administrativa.' });
    } else {
      addUser(payload);
      setFeedback({ type: 'success', message: 'Usuario criado na area administrativa.' });
    }

    resetForm();
  }

  return (
    <Screen title="Usuarios" description="Gestao de acessos e colaboradores do sistema.">
      <View style={styles.summaryGrid}>
        <Card style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Ativos</Text>
          <Text style={styles.summaryValue}>{activeUsers}</Text>
        </Card>
        <Card style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Perfis ativos</Text>
          <Text style={styles.summaryValue}>{activeRoles.length}</Text>
        </Card>
      </View>

      <Feedback type={feedback?.type ?? 'success'} message={feedback?.message} />

      <Card style={styles.filters}>
        <TextField label="Buscar usuario" onChangeText={setBusca} placeholder="Nome, e-mail ou perfil" value={busca} />
        <Button onPress={handleNewUser}>Novo usuario</Button>
      </Card>

      {showForm ? (
        <Card style={styles.form}>
          <Text style={styles.sectionTitle}>{editingUser ? 'Editar usuario' : 'Novo usuario'}</Text>
          <TextField label="Nome" onChangeText={(value) => updateField('nome', value)} value={form.nome} />
          <TextField
            autoCapitalize="none"
            keyboardType="email-address"
            label="E-mail"
            onChangeText={(value) => updateField('email', value)}
            value={form.email}
          />
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Perfil</Text>
            <View style={styles.pickerBox}>
              <Picker selectedValue={form.perfil} onValueChange={(value) => updateField('perfil', String(value))}>
                {activeRoles.map((role) => (
                  <Picker.Item key={role.id} label={role.nome} value={role.nome} />
                ))}
              </Picker>
            </View>
          </View>
          <View style={styles.actions}>
            <Button style={styles.actionButton} onPress={handleSubmit}>
              {editingUser ? 'Salvar' : 'Criar'}
            </Button>
            <Button style={styles.actionButton} variant="secondary" onPress={resetForm}>
              Cancelar
            </Button>
          </View>
        </Card>
      ) : null}

      {filteredUsers.map((user) => (
        <UserCard
          key={user.id}
          onEdit={() => handleEditUser(user)}
          onToggleStatus={() => setUserStatus(user.id, user.status === 'ativo' ? 'inativo' : 'ativo')}
          user={user}
        />
      ))}
    </Screen>
  );
}

function UserCard({
  onEdit,
  onToggleStatus,
  user,
}: {
  onEdit: () => void;
  onToggleStatus: () => void;
  user: AppUser;
}) {
  return (
    <Card style={styles.userCard}>
      <View style={styles.userHeader}>
        <View style={styles.userText}>
          <Text style={styles.userName}>{user.nome}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>
        <View style={[styles.statusPill, user.status === 'ativo' ? styles.activePill : styles.inactivePill]}>
          <Text style={[styles.statusText, user.status === 'ativo' ? styles.activeText : styles.inactiveText]}>
            {user.status === 'ativo' ? 'Ativo' : 'Inativo'}
          </Text>
        </View>
      </View>
      <Text style={styles.role}>{user.perfil}</Text>
      <View style={styles.actions}>
        <Button style={styles.actionButton} variant="secondary" onPress={onEdit}>
          Editar
        </Button>
        <Button style={styles.actionButton} variant={user.status === 'ativo' ? 'danger' : 'secondary'} onPress={onToggleStatus}>
          {user.status === 'ativo' ? 'Inativar' : 'Ativar'}
        </Button>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  summaryGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    gap: 6,
  },
  summaryLabel: {
    color: colors.slate500,
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  summaryValue: {
    color: colors.brand500,
    fontSize: 28,
    fontWeight: '900',
  },
  filters: {
    gap: 12,
  },
  form: {
    gap: 12,
  },
  sectionTitle: {
    color: colors.slate900,
    fontSize: 18,
    fontWeight: '900',
  },
  fieldGroup: {
    gap: 6,
  },
  fieldLabel: {
    color: colors.slate700,
    fontSize: 13,
    fontWeight: '700',
  },
  pickerBox: {
    borderColor: colors.slate200,
    borderRadius: radius.md,
    borderWidth: 1,
    overflow: 'hidden',
  },
  userCard: {
    gap: 12,
  },
  userHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  userText: {
    flex: 1,
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
  statusPill: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  activePill: {
    backgroundColor: colors.green50,
  },
  inactivePill: {
    backgroundColor: colors.slate100,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '900',
  },
  activeText: {
    color: colors.green700,
  },
  inactiveText: {
    color: colors.slate500,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
  },
});
