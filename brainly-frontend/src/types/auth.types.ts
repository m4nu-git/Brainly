export interface SignUpRequest {
  username: string;
  password: string;
}

export interface SignInRequest {
  username: string;
  password: string;
}

export interface SignInResponse {
  message: string;
  username: string;
  token: string;
}

export interface AuthState {
  token: string | null;
  username: string | null;
  isAuthenticated: boolean;
}
