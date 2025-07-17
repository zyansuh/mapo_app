import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppNavigator } from "./src/navigation/AppNavigator";
import { CallProvider } from "./src/providers/CallProvider";

export default function App() {
  return (
    <SafeAreaProvider>
      <CallProvider>
        <StatusBar style="light" />
        <AppNavigator />
      </CallProvider>
    </SafeAreaProvider>
  );
}
