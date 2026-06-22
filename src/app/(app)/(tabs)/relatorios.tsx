import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Feedback } from '@/components/ui/Feedback';
import { TextField } from '@/components/ui/TextField';
import { colors } from '@/constants/theme';
import { Report, useData } from '@/providers/DataProvider';

type FeedbackState = {
  type: 'success' | 'error' | 'warning';
  message: string;
};

export default function RelatoriosScreen() {
  const { createReport, movements, products, reports } = useData();
  const [busca, setBusca] = useState('');
  const [periodo, setPeriodo] = useState('Ultimos 30 dias');
  const [nome, setNome] = useState('Relatorio gerencial');
  const [tipo, setTipo] = useState('Inventario');
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);

  const filteredReports = useMemo(() => {
    const query = busca.trim().toLowerCase();

    return reports.filter(
      (report) =>
        report.nome.toLowerCase().includes(query) ||
        report.id.toLowerCase().includes(query) ||
        report.tipo.toLowerCase().includes(query),
    );
  }, [busca, reports]);

  const activeProducts = products.filter((product) => product.status === 'ativo');
  const lowStock = activeProducts.filter((product) => product.quantidade < product.minimo);
  const inactiveProducts = products.filter((product) => product.status === 'inativo');

  function handleCreateReport() {
    if (!nome.trim() || !periodo.trim() || !tipo.trim()) {
      setFeedback({ type: 'warning', message: 'Preencha nome, tipo e periodo para gerar o relatorio.' });
      return;
    }

    createReport({
      nome: nome.trim(),
      periodo: periodo.trim(),
      tipo: tipo.trim(),
    });
    setFeedback({ type: 'success', message: 'Relatorio gerado com os dados locais atuais.' });
  }

  async function handleShare(report: Report) {
    const content = [
      `SCGE - ${report.nome}`,
      `Codigo: ${report.id}`,
      `Tipo: ${report.tipo}`,
      `Periodo: ${report.periodo}`,
      `Criado em: ${report.criadoEm}`,
      '',
      report.resumo,
      '',
      `Produtos ativos: ${activeProducts.length}`,
      `Produtos inativos: ${inactiveProducts.length}`,
      `Itens com estoque baixo: ${lowStock.length}`,
      `Movimentacoes registradas: ${movements.length}`,
    ].join('\n');

    try {
      if (!FileSystem.documentDirectory) {
        setFeedback({ type: 'warning', message: 'Exportacao de arquivo indisponivel neste ambiente.' });
        return;
      }

      const fileUri = `${FileSystem.documentDirectory}${report.id}.txt`;
      await FileSystem.writeAsStringAsync(fileUri, content);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          dialogTitle: `Compartilhar ${report.nome}`,
          mimeType: 'text/plain',
        });
      }

      setFeedback({ type: 'success', message: `Arquivo ${report.id}.txt gerado para compartilhamento.` });
    } catch {
      setFeedback({ type: 'warning', message: 'Relatorio gerado na tela; compartilhamento indisponivel no web local.' });
    }
  }

  return (
    <Screen title="Relatorios" description="Filtros e exportacoes para apoio a gestao.">
      <View style={styles.summaryGrid}>
        <SummaryCard label="Produtos ativos" value={activeProducts.length} />
        <SummaryCard label="Estoque baixo" value={lowStock.length} tone="warning" />
        <SummaryCard label="Movimentacoes" value={movements.length} />
      </View>

      <Feedback type={feedback?.type ?? 'success'} message={feedback?.message} />

      <Card style={styles.filters}>
        <Text style={styles.sectionTitle}>Gerar relatorio</Text>
        <TextField label="Nome" onChangeText={setNome} placeholder="Relatorio gerencial" value={nome} />
        <View style={styles.row}>
          <TextField label="Tipo" onChangeText={setTipo} placeholder="Inventario" style={styles.rowInput} value={tipo} />
          <TextField
            label="Periodo"
            onChangeText={setPeriodo}
            placeholder="Ultimos 30 dias"
            style={styles.rowInput}
            value={periodo}
          />
        </View>
        <Button onPress={handleCreateReport}>Gerar novo relatorio</Button>
      </Card>

      <Card style={styles.explanation}>
        <Text style={styles.sectionTitle}>Criterios do relatorio</Text>
        <Text style={styles.explanationText}>
          Os relatorios usam os produtos, movimentacoes e status locais da demo. A tela resume alertas de estoque,
          quantidade ativa/inativa e historico operacional para apoiar a apresentacao sem depender de backend.
        </Text>
      </Card>

      <TextField label="Buscar relatorio" onChangeText={setBusca} placeholder="Nome, codigo ou tipo" value={busca} />

      {filteredReports.length ? (
        filteredReports.map((report) => <ReportCard key={report.id} onShare={() => handleShare(report)} report={report} />)
      ) : (
        <Card>
          <Text style={styles.emptyText}>Nenhum relatorio encontrado.</Text>
        </Card>
      )}
    </Screen>
  );
}

function SummaryCard({
  label,
  tone = 'default',
  value,
}: {
  label: string;
  tone?: 'default' | 'warning';
  value: number;
}) {
  return (
    <Card style={styles.summaryCard}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={[styles.summaryValue, tone === 'warning' ? styles.warningValue : null]}>{value}</Text>
    </Card>
  );
}

function ReportCard({ onShare, report }: { onShare: () => void; report: Report }) {
  return (
    <Card style={styles.report}>
      <View style={styles.reportHeader}>
        <View style={styles.reportText}>
          <Text style={styles.reportTitle}>{report.nome}</Text>
          <Text style={styles.reportDetail}>
            {report.id} - {report.tipo} - {report.periodo}
          </Text>
          <Text style={styles.reportSummary}>{report.resumo}</Text>
          <Text style={styles.reportDate}>Criado em {report.criadoEm}</Text>
        </View>
        <Text style={report.status === 'Pronto' ? styles.ready : styles.pending}>{report.status}</Text>
      </View>
      <Button variant="secondary" onPress={onShare}>
        Compartilhar
      </Button>
    </Card>
  );
}

const styles = StyleSheet.create({
  summaryGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  summaryCard: {
    flex: 1,
    gap: 6,
    padding: 14,
  },
  summaryLabel: {
    color: colors.slate500,
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  summaryValue: {
    color: colors.brand500,
    fontSize: 24,
    fontWeight: '900',
  },
  warningValue: {
    color: colors.amber700,
  },
  filters: {
    gap: 12,
  },
  sectionTitle: {
    color: colors.slate900,
    fontSize: 18,
    fontWeight: '900',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  rowInput: {
    flex: 1,
  },
  explanation: {
    gap: 8,
  },
  explanationText: {
    color: colors.slate500,
    fontSize: 14,
    lineHeight: 20,
  },
  report: {
    gap: 12,
  },
  reportHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  reportText: {
    flex: 1,
    gap: 4,
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
  reportSummary: {
    color: colors.slate700,
    fontSize: 13,
    lineHeight: 18,
  },
  reportDate: {
    color: colors.slate400,
    fontSize: 12,
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
  emptyText: {
    color: colors.slate500,
    fontSize: 14,
  },
});
