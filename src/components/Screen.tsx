import type { ReactNode } from "react";
import { ScrollView, StyleSheet, View, type ScrollViewProps } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colores, espacios } from "@/src/theme";

export function Screen({ children }: { children: ReactNode }) {
  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <View style={styles.content}>{children}</View>
    </SafeAreaView>
  );
}

export function ScrollScreen({
  children,
  onScroll,
  scrollEventThrottle,
}: {
  children: ReactNode;
  onScroll?: ScrollViewProps["onScroll"];
  scrollEventThrottle?: number;
}) {
  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        onScroll={onScroll}
        scrollEventThrottle={scrollEventThrottle}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colores.fondo,
  },
  content: {
    flex: 1,
    paddingHorizontal: espacios.lg,
  },
  scrollContent: {
    padding: espacios.lg,
    paddingBottom: espacios.xl * 2,
  },
});
