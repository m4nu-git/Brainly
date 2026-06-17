import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { Input } from './Input';
import { COLORS } from '@/constants/colors';

interface FieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  hint?: string;
  multiline?: boolean;
  numberOfLines?: number;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: 'default' | 'email-address' | 'url' | 'numeric';
}

export function Field<T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  secureTextEntry,
  hint,
  multiline,
  numberOfLines,
  autoCapitalize,
  keyboardType,
}: FieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <View>
          <Input
            label={label}
            placeholder={placeholder}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={error?.message}
            hint={hint}
            secureTextEntry={secureTextEntry}
            multiline={multiline}
            numberOfLines={numberOfLines}
            autoCapitalize={autoCapitalize}
            keyboardType={keyboardType}
          />
        </View>
      )}
    />
  );
}
