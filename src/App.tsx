import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { CallProvider } from "./providers/CallProvider";
import { AppNavigator } from "./navigation/AppNavigator";

export default function App() {
  return (
    <SafeAreaProvider>
      <CallProvider>
        <AppNavigator />
      </CallProvider>
    </SafeAreaProvider>
  );
}
