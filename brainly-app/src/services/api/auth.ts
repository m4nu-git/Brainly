import { apiClient } from './client';

export interface SignInPayload {
  username: string;
  password: string;
}

export interface SignUpPayload {
  username: string;
  password: string;
}

export interface SignInResponse {
  message: string;
  username: string;
  token: string;
}

export const authApi = {
  signUp: (payload: SignUpPayload) =>
    apiClient.post<{ message: string }>('/signup', payload),

  signIn: (payload: SignInPayload) =>
    apiClient.post<SignInResponse>('/signin', payload),
};
