import { StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { TextField } from '@/components/ui/TextField';
import { colors } from '@/constants/theme';

const movements = [
  { id: '1', tipo: 'ENTRADA', produto: 'Item A', quantidade: '+10 un', motivo: 'Reposicao' },
  { id: '2', tipo: 'SAIDA', produto: 'Item B', quantidade: '-2 un', motivo: 'Venda direta' },
];

export default function MovimentacoesScreen() {
  return (
    <Screen title="Movimentacoes" description="Registro de entrada, saida e ajuste de estoque.">
      <Card style={styles.form}>
        <Text style={styles.sectionTitle}>Nova operacao</Text>
        <TextField label="Produto" placeholder="Nome do produto" />
        <View style={styles.row}>
          <TextField keyboardType="numeric" label="Quantidade" placeholder="0" style={styles.rowInput} />
          <TextField label="Tipo" placeholder="Entrada" style={styles.rowInput} />
        </View>
        <TextField label="Motivo" placeholder="Reposicao, venda, ajuste..." />
        <Button>Registrar</Button>
      </Card>

      <Text style={styles.sectionTitle}>Historico</Text>
      {movements.map((movement) => (
        <Card key={movement.id} style={styles.item}>
          <View>
            <Text style={styles.itemTitle}>{movement.produto}</Text>
            <Text style={styles.itemDetail}>{movement.motivo}</Text>
          </View>
          <View style={styles.itemRight}>
            <Text style={styles.badge}>{movement.tipo}</Text>
            <Text style={styles.quantity}>{movement.quantidade}</Text>
          </View>
        </Card>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  form: {
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
  item: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  itemRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  badge: {
    color: colors.brand500,
    fontSize: 11,
    fontWeight: '900',
  },
  quantity: {
    color: colors.slate900,
    fontSize: 16,
    fontWeight: '900',
  },
});
