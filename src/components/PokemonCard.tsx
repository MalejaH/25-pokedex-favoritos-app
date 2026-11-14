import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { FavoriteButton } from "./FavoriteButton";
import { colores, espacios, radios } from "@/src/theme";
import type { PokemonListItem } from "@/src/types";
import { capitalizar } from "@/src/utils/format";

type Props = {
  pokemon: PokemonListItem;
  esFavorito: boolean;
  onAbrir: () => void;
  onFavorito: () => void;
  onEquipo: () => void;
};

function SpritePokemon({ pokemon }: { pokemon: PokemonListItem }) {
  if (pokemon.sprite_url !== null) {
    return (
      <Image
        source={{ uri: pokemon.sprite_url }}
        style={styles.sprite}
        accessibilityIgnoresInvertColors
      />
    );
  }
  return (
    <View style={[styles.sprite, styles.spriteVacio]}>
      <Text style={styles.spriteTexto}>?</Text>
    </View>
  );
}

function AccionesPokemon({ pokemon, esFavorito, onFavorito, onEquipo }: Omit<Props, "onAbrir">) {
  return (
    <View style={styles.acciones}>
      <FavoriteButton activo={esFavorito} onPress={onFavorito} />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Agregar ${capitalizar(pokemon.nombre)} al equipo`}
        onPress={onEquipo}
        style={styles.botonEquipo}
      >
        <Text style={styles.botonEquipoTexto}>+ Equipo</Text>
      </Pressable>
    </View>
  );
}

export function PokemonCard({ pokemon, esFavorito, onAbrir, onFavorito, onEquipo }: Props) {
  const dobleToque = Gesture.Tap()
    .numberOfTaps(2)
    .runOnJS(true)
    .onEnd(() => {
      onFavorito();
    });
  const pulsacionLarga = Gesture.LongPress()
    .minDuration(550)
    .runOnJS(true)
    .onStart(() => {
      onEquipo();
    });
  const gestos = Gesture.Simultaneous(dobleToque, pulsacionLarga);

  return (
    <GestureDetector gesture={gestos}>
      <View style={styles.tarjeta}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Ver ficha de ${capitalizar(pokemon.nombre)}`}
          onPress={onAbrir}
          style={styles.cuerpo}
        >
          <SpritePokemon pokemon={pokemon} />
          <View style={styles.info}>
            <Text style={styles.numero}>#{String(pokemon.id).padStart(4, "0")}</Text>
            <Text style={styles.nombre} numberOfLines={1}>
              {capitalizar(pokemon.nombre)}
            </Text>
            <Text style={styles.pista}>Doble toque: favorito · Mantener: equipo</Text>
          </View>
        </Pressable>
        <AccionesPokemon
          pokemon={pokemon}
          esFavorito={esFavorito}
          onFavorito={onFavorito}
          onEquipo={onEquipo}
        />
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: espacios.sm,
    backgroundColor: colores.panel,
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: radios.md,
    padding: espacios.sm,
    marginBottom: espacios.sm,
  },
  cuerpo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: espacios.md,
  },
  sprite: {
    width: 62,
    height: 62,
  },
  spriteVacio: {
    backgroundColor: colores.panelAlt,
    borderRadius: radios.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  spriteTexto: {
    color: colores.textoSuave,
    fontSize: 24,
    fontWeight: "800",
  },
  info: {
    flex: 1,
    gap: 2,
  },
  numero: {
    color: colores.marca,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
  },
  nombre: {
    color: colores.texto,
    fontSize: 17,
    fontWeight: "800",
  },
  pista: {
    color: colores.textoSuave,
    fontSize: 10.5,
  },
  acciones: {
    flexDirection: "row",
    alignItems: "center",
    gap: espacios.xs,
  },
  botonEquipo: {
    backgroundColor: colores.panelAlt,
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: radios.pill,
    paddingHorizontal: espacios.sm,
    paddingVertical: 8,
  },
  botonEquipoTexto: {
    color: colores.texto,
    fontSize: 11,
    fontWeight: "700",
  },
});
