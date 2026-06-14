import { StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { TextField } from '@/components/ui/TextField';
import { colors } from '@/constants/theme';

const reports = [
  { id: 'REL-001', nome: 'Estoque geral', formato: 'PDF', status: 'Pronto' },
  { id: 'REL-002', nome: 'Movimentacoes da semana', formato: 'XLSX', status: 'Processando' },
];

export default function RelatoriosScreen() {
  return (
    <Screen title="Relatorios" description="Filtros e exportacoes para apoio a gestao.">
      <Card style={styles.filters}>
        <Text style={styles.sectionTitle}>Filtros</Text>
        <TextField label="Buscar" placeholder="Nome ou codigo" />
        <TextField label="Periodo" placeholder="Ultimos 30 dias" />
        <Button>Gerar novo relatorio</Button>
      </Card>

      {reports.map((report) => (
        <Card key={report.id} style={styles.report}>
          <View>
            <Text style={styles.reportTitle}>{report.nome}</Text>
            <Text style={styles.reportDetail}>
              {report.id} - {report.formato}
            </Text>
          </View>
          <Text style={report.status === 'Pronto' ? styles.ready : styles.pending}>{report.status}</Text>
        </Card>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  filters: {
    gap: 12,
  },
  sectionTitle: {
    color: colors.slate900,
    fontSize: 18,
    fontWeight: '900',
  },
  report: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  reportTitle: {
    color: colors.slate900,
    fontSize: 16,
    fontWeight: '800',
  },
  reportDetail: {
    color: colors.slate500,
    fontSize: 13,
  },
  ready: {
    color: colors.green700,
    fontSize: 13,
    fontWeight: '900',
  },
  pending: {
    color: colors.amber700,
    fontSize: 13,
    fontWeight: '900',
  },
});
