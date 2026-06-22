import { PropsWithChildren, createContext, useCallback, useContext, useMemo, useState } from 'react';

export type ProductStatus = 'ativo' | 'inativo';
export type MovementType = 'entrada' | 'saida' | 'ajuste';
export type ReportStatus = 'Pronto' | 'Processando';
export type UserStatus = 'ativo' | 'inativo';
export type RoleStatus = 'ativo' | 'inativo';

export type Product = {
  id: string;
  codigo: string;
  nome: string;
  categoria: string;
  quantidade: number;
  minimo: number;
  unidade: string;
  status: ProductStatus;
};

export type Movement = {
  id: string;
  tipo: MovementType;
  produtoId: string;
  produtoNome: string;
  quantidade: number;
  motivo: string;
  data: string;
};

export type Report = {
  id: string;
  nome: string;
  tipo: string;
  periodo: string;
  status: ReportStatus;
  criadoEm: string;
  resumo: string;
};

export type AppUser = {
  id: string;
  nome: string;
  email: string;
  perfil: string;
  status: UserStatus;
};

export type Role = {
  id: string;
  nome: string;
  descricao: string;
  permissoes: string[];
  status: RoleStatus;
};

type ProductDraft = Omit<Product, 'id' | 'status'> & {
  status?: ProductStatus;
};

type MovementDraft = {
  tipo: MovementType;
  produtoId: string;
  quantidade: number;
  motivo: string;
};

type ReportDraft = {
  nome: string;
  tipo: string;
  periodo: string;
};

type UserDraft = Omit<AppUser, 'id' | 'status'> & {
  status?: UserStatus;
};

type RoleDraft = Omit<Role, 'id' | 'status'> & {
  status?: RoleStatus;
};

type DataContextData = {
  products: Product[];
  movements: Movement[];
  reports: Report[];
  users: AppUser[];
  roles: Role[];
  addProduct: (input: ProductDraft) => void;
  updateProduct: (id: string, input: ProductDraft) => void;
  setProductStatus: (id: string, status: ProductStatus) => void;
  addMovement: (input: MovementDraft) => void;
  createReport: (input: ReportDraft) => void;
  addUser: (input: UserDraft) => void;
  updateUser: (id: string, input: UserDraft) => void;
  setUserStatus: (id: string, status: UserStatus) => void;
  addRole: (input: RoleDraft) => void;
  updateRole: (id: string, input: RoleDraft) => void;
  setRoleStatus: (id: string, status: RoleStatus) => void;
};

const initialProducts: Product[] = [
  {
    id: 'prd-001',
    codigo: 'PRD-001',
    nome: 'Monitor Dell 27"',
    categoria: 'Equipamentos',
    quantidade: 24,
    minimo: 8,
    unidade: 'un',
    status: 'ativo',
  },
  {
    id: 'prd-002',
    codigo: 'PRD-002',
    nome: 'Teclado mecanico',
    categoria: 'Perifericos',
    quantidade: 5,
    minimo: 10,
    unidade: 'un',
    status: 'ativo',
  },
  {
    id: 'prd-003',
    codigo: 'PRD-003',
    nome: 'Cabo HDMI 2m',
    categoria: 'Cabos',
    quantidade: 72,
    minimo: 20,
    unidade: 'un',
    status: 'ativo',
  },
  {
    id: 'prd-004',
    codigo: 'PRD-004',
    nome: 'Notebook suporte interno',
    categoria: 'Equipamentos',
    quantidade: 2,
    minimo: 4,
    unidade: 'un',
    status: 'inativo',
  },
];

const initialMovements: Movement[] = [
  {
    id: 'mov-001',
    tipo: 'entrada',
    produtoId: 'prd-001',
    produtoNome: 'Monitor Dell 27"',
    quantidade: 10,
    motivo: 'Reposicao inicial',
    data: '22/06/2026 09:10',
  },
  {
    id: 'mov-002',
    tipo: 'saida',
    produtoId: 'prd-002',
    produtoNome: 'Teclado mecanico',
    quantidade: 2,
    motivo: 'Entrega para laboratorio',
    data: '22/06/2026 10:25',
  },
  {
    id: 'mov-003',
    tipo: 'ajuste',
    produtoId: 'prd-003',
    produtoNome: 'Cabo HDMI 2m',
    quantidade: 72,
    motivo: 'Conferencia de inventario',
    data: '22/06/2026 11:40',
  },
];

const initialReports: Report[] = [
  {
    id: 'REL-001',
    nome: 'Estoque geral',
    tipo: 'Inventario',
    periodo: 'Ultimos 30 dias',
    status: 'Pronto',
    criadoEm: '22/06/2026 08:30',
    resumo: 'Produtos ativos, itens inativos e alertas de estoque baixo.',
  },
  {
    id: 'REL-002',
    nome: 'Movimentacoes da semana',
    tipo: 'Movimentacoes',
    periodo: 'Semana atual',
    status: 'Pronto',
    criadoEm: '22/06/2026 09:45',
    resumo: 'Entradas, saidas e ajustes consolidados para conferencia.',
  },
];

const initialRoles: Role[] = [
  {
    id: 'role-admin',
    nome: 'Administrador',
    descricao: 'Acesso total ao estoque, usuarios, perfis e relatorios.',
    permissoes: ['Produtos', 'Movimentacoes', 'Relatorios', 'Usuarios', 'Perfis'],
    status: 'ativo',
  },
  {
    id: 'role-operador',
    nome: 'Operador',
    descricao: 'Cadastro de produtos e registro das movimentacoes do estoque.',
    permissoes: ['Produtos', 'Movimentacoes'],
    status: 'ativo',
  },
  {
    id: 'role-consulta',
    nome: 'Consulta',
    descricao: 'Visualizacao de inventario, dashboard e relatorios.',
    permissoes: ['Inventario', 'Relatorios'],
    status: 'ativo',
  },
];

