export type UserRole = 'Administrador' | 'Operador' | 'Usuario' | string;

export type SessionUser = {
  id: string;
  nome: string;
  email: string;
  role: UserRole;
};

export type AuthContextData = {
  user: SessionUser | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, senha: string) => Promise<void>;
  signInDemo: () => Promise<void>;
  signOut: () => Promise<void>;
};
