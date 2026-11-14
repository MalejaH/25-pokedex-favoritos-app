import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SessionProvider } from "@/src/session/SessionProvider";
import { colores } from "@/src/theme";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SessionProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: colores.fondo },
            headerTintColor: colores.texto,
            contentStyle: { backgroundColor: colores.fondo },
            headerTitleStyle: { fontWeight: "800" },
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="pokemon/[id]" options={{ title: "Ficha Pokémon" }} />
        </Stack>
      </SessionProvider>
    </GestureHandlerRootView>
  );
}
