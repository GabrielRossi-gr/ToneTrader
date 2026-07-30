import { Stack } from 'expo-router';

import { ProjetosProvider } from '../context/ProjetosContext';

export default function RootLayout() {
  return (
    <ProjetosProvider>
      <Stack
        screenOptions={{
          contentStyle: {
            backgroundColor: '#040404',
          },
        }}
      >
        <Stack.Screen
          name="tabs"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="projeto/[id]"
          options={{
            headerShown: true,
            headerBackButtonDisplayMode: 'minimal',
            headerStyle: {
              backgroundColor: '#040404',
            },
            headerTintColor: '#FFFFFF',
            headerTitleStyle: {
              fontWeight: '600',
            },
            headerShadowVisible: false,
          }}
        />
      </Stack>
    </ProjetosProvider>
  );
}