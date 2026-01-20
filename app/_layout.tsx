import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'none'
          }}
          initialRouteName="index"
        >
            <Stack.Screen name="index" />
            <Stack.Screen name="tactical-lineup" />
            <Stack.Screen name="squad-management" />
            <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        </Stack>
      <StatusBar style="light" />
    </ThemeProvider>
  );
}
