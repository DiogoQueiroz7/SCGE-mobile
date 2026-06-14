import Constants from 'expo-constants';

type ApiOptions = RequestInit & {
  token?: string | null;
};

const fallbackApiUrl = 'http://127.0.0.1:8000';

export const API_BASE_URL =
  String(Constants.expoConfig?.extra?.apiUrl ?? fallbackApiUrl).replace(/\/$/, '');

export async function apiRequest<T>(path: string, options: ApiOptions = {}) {
  const { token, headers, ...requestOptions } = options;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    ...requestOptions,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok || data?.success === false) {
    const message =
      data?.error?.message ??
      data?.message ??
      data?.detail ??
      'Nao foi possivel concluir a operacao.';

    throw new Error(message);
  }

  return data as T;
}
