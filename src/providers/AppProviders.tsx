import { PropsWithChildren } from 'react';

import { AuthProvider } from './AuthProvider';
import { DataProvider } from './DataProvider';
import { QueryProvider } from './QueryProvider';

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <QueryProvider>
      <AuthProvider>
        <DataProvider>{children}</DataProvider>
      </AuthProvider>
    </QueryProvider>
  );
}
