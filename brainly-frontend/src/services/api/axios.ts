import axios, { type AxiosError } from "axios";
import { API_BASE_URL } from "../../constants/routes";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("brainly_token");
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message: string }>) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("brainly_token");
      localStorage.removeItem("brainly_username");
      window.location.href = "/signin";
    }
    return Promise.reject(error);
  }
);
