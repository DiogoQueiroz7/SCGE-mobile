import { Search, TriangleAlert } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { TextField } from '@/components/ui/TextField';
import { colors, radius } from '@/constants/theme';

type Product = {
  id: number;
  codigo: string;
  nome: string;
  categoria: string;
  quantidade: number;
  minimo: number;
  unidade: string;
};

const products: Product[] = [
  { id: 1, codigo: 'PRD-001', nome: 'Item A', categoria: 'Categoria A', quantidade: 100, minimo: 20, unidade: 'un' },
  { id: 2, codigo: 'PRD-002', nome: 'Item B', categoria: 'Categoria B', quantidade: 5, minimo: 10, unidade: 'un' },
  { id: 3, codigo: 'PRD-003', nome: 'Item C', categoria: 'Categoria C', quantidade: 30, minimo: 5, unidade: 'cx' },
];

export default function InventarioScreen() {
  const [busca, setBusca] = useState('');
  const [status, setStatus] = useState<'todos' | 'baixo' | 'ok'>('todos');

  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        const matchesSearch =
          product.nome.toLowerCase().includes(busca.toLowerCase()) ||
          product.codigo.toLowerCase().includes(busca.toLowerCase());
        const isLow = product.quantidade < product.minimo;

        if (status === 'baixo') return matchesSearch && isLow;
        if (status === 'ok') return matchesSearch && !isLow;

        return matchesSearch;
      }),
    [busca, status],
  );

  const lowStock = products.filter((product) => product.quantidade < product.minimo).length;

  return (
    <Screen title="Inventario" description="Produtos em estoque, filtros e alertas de reposicao.">
      <View style={styles.summaryGrid}>
        <Card style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total de produtos</Text>
          <Text style={styles.summaryValue}>{products.length}</Text>
        </Card>
        <Card style={[styles.summaryCard, styles.warningCard]}>
          <TriangleAlert color={colors.amber500} size={20} />
          <Text style={styles.summaryLabel}>Estoque baixo</Text>
          <Text style={styles.warningValue}>{lowStock}</Text>
        </Card>
      </View>

      <Card style={styles.filters}>
        <View style={styles.searchHeader}>
          <Search color={colors.slate500} size={18} />
          <Text style={styles.filterTitle}>Filtros</Text>
        </View>
        <TextField label="Buscar" onChangeText={setBusca} placeholder="Nome ou codigo" value={busca} />
        <View style={styles.chips}>
          <FilterChip active={status === 'todos'} label="Todos" onPress={() => setStatus('todos')} />
          <FilterChip active={status === 'baixo'} label="Baixo" onPress={() => setStatus('baixo')} />
          <FilterChip active={status === 'ok'} label="Suficiente" onPress={() => setStatus('ok')} />
        </View>
      </Card>

      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>Produtos</Text>
        <Button style={styles.smallButton}>Novo</Button>
      </View>

      {filteredProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </Screen>
  );
}

function FilterChip({ active, label, onPress }: { active: boolean; label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, active ? styles.chipActive : null]}>
      <Text style={[styles.chipText, active ? styles.chipTextActive : null]}>{label}</Text>
    </Pressable>
  );
}

function ProductCard({ product }: { product: Product }) {
  const isLow = product.quantidade < product.minimo;

  return (
    <Card style={styles.productCard}>
      <View style={styles.productHeader}>
        <View>
          <Text style={styles.productCode}>{product.codigo}</Text>
          <Text style={styles.productName}>{product.nome}</Text>
        </View>
        <View style={[styles.statusPill, isLow ? styles.lowPill : styles.okPill]}>
          <Text style={[styles.statusText, isLow ? styles.lowText : styles.okText]}>
            {isLow ? 'Baixo' : 'Suficiente'}
          </Text>
        </View>
      </View>

      <View style={styles.productMeta}>
        <Text style={styles.metaText}>{product.categoria}</Text>
        <Text style={styles.metaText}>
          {product.quantidade} {product.unidade} em estoque
        </Text>
        <Text style={styles.metaText}>Minimo: {product.minimo}</Text>
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
    gap: 8,
  },
  warningCard: {
    backgroundColor: colors.amber50,
  },
  summaryLabel: {
    color: colors.slate500,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  summaryValue: {
    color: colors.brand500,
    fontSize: 28,
    fontWeight: '900',
  },
  warningValue: {
    color: colors.amber700,
    fontSize: 28,
    fontWeight: '900',
  },
  filters: {
    gap: 12,
  },
  searchHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  filterTitle: {
    color: colors.slate900,
    fontSize: 16,
    fontWeight: '800',
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
  listHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  listTitle: {
    color: colors.slate900,
    fontSize: 18,
    fontWeight: '900',
  },
  smallButton: {
    minHeight: 40,
  },
  productCard: {
    gap: 12,
  },
  productHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  productCode: {
    color: colors.slate500,
    fontSize: 12,
    fontWeight: '800',
  },
  productName: {
    color: colors.slate900,
    fontSize: 18,
    fontWeight: '900',
  },
  statusPill: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  lowPill: {
    backgroundColor: colors.red50,
  },
  okPill: {
    backgroundColor: colors.green50,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '900',
  },
  lowText: {
    color: colors.red700,
  },
  okText: {
    color: colors.green700,
  },
  productMeta: {
    gap: 4,
  },
  metaText: {
    color: colors.slate500,
    fontSize: 13,
    fontWeight: '600',
  },
});
