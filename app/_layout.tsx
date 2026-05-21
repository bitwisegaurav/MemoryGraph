import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from '../src/contexts/ThemeContext';
import React, { useEffect } from 'react';
import { ShareIntentProvider, useShareIntentContext } from 'expo-share-intent';

function Layout() {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const { hasShareIntent, shareIntent, resetShareIntent, error } = useShareIntentContext();

  useEffect(() => {
    if (hasShareIntent && (shareIntent.text || shareIntent.webUrl)) {
      const sharedContent = shareIntent.webUrl || shareIntent.text;
      console.log('Share intent received:', shareIntent);

      // Navigate to add screen with the shared content
      router.push({
        pathname: '/(tabs)/add',
        params: { url: sharedContent }
      });

      // Reset the share intent so it doesn't trigger again
      resetShareIntent();
    }
  }, [hasShareIntent, shareIntent, router, resetShareIntent]);

  if (error) {
    console.error('Share intent error:', error);
  }

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: colors.background,
        }}
      >
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen
            name="(tabs)"
            options={{ headerShown: false }}
          />
        </Stack>
      </SafeAreaView>
    </>
  );
}

export default function RootLayout() {
  return (
    <ShareIntentProvider>
      <ThemeProvider>
        <Layout />
      </ThemeProvider>
    </ShareIntentProvider>
  );
}
