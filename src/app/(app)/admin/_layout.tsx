import { Redirect, Stack } from 'expo-router';

import { useAuth } from '@/providers/AuthProvider';

export default function AdminLayout() {
  const { user } = useAuth();

  if (user && user.role !== 'Administrador') {
    return <Redirect href="/dashboard" />;
  }

  return (
    <Stack
      screenOptions={{
        headerBackTitle: 'Voltar',
        headerTitleAlign: 'center',
      }}
    />
  );
}
