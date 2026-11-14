import { Redirect, Tabs } from "expo-router";
import { Text, type ColorValue } from "react-native";
import { useSession } from "@/src/session/SessionProvider";
import { colores } from "@/src/theme";

function TabIcon({ icono, color }: { icono: string; color: ColorValue }) {
  return <Text style={{ color, fontSize: 20 }}>{icono}</Text>;
}

export default function TabsLayout() {
  const { session, loading } = useSession();

  if (loading) {
    return null;
  }
  if (session === null) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colores.marca,
        tabBarInactiveTintColor: colores.textoSuave,
        tabBarStyle: {
          backgroundColor: colores.panel,
          borderTopColor: colores.borde,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Pokédex",
          tabBarIcon: ({ color }) => <TabIcon icono="◉" color={color} />,
        }}
      />
      <Tabs.Screen
        name="favoritos"
        options={{
          title: "Favoritos",
          tabBarIcon: ({ color }) => <TabIcon icono="♥" color={color} />,
        }}
      />
      <Tabs.Screen
        name="equipo"
        options={{
          title: "Equipo",
          tabBarIcon: ({ color }) => <TabIcon icono="✦" color={color} />,
        }}
      />
    </Tabs>
  );
}
