import { Search, TriangleAlert } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Feedback } from '@/components/ui/Feedback';
import { TextField } from '@/components/ui/TextField';
import { colors, radius } from '@/constants/theme';
import { Product, ProductStatus, useData } from '@/providers/DataProvider';

type StockFilter = 'todos' | 'baixo' | 'suficiente';
type FormState = {
  codigo: string;
  nome: string;
  categoria: string;
  quantidade: string;
  minimo: string;
  unidade: string;
};
type FeedbackState = {
  type: 'success' | 'error' | 'warning';
  message: string;
};

const emptyForm: FormState = {
  codigo: '',
  nome: '',
  categoria: '',
  quantidade: '',
  minimo: '',
  unidade: 'un',
};

function normalize(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export default function InventarioScreen() {
  const { addProduct, products, setProductStatus, updateProduct } = useData();
  const [busca, setBusca] = useState('');
  const [stockFilter, setStockFilter] = useState<StockFilter>('todos');
  const [categoryFilter, setCategoryFilter] = useState('todas');
  const [statusFilter, setStatusFilter] = useState<'todos' | ProductStatus>('ativo');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);

  const categories = useMemo(
    () => Array.from(new Set(products.map((product) => product.categoria))).sort(),
    [products],
  );

  const filteredProducts = useMemo(() => {
    const query = normalize(busca);

    return products.filter((product) => {
      const matchesSearch =
        normalize(product.nome).includes(query) ||
        normalize(product.codigo).includes(query) ||
        normalize(product.categoria).includes(query);
      const isLow = product.quantidade < product.minimo;
      const matchesStock =
        stockFilter === 'todos' || (stockFilter === 'baixo' ? isLow : product.quantidade >= product.minimo);
      const matchesCategory = categoryFilter === 'todas' || product.categoria === categoryFilter;
      const matchesStatus = statusFilter === 'todos' || product.status === statusFilter;

      return matchesSearch && matchesStock && matchesCategory && matchesStatus;
    });
  }, [busca, categoryFilter, products, statusFilter, stockFilter]);

  const activeProducts = products.filter((product) => product.status === 'ativo');
  const lowStock = activeProducts.filter((product) => product.quantidade < product.minimo).length;

  function updateField(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingProduct(null);
    setShowForm(false);
  }

  function handleNewProduct() {
    setFeedback(null);
    setEditingProduct(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function handleEditProduct(product: Product) {
    setFeedback(null);
    setEditingProduct(product);
    setForm({
      codigo: product.codigo,
      nome: product.nome,
      categoria: product.categoria,
      quantidade: String(product.quantidade),
      minimo: String(product.minimo),
      unidade: product.unidade,
    });
    setShowForm(true);
  }

  function handleSubmit() {
    const quantidade = Number(form.quantidade);
    const minimo = Number(form.minimo);

    if (!form.codigo.trim() || !form.nome.trim() || !form.categoria.trim()) {
      setFeedback({ type: 'warning', message: 'Preencha codigo, nome e categoria do produto.' });
      return;
    }

    if (!Number.isFinite(quantidade) || quantidade < 0 || !Number.isFinite(minimo) || minimo < 0) {
      setFeedback({ type: 'error', message: 'Quantidade e estoque minimo precisam ser numeros validos.' });
      return;
    }

    const payload = {
      codigo: form.codigo.trim(),
      nome: form.nome.trim(),
      categoria: form.categoria.trim(),
      quantidade,
      minimo,
      unidade: form.unidade.trim() || 'un',
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, payload);
      setFeedback({ type: 'success', message: 'Produto atualizado no inventario local.' });
    } else {
      addProduct(payload);
      setFeedback({ type: 'success', message: 'Produto cadastrado no inventario local.' });
    }

    resetForm();
  }

  function clearFilters() {
    setBusca('');
    setStockFilter('todos');
    setCategoryFilter('todas');
    setStatusFilter('ativo');
  }

  return (
    <Screen title="Inventario" description="Produtos em estoque, filtros e alertas de reposicao.">
      <View style={styles.summaryGrid}>
        <Card style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Produtos ativos</Text>
          <Text style={styles.summaryValue}>{activeProducts.length}</Text>
        </Card>
        <Card style={[styles.summaryCard, styles.warningCard]}>
          <TriangleAlert color={colors.amber500} size={20} />
          <Text style={styles.summaryLabel}>Estoque baixo</Text>
          <Text style={styles.warningValue}>{lowStock}</Text>
        </Card>
      </View>

      <Feedback type={feedback?.type ?? 'success'} message={feedback?.message} />

      <Card style={styles.filters}>
        <View style={styles.searchHeader}>
          <Search color={colors.slate500} size={18} />
          <Text style={styles.filterTitle}>Filtros</Text>
        </View>
        <TextField label="Buscar" onChangeText={setBusca} placeholder="Nome, codigo ou categoria" value={busca} />
        <View style={styles.chips}>
          <FilterChip active={stockFilter === 'todos'} label="Todos" onPress={() => setStockFilter('todos')} />
          <FilterChip active={stockFilter === 'baixo'} label="Baixo" onPress={() => setStockFilter('baixo')} />
          <FilterChip
            active={stockFilter === 'suficiente'}
            label="Suficiente"
            onPress={() => setStockFilter('suficiente')}
          />
        </View>
        <View style={styles.chips}>
          <FilterChip active={statusFilter === 'ativo'} label="Ativos" onPress={() => setStatusFilter('ativo')} />
          <FilterChip active={statusFilter === 'inativo'} label="Inativos" onPress={() => setStatusFilter('inativo')} />
          <FilterChip active={statusFilter === 'todos'} label="Todos status" onPress={() => setStatusFilter('todos')} />
        </View>
        <View style={styles.chips}>
          <FilterChip active={categoryFilter === 'todas'} label="Todas categorias" onPress={() => setCategoryFilter('todas')} />
          {categories.map((category) => (
            <FilterChip
              key={category}
              active={categoryFilter === category}
              label={category}
              onPress={() => setCategoryFilter(category)}
            />
          ))}
        </View>
      </Card>

      <View style={styles.listHeader}>
        <View>
          <Text style={styles.listTitle}>Produtos</Text>
          <Text style={styles.listSubtitle}>{filteredProducts.length} resultado(s)</Text>
        </View>
        <Button style={styles.smallButton} onPress={handleNewProduct}>
          Novo
        </Button>
      </View>

      {showForm ? (
        <Card style={styles.form}>
          <Text style={styles.formTitle}>{editingProduct ? 'Editar produto' : 'Novo produto'}</Text>
          <TextField label="Codigo" onChangeText={(value) => updateField('codigo', value)} value={form.codigo} />
          <TextField label="Nome" onChangeText={(value) => updateField('nome', value)} value={form.nome} />
          <TextField label="Categoria" onChangeText={(value) => updateField('categoria', value)} value={form.categoria} />
          <View style={styles.row}>
            <TextField
              keyboardType="numeric"
              label="Quantidade"
              onChangeText={(value) => updateField('quantidade', value)}
              style={styles.rowInput}
              value={form.quantidade}
            />
            <TextField
              keyboardType="numeric"
              label="Minimo"
              onChangeText={(value) => updateField('minimo', value)}
              style={styles.rowInput}
              value={form.minimo}
            />
          </View>
          <TextField label="Unidade" onChangeText={(value) => updateField('unidade', value)} value={form.unidade} />
          <View style={styles.actions}>
            <Button style={styles.actionButton} onPress={handleSubmit}>
              {editingProduct ? 'Salvar' : 'Cadastrar'}
            </Button>
            <Button style={styles.actionButton} variant="secondary" onPress={resetForm}>
              Cancelar
            </Button>
          </View>
        </Card>
      ) : null}

      {filteredProducts.length ? (
        filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            onEdit={() => handleEditProduct(product)}
            onToggleStatus={() => setProductStatus(product.id, product.status === 'ativo' ? 'inativo' : 'ativo')}
            product={product}
          />
        ))
      ) : (
        <Card style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>Nenhum produto encontrado</Text>
          <Text style={styles.emptyText}>Ajuste a busca ou limpe os filtros para ver todo o inventario.</Text>
          <Button variant="secondary" onPress={clearFilters}>
            Limpar filtros
          </Button>
        </Card>
      )}
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

function ProductCard({
  onEdit,
  onToggleStatus,
  product,
}: {
  onEdit: () => void;
  onToggleStatus: () => void;
  product: Product;
}) {
  const isLow = product.quantidade < product.minimo;

  return (
    <Card style={styles.productCard}>
      <View style={styles.productHeader}>
        <View style={styles.productTitleArea}>
          <Text style={styles.productCode}>{product.codigo}</Text>
          <Text style={styles.productName}>{product.nome}</Text>
        </View>
        <View
          style={[
            styles.statusPill,
            product.status === 'inativo' ? styles.inactivePill : isLow ? styles.lowPill : styles.okPill,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              product.status === 'inativo' ? styles.inactiveText : isLow ? styles.lowText : styles.okText,
            ]}
          >
            {product.status === 'inativo' ? 'Inativo' : isLow ? 'Baixo' : 'Suficiente'}
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

      <View style={styles.actions}>
        <Button style={styles.actionButton} variant="secondary" onPress={onEdit}>
          Editar
        </Button>
        <Button
          style={styles.actionButton}
          variant={product.status === 'ativo' ? 'danger' : 'secondary'}
          onPress={onToggleStatus}
        >
          {product.status === 'ativo' ? 'Inativar' : 'Ativar'}
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
  listSubtitle: {
    color: colors.slate500,
    fontSize: 13,
    marginTop: 2,
  },
  smallButton: {
    minHeight: 40,
  },
  form: {
    gap: 12,
  },
  formTitle: {
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
  productCard: {
    gap: 12,
  },
  productHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  productTitleArea: {
    flex: 1,
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
  inactivePill: {
    backgroundColor: colors.slate100,
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
  inactiveText: {
    color: colors.slate500,
  },
  productMeta: {
    gap: 4,
  },
  metaText: {
    color: colors.slate500,
    fontSize: 13,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
  },
  emptyCard: {
    gap: 12,
  },
  emptyTitle: {
    color: colors.slate900,
    fontSize: 17,
    fontWeight: '900',
  },
  emptyText: {
    color: colors.slate500,
    fontSize: 14,
    lineHeight: 20,
  },
});
