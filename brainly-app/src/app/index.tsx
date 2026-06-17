import { Redirect } from 'expo-router';
import { useAuthStore } from '@/store/authStore';

export default function RootIndex() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return <Redirect href={isAuthenticated ? '/(app)' : '/(auth)/signin'} />;
}
