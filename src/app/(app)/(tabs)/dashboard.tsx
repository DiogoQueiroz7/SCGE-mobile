import { useRouter } from 'expo-router';
import { AlertTriangle, ClipboardList, PackageCheck, Users } from 'lucide-react-native';
import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { colors } from '@/constants/theme';
import { useAuth } from '@/providers/AuthProvider';
import { Movement, useData } from '@/providers/DataProvider';

export default function Dashboard() {
  const router = useRouter();
  const { signOut, user } = useAuth();
  const { movements, products, reports, users } = useData();

  const activeProducts = products.filter((product) => product.status === 'ativo');
  const lowStock = activeProducts.filter((product) => product.quantidade < product.minimo);
  const activeUsers = users.filter((item) => item.status === 'ativo');
  const recentMovements = movements.slice(0, 4);

  async function handleSignOut() {
    await signOut();
    router.replace('/login');
  }

  return (
    <Screen title="Dashboard" description={`Bem-vindo, ${user?.nome ?? 'usuario'}. Acompanhe a operacao do estoque.`}>
      <View style={styles.metricsContainer}>
        <MetricCard
          icon={<PackageCheck color={colors.brand500} size={22} />}
          label="Produtos ativos"
          value={activeProducts.length}
          detail={`${products.length} cadastrados`}
        />
        <MetricCard
          icon={<ClipboardList color={colors.green700} size={22} />}
          label="Movimentacoes"
          value={movements.length}
          detail="Historico local"
          tone="success"
        />
      </View>

      <View style={styles.metricsContainer}>
        <MetricCard
          icon={<AlertTriangle color={colors.amber700} size={22} />}
          label="Estoque baixo"
          value={lowStock.length}
          detail="Itens para reposicao"
          tone="warning"
        />
        <MetricCard
          icon={<Users color={colors.brand500} size={22} />}
          label="Usuarios ativos"
          value={activeUsers.length}
          detail={`${reports.length} relatorios`}
        />
      </View>

      <Card style={styles.alertCard}>
        <Text style={styles.sectionTitle}>Alertas de estoque</Text>
        {lowStock.length ? (
          lowStock.slice(0, 3).map((product) => (
            <View key={product.id} style={styles.alertItem}>
              <View>
                <Text style={styles.alertTitle}>{product.nome}</Text>
                <Text style={styles.alertDetail}>
                  {product.quantidade} {product.unidade} em estoque - minimo {product.minimo}
                </Text>
              </View>
              <View style={styles.alertBadgeWrapper}>
                <Text style={styles.alertBadge}>Baixo</Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>Nenhum alerta critico no momento.</Text>
        )}
      </Card>

      <Text style={styles.sectionTitle}>Atividades recentes</Text>
      {recentMovements.length ? (
        recentMovements.map((movement) => <ActivityCard key={movement.id} movement={movement} />)
      ) : (
        <Card>
          <Text style={styles.emptyText}>Nenhuma movimentacao registrada.</Text>
        </Card>
      )}

      <Card style={styles.adminCard}>
        <Text style={styles.sectionTitle}>Area administrativa</Text>
        <Text style={styles.adminText}>Acesso rapido para manutencao de usuarios, perfis e sessao da demo.</Text>
        <View style={styles.actions}>
          <Button style={styles.actionButton} variant="secondary" onPress={() => router.push('/admin/usuarios')}>
            Usuarios
          </Button>
          <Button style={styles.actionButton} variant="secondary" onPress={() => router.push('/admin/perfis-acesso')}>
            Perfis
          </Button>
        </View>
        <Button variant="ghost" onPress={handleSignOut}>
          Sair
        </Button>
      </Card>
    </Screen>
  );
}

function MetricCard({
  detail,
  icon,
  label,
  tone = 'default',
  value,
}: {
  detail: string;
  icon: ReactNode;
  label: string;
  tone?: 'default' | 'success' | 'warning';
  value: number;
}) {
  return (
    <Card style={styles.metricCard}>
      <View style={styles.metricIcon}>{icon}</View>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text
        style={[
          styles.metricValue,
          tone === 'success' ? styles.successValue : null,
          tone === 'warning' ? styles.warningValue : null,
        ]}
      >
        {value}
      </Text>
      <Text style={styles.metricDetail}>{detail}</Text>
    </Card>
  );
}

function ActivityCard({ movement }: { movement: Movement }) {
  const tone =
    movement.tipo === 'entrada' ? styles.activityDotSuccess : movement.tipo === 'saida' ? styles.activityDotError : styles.activityDotWarning;
  const label = movement.tipo === 'entrada' ? 'Entrada de estoque' : movement.tipo === 'saida' ? 'Saida de estoque' : 'Ajuste de estoque';

  return (
    <Card style={styles.activityCard}>
      <View style={[styles.activityDot, tone]} />
      <View style={styles.activityText}>
        <Text style={styles.activityTitle}>{label}</Text>
        <Text style={styles.activityDescription}>
          {movement.quantidade} un. - {movement.produtoNome}
        </Text>
        <Text style={styles.activityTime}>{movement.data}</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  metricsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  metricCard: {
    flex: 1,
    gap: 7,
    minHeight: 142,
  },
  metricIcon: {
    alignItems: 'center',
    backgroundColor: colors.slate100,
    borderRadius: 8,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  metricLabel: {
    color: colors.slate500,
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  metricValue: {
    color: colors.brand500,
    fontSize: 30,
    fontWeight: '900',
  },
  successValue: {
    color: colors.green700,
  },
  warningValue: {
    color: colors.amber700,
  },
  metricDetail: {
    color: colors.slate500,
    fontSize: 12,
    fontWeight: '600',
  },
  sectionTitle: {
    color: colors.slate900,
    fontSize: 18,
    fontWeight: '900',
  },
  alertCard: {
    gap: 12,
  },
  alertItem: {
    alignItems: 'center',
    borderTopColor: colors.slate100,
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    paddingTop: 12,
  },
  alertTitle: {
    color: colors.slate900,
    fontSize: 15,
    fontWeight: '800',
  },
  alertDetail: {
    color: colors.slate500,
    fontSize: 13,
  },
  alertBadgeWrapper: {
    backgroundColor: colors.amber50,
    borderColor: colors.amber500,
    borderRadius: 6,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  alertBadge: {
    color: colors.amber700,
    fontSize: 11,
    fontWeight: '900',
  },
  activityCard: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
  },
  activityDot: {
    borderRadius: 5,
    height: 10,
    marginTop: 5,
    width: 10,
  },
  activityDotSuccess: {
    backgroundColor: colors.green500,
  },
  activityDotWarning: {
    backgroundColor: colors.amber500,
  },
  activityDotError: {
    backgroundColor: colors.red500,
  },
  activityText: {
    flex: 1,
  },
  activityTitle: {
    color: colors.slate900,
    fontSize: 15,
    fontWeight: '800',
  },
  activityDescription: {
    color: colors.slate700,
    fontSize: 14,
    marginTop: 2,
  },
  activityTime: {
    color: colors.slate400,
    fontSize: 12,
    marginTop: 4,
  },
  adminCard: {
    gap: 12,
  },
  adminText: {
    color: colors.slate500,
    fontSize: 14,
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
  },
  emptyText: {
    color: colors.slate500,
    fontSize: 14,
  },
});
