import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Feedback } from '@/components/ui/Feedback';
import { TextField } from '@/components/ui/TextField';
import { colors, radius } from '@/constants/theme';
import { Role, useData } from '@/providers/DataProvider';

type FormState = {
  nome: string;
  descricao: string;
  permissoes: string[];
};
type FeedbackState = {
  type: 'success' | 'error' | 'warning';
  message: string;
};

const availablePermissions = ['Inventario', 'Produtos', 'Movimentacoes', 'Relatorios', 'Usuarios', 'Perfis'];

const emptyForm: FormState = {
  nome: '',
  descricao: '',
  permissoes: ['Inventario'],
};

export default function PerfisAcessoScreen() {
  const { addRole, roles, setRoleStatus, updateRole } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);

  const activeRoles = roles.filter((role) => role.status === 'ativo').length;

  function updateField(field: keyof Omit<FormState, 'permissoes'>, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function togglePermission(permission: string) {
    setForm((current) => {
      const hasPermission = current.permissoes.includes(permission);
      const nextPermissions = hasPermission
        ? current.permissoes.filter((item) => item !== permission)
        : [...current.permissoes, permission];

      return {
        ...current,
        permissoes: nextPermissions,
      };
    });
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingRole(null);
    setShowForm(false);
  }

  function handleNewRole() {
    setFeedback(null);
    setEditingRole(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function handleEditRole(role: Role) {
    setFeedback(null);
    setEditingRole(role);
    setForm({
      nome: role.nome,
      descricao: role.descricao,
      permissoes: role.permissoes,
    });
    setShowForm(true);
  }

  function handleSubmit() {
    if (!form.nome.trim() || !form.descricao.trim()) {
      setFeedback({ type: 'warning', message: 'Preencha nome e descricao do perfil.' });
      return;
    }

    if (!form.permissoes.length) {
      setFeedback({ type: 'error', message: 'Selecione pelo menos uma permissao.' });
      return;
    }

    const payload = {
      nome: form.nome.trim(),
      descricao: form.descricao.trim(),
      permissoes: form.permissoes,
    };

    if (editingRole) {
      updateRole(editingRole.id, payload);
      setFeedback({ type: 'success', message: 'Perfil atualizado com permissoes selecionadas.' });
    } else {
      addRole(payload);
      setFeedback({ type: 'success', message: 'Perfil criado na area administrativa.' });
    }

    resetForm();
  }

  return (
    <Screen title="Perfis de acesso" description="Cadastro de permissoes usadas pela area administrativa.">
      <View style={styles.summaryGrid}>
        <Card style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Perfis ativos</Text>
          <Text style={styles.summaryValue}>{activeRoles}</Text>
        </Card>
        <Card style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Permissoes</Text>
          <Text style={styles.summaryValue}>{availablePermissions.length}</Text>
        </Card>
      </View>

      <Feedback type={feedback?.type ?? 'success'} message={feedback?.message} />

      <Button onPress={handleNewRole}>Novo perfil</Button>

      {showForm ? (
        <Card style={styles.form}>
          <Text style={styles.sectionTitle}>{editingRole ? 'Editar perfil' : 'Novo perfil'}</Text>
          <TextField label="Nome do perfil" onChangeText={(value) => updateField('nome', value)} value={form.nome} />
          <TextField
            label="Descricao"
            onChangeText={(value) => updateField('descricao', value)}
            value={form.descricao}
          />
          <Text style={styles.fieldLabel}>Permissoes</Text>
          <View style={styles.permissionGrid}>
            {availablePermissions.map((permission) => (
              <PermissionChip
                key={permission}
                active={form.permissoes.includes(permission)}
                label={permission}
                onPress={() => togglePermission(permission)}
              />
            ))}
          </View>
          <View style={styles.actions}>
            <Button style={styles.actionButton} onPress={handleSubmit}>
              {editingRole ? 'Salvar' : 'Criar'}
            </Button>
            <Button style={styles.actionButton} variant="secondary" onPress={resetForm}>
              Cancelar
            </Button>
          </View>
        </Card>
      ) : null}

      {roles.map((role) => (
        <RoleCard
          key={role.id}
          onEdit={() => handleEditRole(role)}
          onToggleStatus={() => setRoleStatus(role.id, role.status === 'ativo' ? 'inativo' : 'ativo')}
          role={role}
        />
      ))}
    </Screen>
  );
}

function PermissionChip({ active, label, onPress }: { active: boolean; label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.permissionChip, active ? styles.permissionChipActive : null]}>
      <Text style={[styles.permissionText, active ? styles.permissionTextActive : null]}>{label}</Text>
    </Pressable>
  );
}

function RoleCard({
  onEdit,
  onToggleStatus,
  role,
}: {
  onEdit: () => void;
  onToggleStatus: () => void;
  role: Role;
}) {
  return (
    <Card style={styles.roleCard}>
      <View style={styles.roleHeader}>
        <View style={styles.roleText}>
          <Text style={styles.roleName}>{role.nome}</Text>
          <Text style={styles.roleDescription}>{role.descricao}</Text>
        </View>
        <View style={[styles.statusPill, role.status === 'ativo' ? styles.activePill : styles.inactivePill]}>
          <Text style={[styles.statusText, role.status === 'ativo' ? styles.activeText : styles.inactiveText]}>
            {role.status === 'ativo' ? 'Ativo' : 'Inativo'}
          </Text>
        </View>
      </View>
      <View style={styles.permissionGrid}>
        {role.permissoes.map((permission) => (
          <View key={permission} style={styles.readOnlyPermission}>
            <Text style={styles.readOnlyPermissionText}>{permission}</Text>
          </View>
        ))}
      </View>
      <View style={styles.actions}>
        <Button style={styles.actionButton} variant="secondary" onPress={onEdit}>
          Editar
        </Button>
        <Button style={styles.actionButton} variant={role.status === 'ativo' ? 'danger' : 'secondary'} onPress={onToggleStatus}>
          {role.status === 'ativo' ? 'Inativar' : 'Ativar'}
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
  form: {
    gap: 12,
  },
  sectionTitle: {
    color: colors.slate900,
    fontSize: 18,
    fontWeight: '900',
  },
  fieldLabel: {
    color: colors.slate700,
    fontSize: 13,
    fontWeight: '700',
  },
  permissionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  permissionChip: {
    borderColor: colors.slate200,
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  permissionChipActive: {
    backgroundColor: colors.brand50,
    borderColor: colors.brand500,
  },
  permissionText: {
    color: colors.slate700,
    fontSize: 13,
    fontWeight: '700',
  },
  permissionTextActive: {
    color: colors.brand500,
  },
  roleCard: {
    gap: 12,
  },
  roleHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  roleText: {
    flex: 1,
  },
  roleName: {
    color: colors.slate900,
    fontSize: 16,
    fontWeight: '900',
  },
  roleDescription: {
    color: colors.slate500,
    fontSize: 13,
    lineHeight: 18,
  },
  readOnlyPermission: {
    backgroundColor: colors.slate100,
    borderRadius: radius.sm,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  readOnlyPermissionText: {
    color: colors.slate700,
    fontSize: 12,
    fontWeight: '800',
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
