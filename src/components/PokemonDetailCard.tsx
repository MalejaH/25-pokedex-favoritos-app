import { Pressable, StyleSheet, Text, View } from "react-native";
import { ParallaxCard } from "./ParallaxCard";
import { StatsList } from "./StatsList";
import { ZoomableSprite } from "./ZoomableSprite";
import { colores, espacios, radios } from "@/src/theme";
import type { Tilt } from "@/src/sensors/tilt";
import type { PokemonDetail } from "@/src/types";
import { capitalizar, formatearAltura, formatearPeso } from "@/src/utils/format";

type Props = {
  detail: PokemonDetail;
  tilt: Tilt;
  tiltEnabled: boolean;
  tiltAvailable: boolean | null;
  permissionDenied: boolean;
  onToggleTilt: () => void;
};

function InfoPokemon({ detail }: { detail: PokemonDetail }) {
  return (
    <View style={styles.info}>
      <Text style={styles.numero}>#{String(detail.id).padStart(4, "0")}</Text>
      <Text style={styles.nombre}>{capitalizar(detail.nombre)}</Text>
      <View style={styles.tipos}>
        {detail.tipos.map((tipo) => (
          <Text key={tipo} style={styles.tipo}>
            {tipo}
          </Text>
        ))}
      </View>
      <View style={styles.metricas}>
        <Text style={styles.metrica}>Altura {formatearAltura(detail.altura)}</Text>
        <Text style={styles.metrica}>Peso {formatearPeso(detail.peso)}</Text>
      </View>
    </View>
  );
}

function TiltControls({
  tiltEnabled,
  tiltAvailable,
  permissionDenied,
  onToggleTilt,
}: Omit<Props, "detail" | "tilt">) {
  const sinSensor = tiltEnabled && tiltAvailable === false;
  return (
    <View style={styles.controles}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={
          tiltEnabled ? "Desactivar tarjeta 3D" : "Activar tarjeta 3D con el giroscopio"
        }
        accessibilityState={{ selected: tiltEnabled }}
        onPress={onToggleTilt}
        style={[styles.boton, tiltEnabled ? styles.botonActivo : null]}
      >
        <Text style={styles.botonTexto}>
          {tiltEnabled ? "Desactivar inclinación 3D" : "Activar inclinación 3D"}
        </Text>
      </Pressable>
      {sinSensor ? (
        <Text style={styles.aviso}>
          Este dispositivo no tiene giroscopio disponible. La tarjeta se muestra estática.
        </Text>
      ) : null}
      {permissionDenied ? (
        <Text style={styles.aviso}>
          Permiso de movimiento denegado. La tarjeta se muestra estática.
        </Text>
      ) : null}
    </View>
  );
}

export function PokemonDetailCard(props: Props) {
  const { detail, tilt, tiltEnabled, tiltAvailable } = props;
  return (
    <View style={styles.contenedor}>
      <ParallaxCard tilt={tilt} enabled={tiltEnabled && tiltAvailable !== false}>
        <ZoomableSprite uri={detail.sprite_url} nombre={detail.nombre} />
        <InfoPokemon detail={detail} />
        <View style={styles.divisor} />
        <StatsList stats={detail.stats} />
      </ParallaxCard>
      <TiltControls
        tiltEnabled={tiltEnabled}
        tiltAvailable={tiltAvailable}
        permissionDenied={props.permissionDenied}
        onToggleTilt={props.onToggleTilt}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    gap: espacios.sm,
    alignItems: "center",
  },
  info: {
    alignItems: "center",
  },
  numero: {
    color: colores.marca,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 2,
  },
  nombre: {
    color: colores.texto,
    fontSize: 28,
    fontWeight: "900",
    textTransform: "capitalize",
  },
  tipos: {
    flexDirection: "row",
    gap: espacios.xs,
    marginBottom: espacios.xs,
  },
  tipo: {
    backgroundColor: "rgba(45, 212, 191, 0.12)",
    color: colores.marca,
    borderWidth: 1,
    borderColor: colores.marcaOscura,
    borderRadius: radios.pill,
    paddingHorizontal: espacios.sm,
    paddingVertical: 2,
    fontSize: 11,
    textTransform: "capitalize",
  },
  metricas: {
    flexDirection: "row",
    gap: espacios.lg,
  },
  metrica: {
    color: colores.textoSuave,
    fontSize: 12,
  },
  divisor: {
    height: 1,
    alignSelf: "stretch",
    backgroundColor: colores.borde,
    marginVertical: espacios.sm,
  },
  controles: {
    alignItems: "center",
    gap: espacios.xs,
  },
  boton: {
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: radios.pill,
    paddingHorizontal: espacios.lg,
    paddingVertical: espacios.sm,
    backgroundColor: colores.panelAlt,
  },
  botonActivo: {
    borderColor: colores.marca,
    backgroundColor: "rgba(45, 212, 191, 0.12)",
  },
  botonTexto: {
    color: colores.texto,
    fontSize: 12,
    fontWeight: "700",
  },
  aviso: {
    color: colores.acento,
    fontSize: 11,
    textAlign: "center",
    lineHeight: 16,
  },
});
