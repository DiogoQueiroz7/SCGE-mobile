import { Link } from 'expo-router';
import { Bell, Boxes, TriangleAlert, Users } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { Card } from '@/components/ui/Card';
import { colors } from '@/constants/theme';
import { useAuth } from '@/providers/AuthProvider';

const activities = [
  { id: '1', label: 'Entrada de 10 unidades', detail: 'Item A - hoje, 08:00' },
  { id: '2', label: 'Saida de 2 unidades', detail: 'Item B - hoje, 11:00' },
  { id: '3', label: 'Ajuste de inventario', detail: 'Item C - ontem, 14:00' },
];

export default function DashboardScreen() {
  const { user, signOut } = useAuth();

  return (
    <Screen title="Dashboard" description={`Bem-vindo, ${user?.nome ?? 'usuario'}. Visao geral do estoque.`}>
      <View style={styles.grid}>
        <MetricCard icon={<Boxes color={colors.brand500} size={22} />} label="Produtos" value="128" />
        <MetricCard icon={<TriangleAlert color={colors.amber500} size={22} />} label="Estoque baixo" value="8" />
        <MetricCard icon={<Users color={colors.green500} size={22} />} label="Usuarios" value="12" />
      </View>

      <Card style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Atividades recentes</Text>
          <Bell color={colors.slate500} size={18} />
        </View>
        {activities.map((item) => (
          <View key={item.id} style={styles.activity}>
            <Text style={styles.activityLabel}>{item.label}</Text>
            <Text style={styles.activityDetail}>{item.detail}</Text>
          </View>
        ))}
      </Card>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Area administrativa</Text>
        <Link href="/admin/usuarios" style={styles.link}>
          Gerenciar usuarios
        </Link>
        <Link href="/admin/perfis-acesso" style={styles.link}>
          Gerenciar perfis de acesso
        </Link>
        <Text onPress={signOut} style={styles.logout}>
          Sair do app
        </Text>
      </Card>
    </Screen>
  );
}

function MetricCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <Card style={styles.metric}>
      {icon}
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  grid: {
    gap: 12,
  },
  metric: {
    gap: 8,
  },
  metricLabel: {
    color: colors.slate500,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  metricValue: {
    color: colors.slate900,
    fontSize: 30,
    fontWeight: '900',
  },
  section: {
    gap: 12,
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: colors.slate900,
    fontSize: 17,
    fontWeight: '800',
  },
  activity: {
    borderTopColor: colors.slate100,
    borderTopWidth: 1,
    gap: 2,
    paddingTop: 12,
  },
  activityLabel: {
    color: colors.slate900,
    fontSize: 14,
    fontWeight: '700',
  },
  activityDetail: {
    color: colors.slate500,
    fontSize: 13,
  },
  link: {
    color: colors.brand500,
    fontSize: 15,
    fontWeight: '700',
  },
  logout: {
    color: colors.red700,
    fontSize: 15,
    fontWeight: '700',
  },
});
