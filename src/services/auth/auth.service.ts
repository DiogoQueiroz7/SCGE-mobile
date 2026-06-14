import { apiRequest } from '@/services/api/client';

type LoginResponse = {
  success: boolean;
  data: {
    access_token: string;
    token_type: string;
  };
};

export async function loginApi(email: string, senha: string) {
  return apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, senha }),
  });
}
