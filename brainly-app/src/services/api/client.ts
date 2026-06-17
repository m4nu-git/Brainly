import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

function getBaseUrl(): string {
  if (__DEV__) {
    // Expo Go / dev client: hostUri is "192.168.x.x:8081" — same machine hosts the backend
    const hostUri = Constants.expoConfig?.hostUri;
    if (hostUri) {
      const ip = hostUri.split(':')[0];
      return `http://${ip}:3000/api/v1`;
    }
    // Android emulator: host machine is 10.0.2.2
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:3000/api/v1';
    }
    // iOS Simulator: localhost works fine
    return 'http://localhost:3000/api/v1';
  }
  // Production: set EXPO_PUBLIC_API_URL in your .env
  return process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000/api/v1';
}

const API_BASE_URL = getBaseUrl();

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

apiClient.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('auth_token');
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync('auth_token');
      await SecureStore.deleteItemAsync('auth_username');
      // Lazy import avoids circular dependency
      const { useAuthStore } = await import('@/store/authStore');
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);
