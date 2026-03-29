import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { AuthProvider } from '../src/context/AuthContext';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ title: 'Login', presentation: 'modal' }} />
          <Stack.Screen name="register" options={{ title: 'Register', presentation: 'modal' }} />
          <Stack.Screen name="CreateListing" options={{ title: 'Post Free Ad' }} />
          <Stack.Screen name="ListingDetails" options={{ title: 'Vehicle Details' }} />
          <Stack.Screen name="ManageAds" options={{ title: 'Seller Dashboard' }} />
          <Stack.Screen name="SellerProfile" options={{ title: 'Seller Profile' }} />
          <Stack.Screen name="EditListing" options={{ title: 'Edit Listing' }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider>
  );
}
