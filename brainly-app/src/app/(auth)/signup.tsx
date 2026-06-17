import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, router } from 'expo-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Brain } from 'lucide-react-native';
import { signUpSchema, SignUpFormValues } from '@/schemas';
import { authApi } from '@/services/api/auth';
import { COLORS } from '@/constants/colors';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { mapServerErrors } from '@/utils/formatters';

export default function SignUpScreen() {
  const {
    control,
    handleSubmit,
    setError,
    formState: { isSubmitting },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { username: '', password: '' },
  });

  const onSubmit = async (data: SignUpFormValues) => {
    try {
      await authApi.signUp(data);
      router.replace('/(auth)/signin');
      Alert.alert('Account created!', 'You can now sign in.');
    } catch (err: any) {
      const apiErr = err?.response?.data;
      if (apiErr?.errors) {
        mapServerErrors(apiErr.errors, setError as any);
      } else {
        Alert.alert('Sign Up Failed', apiErr?.message ?? 'Something went wrong');
      }
    }
  };

  return (
    <LinearGradient
      colors={['#5046e4', '#3730a3', '#1e1b4b']}
      style={styles.gradient}
    >
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logoWrap}>
            <View style={styles.logoIcon}>
              <Brain size={32} color={COLORS.primary} />
            </View>
            <Text style={styles.logoText}>Brainly</Text>
            <Text style={styles.tagline}>Your second brain</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.heading}>Create account</Text>
            <Text style={styles.subheading}>Start building your second brain</Text>

            <Field
              name="username"
              control={control}
              label="Username"
              placeholder="johndoe"
              autoCapitalize="none"
            />
            <Field
              name="password"
              control={control}
              label="Password"
              placeholder="••••••••"
              secureTextEntry
              hint="Min 8 chars · uppercase · number · special character"
            />

            <Button
              label="Create Account"
              onPress={handleSubmit(onSubmit)}
              loading={isSubmitting}
              fullWidth
              style={styles.submitBtn}
            />

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <Link href="/(auth)/signin" asChild>
                <TouchableOpacity>
                  <Text style={styles.footerLink}>Sign in</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  flex: { flex: 1 },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    gap: 32,
  },
  logoWrap: { alignItems: 'center', gap: 10 },
  logoIcon: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: { fontSize: 32, fontWeight: '800', color: '#fff', letterSpacing: -0.5 },
  tagline: { fontSize: 14, color: 'rgba(255,255,255,0.7)' },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: 24,
    gap: 16,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  heading: { fontSize: 22, fontWeight: '700', color: COLORS.textPrimary },
  subheading: { fontSize: 14, color: COLORS.textMuted, marginTop: -8 },
  submitBtn: { marginTop: 4 },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  footerText: { fontSize: 14, color: COLORS.textMuted },
  footerLink: { fontSize: 14, color: COLORS.primary, fontWeight: '600' },
});
