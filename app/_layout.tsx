import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import "react-native-reanimated";

import LoadingScreen, {
  ActionLoaderOverlay,
  ToastBanner,
} from "../components/LoadingScreen";
import { Colors } from "../constants/theme";
import {
  SubscriptionProvider,
  useSubscriptions,
} from "../context/SubscriptionContext";

// Keep native splash screen visible until React mounts
SplashScreen.preventAutoHideAsync().catch(() => {});

const StopscriptionTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: Colors.background,
    card: Colors.card,
    primary: Colors.primary,
    text: Colors.textPrimary,
  },
};

function AppNavigator() {
  const { isHydrating, actionLoadingLabel, toast, dismissToast } =
    useSubscriptions();
  const [showSplashOverlay, setShowSplashOverlay] = useState(true);

  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  return (
    <View style={styles.outerBackdrop}>
      <View
        style={[
          styles.appShell,
          Platform.OS === "web" && styles.webMobileFrame,
        ]}
      >
        {!isHydrating ? (
          <Stack
            screenOptions={{
              headerShown: false,
              animation: "fade",
              contentStyle: { backgroundColor: Colors.background },
            }}
          >
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen
              name="(auth)/login"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="(auth)/register"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="(auth)/forgot-password"
              options={{ headerShown: false }}
            />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        ) : null}

        {/* Global Floating Toast with Optional Undo */}
        {toast ? (
          <ToastBanner
            message={toast.message}
            undoLabel={toast.undoLabel}
            onUndo={toast.onUndo}
            onDismiss={dismissToast}
          />
        ) : null}

        {/* Global Action Loading Overlay (Login, Save Trial, etc.) */}
        <ActionLoaderOverlay
          visible={Boolean(actionLoadingLabel)}
          label={actionLoadingLabel || undefined}
        />

        {/* Layered Shining Shield Splash Overlay — cross-fades directly over the mounted screen */}
        {showSplashOverlay ? (
          <LoadingScreen onFinish={() => setShowSplashOverlay(false)} />
        ) : null}
      </View>
    </View>
  );
}

export default function RootLayout() {
  return (
    <SubscriptionProvider>
      <ThemeProvider value={StopscriptionTheme}>
        <AppNavigator />
        <StatusBar style="light" backgroundColor={Colors.background} />
      </ThemeProvider>
    </SubscriptionProvider>
  );
}

const styles = StyleSheet.create({
  outerBackdrop: {
    flex: 1,
    backgroundColor: "#050806",
    alignItems: "center",
    justifyContent: "center",
  },
  appShell: {
    flex: 1,
    width: "100%",
    backgroundColor: Colors.background,
    overflow: "hidden",
  },
  webMobileFrame: {
    maxWidth: 460,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#181C1A",
  },
});
