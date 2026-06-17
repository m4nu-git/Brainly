import React, { forwardRef, useState } from 'react';
import {
  TextInput,
  TextInputProps,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { COLORS } from '@/constants/colors';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<TextInput, InputProps>(
  ({ label, error, hint, secureTextEntry, multiline, numberOfLines, style, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = secureTextEntry;

    return (
      <View style={styles.container}>
        {label && <Text style={styles.label}>{label}</Text>}
        <View
          style={[
            styles.inputWrapper,
            multiline ? styles.inputWrapperMultiline : styles.inputWrapperSingle,
            error ? styles.inputError : styles.inputDefault,
          ]}
        >
          <TextInput
            ref={ref}
            style={[styles.input, multiline && styles.inputMultiline, style]}
            placeholderTextColor={COLORS.textMuted}
            secureTextEntry={isPassword && !showPassword}
            autoCapitalize="none"
            autoCorrect={false}
            multiline={multiline}
            numberOfLines={numberOfLines}
            {...props}
          />
          {isPassword && (
            <TouchableOpacity
              onPress={() => setShowPassword((v) => !v)}
              style={styles.eyeBtn}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              {showPassword ? (
                <EyeOff size={18} color={COLORS.textMuted} />
              ) : (
                <Eye size={18} color={COLORS.textMuted} />
              )}
            </TouchableOpacity>
          )}
        </View>
        {error && <Text style={styles.error}>{error}</Text>}
        {hint && !error && <Text style={styles.hint}>{hint}</Text>}
      </View>
    );
  }
);

Input.displayName = 'Input';

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
    letterSpacing: 0.2,
  },
  inputWrapper: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1.5,
    backgroundColor: COLORS.surface,
    paddingHorizontal: 14,
  },
  inputWrapperSingle: {
    height: 48,
    alignItems: 'center',
  },
  inputWrapperMultiline: {
    minHeight: 100,
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  inputDefault: {
    borderColor: COLORS.border,
  },
  inputError: {
    borderColor: COLORS.danger,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textPrimary,
  },
  inputMultiline: {
    textAlignVertical: 'top',
    paddingTop: 0,
  },
  eyeBtn: {
    marginLeft: 8,
  },
  error: {
    fontSize: 12,
    color: COLORS.danger,
    fontWeight: '500',
  },
  hint: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
});
