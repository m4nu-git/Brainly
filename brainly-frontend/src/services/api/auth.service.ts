import { api } from "./axios";
import type { SignUpRequest, SignInRequest, SignInResponse } from "../../types/auth.types";

export const authService = {
  signUp: (data: SignUpRequest) =>
    api.post<{ message: string }>("/signup", data),

  signIn: (data: SignInRequest) =>
    api.post<SignInResponse>("/signin", data),
};
