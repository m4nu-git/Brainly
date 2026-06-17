import React from 'react';
import { Tabs, Redirect } from 'expo-router';
import { Brain, Tag, Settings } from 'lucide-react-native';
import { useAuthStore } from '@/store/authStore';
import { SheetProvider } from '@/components/sheets/SheetProvider';
import { COLORS } from '@/constants/colors';

export default function AppLayout() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/signin" />;
  }

  return (
    <SheetProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.textMuted,
          tabBarStyle: {
            backgroundColor: COLORS.surface,
            borderTopColor: COLORS.border,
            borderTopWidth: 1,
            elevation: 0,
            shadowOpacity: 0,
            paddingTop: 6,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarLabel: 'Brain',
            tabBarIcon: ({ color, size }) => <Brain size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="tags"
          options={{
            tabBarLabel: 'Tags',
            tabBarIcon: ({ color, size }) => <Tag size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            tabBarLabel: 'Settings',
            tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
          }}
        />
      </Tabs>
    </SheetProvider>
  );
}