const initialUsers: AppUser[] = [
  {
    id: 'user-admin',
    nome: 'Administrador SCGE',
    email: 'admin@scge.com',
    perfil: 'Administrador',
    status: 'ativo',
  },
  {
    id: 'user-operador',
    nome: 'Operador Estoque',
    email: 'operador@scge.com',
    perfil: 'Operador',
    status: 'ativo',
  },
  {
    id: 'user-consulta',
    nome: 'Consulta Relatorios',
    email: 'consulta@scge.com',
    perfil: 'Consulta',
    status: 'inativo',
  },
];

const DataContext = createContext<DataContextData | null>(null);

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`;
}

function nowLabel() {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date());
}

export function DataProvider({ children }: PropsWithChildren) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [movements, setMovements] = useState<Movement[]>(initialMovements);
  const [reports, setReports] = useState<Report[]>(initialReports);
  const [users, setUsers] = useState<AppUser[]>(initialUsers);
  const [roles, setRoles] = useState<Role[]>(initialRoles);

  const addProduct = useCallback((input: ProductDraft) => {
    setProducts((current) => [
      {
        ...input,
        id: createId('prd'),
        status: input.status ?? 'ativo',
      },
      ...current,
    ]);
  }, []);

  const updateProduct = useCallback((id: string, input: ProductDraft) => {
    setProducts((current) =>
      current.map((product) =>
        product.id === id
          ? {
              ...product,
              ...input,
              status: input.status ?? product.status,
            }
          : product,
      ),
    );
  }, []);

  const setProductStatus = useCallback((id: string, status: ProductStatus) => {
    setProducts((current) => current.map((product) => (product.id === id ? { ...product, status } : product)));
  }, []);

  const addMovement = useCallback(
    (input: MovementDraft) => {
      const product = products.find((item) => item.id === input.produtoId);

      if (!product) return;

      const normalizedQuantity = Math.max(0, input.quantidade);
      const nextQuantity =
        input.tipo === 'entrada'
          ? product.quantidade + normalizedQuantity
          : input.tipo === 'saida'
            ? Math.max(0, product.quantidade - normalizedQuantity)
            : normalizedQuantity;

      setProducts((current) =>
        current.map((item) => (item.id === product.id ? { ...item, quantidade: nextQuantity } : item)),
      );
      setMovements((current) => [
        {
          id: createId('mov'),
          tipo: input.tipo,
          produtoId: product.id,
          produtoNome: product.nome,
          quantidade: normalizedQuantity,
          motivo: input.motivo,
          data: nowLabel(),
        },
        ...current,
      ]);
    },
    [products],
  );

  const createReport = useCallback(
    (input: ReportDraft) => {
      const lowStock = products.filter((product) => product.status === 'ativo' && product.quantidade < product.minimo)
        .length;
      const movementCount = movements.length;

      setReports((current) => [
        {
          id: `REL-${String(current.length + 1).padStart(3, '0')}`,
          nome: input.nome,
          tipo: input.tipo,
          periodo: input.periodo,
          status: 'Pronto',
          criadoEm: nowLabel(),
          resumo: `${products.length} produtos, ${movementCount} movimentacoes e ${lowStock} alertas de estoque baixo.`,
        },
        ...current,
      ]);
    },
    [movements.length, products],
  );

  const addUser = useCallback((input: UserDraft) => {
    setUsers((current) => [
      {
        ...input,
        id: createId('user'),
        status: input.status ?? 'ativo',
      },
      ...current,
    ]);
  }, []);

  const updateUser = useCallback((id: string, input: UserDraft) => {
    setUsers((current) =>
      current.map((user) =>
        user.id === id
          ? {
              ...user,
              ...input,
              status: input.status ?? user.status,
            }
          : user,
      ),
    );
  }, []);

  const setUserStatus = useCallback((id: string, status: UserStatus) => {
    setUsers((current) => current.map((user) => (user.id === id ? { ...user, status } : user)));
  }, []);

  const addRole = useCallback((input: RoleDraft) => {
    setRoles((current) => [
      {
        ...input,
        id: createId('role'),
        status: input.status ?? 'ativo',
      },
      ...current,
    ]);
  }, []);

  const updateRole = useCallback((id: string, input: RoleDraft) => {
    setRoles((current) =>
      current.map((role) =>
        role.id === id
          ? {
              ...role,
              ...input,
              status: input.status ?? role.status,
            }
          : role,
      ),
    );
  }, []);

  const setRoleStatus = useCallback((id: string, status: RoleStatus) => {
    setRoles((current) => current.map((role) => (role.id === id ? { ...role, status } : role)));
  }, []);

  const value = useMemo(
    () => ({
      products,
      movements,
      reports,
      users,
      roles,
      addProduct,
      updateProduct,
      setProductStatus,
      addMovement,
      createReport,
      addUser,
      updateUser,
      setUserStatus,
      addRole,
      updateRole,
      setRoleStatus,
    }),
    [
      addMovement,
      addProduct,
      addRole,
      addUser,
      createReport,
      movements,
      products,
      reports,
      roles,
      setProductStatus,
      setRoleStatus,
      setUserStatus,
      updateProduct,
      updateRole,
      updateUser,
      users,
    ],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);

  if (!context) {
    throw new Error('useData precisa ser usado dentro de DataProvider.');
  }

  return context;
}
