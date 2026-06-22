import { Picker } from '@react-native-picker/picker';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Feedback } from '@/components/ui/Feedback';
import { TextField } from '@/components/ui/TextField';
import { colors, radius } from '@/constants/theme';
import { Movement, MovementType, useData } from '@/providers/DataProvider';

type FeedbackState = {
  type: 'success' | 'error' | 'warning';
  message: string;
};

const movementLabels: Record<MovementType, string> = {
  entrada: 'Entrada',
  saida: 'Saida',
  ajuste: 'Ajuste',
};

export default function MovimentacoesScreen() {
  const { addMovement, movements, products } = useData();
  const activeProducts = products.filter((product) => product.status === 'ativo');
  const [produtoId, setProdutoId] = useState(activeProducts[0]?.id ?? '');
  const [tipo, setTipo] = useState<MovementType>('entrada');
  const [quantidade, setQuantidade] = useState('');
  const [motivo, setMotivo] = useState('');
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);

  const selectedProduct = useMemo(
    () => products.find((product) => product.id === produtoId),
    [products, produtoId],
  );

  const todayMovements = movements.filter((movement) => movement.data.startsWith('22/06/2026')).length;
  const entries = movements.filter((movement) => movement.tipo === 'entrada').length;
  const exits = movements.filter((movement) => movement.tipo === 'saida').length;

  function handleSubmit() {
    const amount = Number(quantidade);

    if (!produtoId) {
      setFeedback({ type: 'warning', message: 'Selecione um produto ativo para registrar a movimentacao.' });
      return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      setFeedback({ type: 'error', message: 'Informe uma quantidade maior que zero.' });
      return;
    }

    if (!motivo.trim()) {
      setFeedback({ type: 'warning', message: 'Informe o motivo da movimentacao.' });
      return;
    }

    addMovement({
      tipo,
      produtoId,
      quantidade: amount,
      motivo: motivo.trim(),
    });
    setQuantidade('');
    setMotivo('');
    setFeedback({
      type: 'success',
      message: tipo === 'ajuste' ? 'Ajuste registrado e saldo atualizado.' : 'Movimentacao registrada no estoque.',
    });
  }

  return (
    <Screen title="Movimentacoes" description="Registro de entrada, saida e ajuste de estoque.">
      <View style={styles.summaryGrid}>
        <MetricCard label="Hoje" value={todayMovements} />
        <MetricCard label="Entradas" value={entries} tone="success" />
        <MetricCard label="Saidas" value={exits} tone="danger" />
      </View>

      <Feedback type={feedback?.type ?? 'success'} message={feedback?.message} />

      <Card style={styles.form}>
        <Text style={styles.sectionTitle}>Nova operacao</Text>

        <Text style={styles.fieldLabel}>Tipo</Text>
        <View style={styles.chips}>
          {(['entrada', 'saida', 'ajuste'] as MovementType[]).map((item) => (
            <TypeChip key={item} active={tipo === item} label={movementLabels[item]} onPress={() => setTipo(item)} />
          ))}
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Produto</Text>
          <View style={styles.pickerBox}>
            <Picker selectedValue={produtoId} onValueChange={(value) => setProdutoId(String(value))}>
              {activeProducts.map((product) => (
                <Picker.Item
                  key={product.id}
                  label={`${product.codigo} - ${product.nome}`}
                  value={product.id}
                />
              ))}
            </Picker>
          </View>
          {selectedProduct ? (
            <Text style={styles.helperText}>
              Saldo atual: {selectedProduct.quantidade} {selectedProduct.unidade}
            </Text>
          ) : null}
        </View>

        <TextField
          keyboardType="numeric"
          label={tipo === 'ajuste' ? 'Novo saldo' : 'Quantidade'}
          onChangeText={setQuantidade}
          placeholder={tipo === 'ajuste' ? 'Quantidade final no estoque' : '0'}
          value={quantidade}
        />
        <TextField
          label="Motivo"
          onChangeText={setMotivo}
          placeholder="Reposicao, venda, conferencia..."
          value={motivo}
        />
        <Button disabled={!activeProducts.length} onPress={handleSubmit}>
          Registrar
        </Button>
      </Card>

      <Text style={styles.sectionTitle}>Historico</Text>
      {movements.length ? (
        movements.map((movement) => <MovementCard key={movement.id} movement={movement} />)
      ) : (
        <Card>
          <Text style={styles.emptyText}>Nenhuma movimentacao registrada.</Text>
        </Card>
      )}
    </Screen>
  );
}

function MetricCard({
  label,
  tone = 'default',
  value,
}: {
  label: string;
  tone?: 'default' | 'success' | 'danger';
  value: number;
}) {
  return (
    <Card style={styles.metricCard}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text
        style={[
          styles.metricValue,
          tone === 'success' ? styles.successValue : null,
          tone === 'danger' ? styles.dangerValue : null,
        ]}
      >
        {value}
      </Text>
    </Card>
  );
}

function TypeChip({ active, label, onPress }: { active: boolean; label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, active ? styles.chipActive : null]}>
      <Text style={[styles.chipText, active ? styles.chipTextActive : null]}>{label}</Text>
    </Pressable>
  );
}

function MovementCard({ movement }: { movement: Movement }) {
  const sign = movement.tipo === 'entrada' ? '+' : movement.tipo === 'saida' ? '-' : '=';

  return (
    <Card style={styles.item}>
      <View style={styles.itemText}>
        <Text style={styles.itemTitle}>{movement.produtoNome}</Text>
        <Text style={styles.itemDetail}>{movement.motivo}</Text>
        <Text style={styles.itemDate}>{movement.data}</Text>
      </View>
      <View style={styles.itemRight}>
        <Text
          style={[
            styles.badge,
            movement.tipo === 'entrada' ? styles.entryBadge : null,
            movement.tipo === 'saida' ? styles.exitBadge : null,
          ]}
        >
          {movementLabels[movement.tipo]}
        </Text>
        <Text style={styles.quantity}>
          {sign}
          {movement.quantidade}
        </Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  summaryGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  metricCard: {
    flex: 1,
    gap: 6,
    padding: 14,
  },
  metricLabel: {
    color: colors.slate500,
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  metricValue: {
    color: colors.brand500,
    fontSize: 24,
    fontWeight: '900',
  },
  successValue: {
    color: colors.green700,
  },
  dangerValue: {
    color: colors.red700,
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
  helperText: {
    color: colors.slate500,
    fontSize: 12,
    fontWeight: '600',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderColor: colors.slate200,
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipActive: {
    backgroundColor: colors.brand50,
    borderColor: colors.brand500,
  },
  chipText: {
    color: colors.slate700,
    fontSize: 13,
    fontWeight: '700',
  },
  chipTextActive: {
    color: colors.brand500,
  },
  item: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  itemText: {
    flex: 1,
  },
  itemTitle: {
    color: colors.slate900,
    fontSize: 16,
    fontWeight: '800',
  },
  itemDetail: {
    color: colors.slate500,
    fontSize: 13,
  },
  itemDate: {
    color: colors.slate400,
    fontSize: 12,
    marginTop: 4,
  },
  itemRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  badge: {
    color: colors.amber700,
    fontSize: 11,
    fontWeight: '900',
  },
  entryBadge: {
    color: colors.green700,
  },
  exitBadge: {
    color: colors.red700,
  },
  quantity: {
    color: colors.slate900,
    fontSize: 16,
    fontWeight: '900',
  },
  emptyText: {
    color: colors.slate500,
    fontSize: 14,
  },
});
