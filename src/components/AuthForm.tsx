import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useAuthForm, type AuthMode } from "@/src/hooks/useAuthForm";
import { colores, espacios, radios } from "@/src/theme";

function Campo({
  label,
  value,
  onChange,
  secure,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  secure?: boolean;
  placeholder: string;
}) {
  return (
    <View style={styles.campo}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        value={value}
        onChangeText={onChange}
        secureTextEntry={secure === true}
        placeholder={placeholder}
        placeholderTextColor={colores.textoSuave}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType={secure === true ? "default" : "email-address"}
        style={styles.input}
      />
    </View>
  );
}

function Encabezado({ mode }: { mode: AuthMode }) {
  return (
    <>
      <Text style={styles.kicker}>PROYECTO 25 · POKÉDEX</Text>
      <Text style={styles.titulo}>
        {mode === "login" ? "Entrar a tu Pokédex" : "Crear una cuenta"}
      </Text>
      <Text style={styles.subtitulo}>
        Tus favoritos y tu equipo se guardan en el teléfono y en la nube.
      </Text>
    </>
  );
}

function AccionesAuth({
  accion,
  enviando,
  onEnviar,
  cambio,
  onCambiar,
}: {
  accion: string;
  enviando: boolean;
  onEnviar: () => void;
  cambio: string;
  onCambiar: () => void;
}) {
  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accion}
        accessibilityState={{ disabled: enviando }}
        disabled={enviando}
        onPress={onEnviar}
        style={[styles.boton, enviando ? styles.deshabilitado : null]}
      >
        {enviando ? (
          <ActivityIndicator color={colores.texto} />
        ) : (
          <Text style={styles.botonTexto}>{accion}</Text>
        )}
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={cambio}
        onPress={onCambiar}
        style={styles.cambio}
      >
        <Text style={styles.cambioTexto}>{cambio}</Text>
      </Pressable>
    </>
  );
}

export function AuthForm() {
  const form = useAuthForm();
  const accion = form.mode === "login" ? "Entrar" : "Crear cuenta";
  const cambio =
    form.mode === "login" ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Entra";

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.contenedor}
    >
      <View style={styles.tarjeta}>
        <Encabezado mode={form.mode} />
        <Campo
          label="Correo electrónico"
          value={form.email}
          onChange={form.setEmail}
          placeholder="fan@example.com"
        />
        <Campo
          label="Contraseña"
          value={form.password}
          onChange={form.setPassword}
          secure
          placeholder="Mínimo 8 caracteres"
        />

        {form.error !== null ? (
          <Text accessibilityRole="alert" style={styles.error}>
            {form.error}
          </Text>
        ) : null}

        <AccionesAuth
          accion={accion}
          enviando={form.enviando}
          onEnviar={() => void form.enviar()}
          cambio={cambio}
          onCambiar={form.cambiarModo}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: espacios.lg,
  },
  tarjeta: {
    backgroundColor: colores.panel,
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: radios.lg,
    padding: espacios.lg,
    gap: espacios.sm,
  },
  kicker: {
    color: colores.marca,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.6,
  },
  titulo: {
    color: colores.texto,
    fontSize: 26,
    fontWeight: "900",
  },
  subtitulo: {
    color: colores.textoSuave,
    fontSize: 12.5,
    lineHeight: 18,
    marginBottom: espacios.sm,
  },
  campo: {
    gap: 5,
  },
  label: {
    color: colores.textoSuave,
    fontSize: 12,
    fontWeight: "700",
  },
  input: {
    backgroundColor: colores.panelAlt,
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: radios.md,
    paddingHorizontal: espacios.md,
    paddingVertical: 11,
    color: colores.texto,
    fontSize: 15,
  },
  error: {
    color: colores.peligro,
    fontSize: 12.5,
    lineHeight: 18,
  },
  boton: {
    marginTop: espacios.sm,
    backgroundColor: colores.marcaOscura,
    borderRadius: radios.pill,
    paddingVertical: 13,
    alignItems: "center",
  },
  deshabilitado: {
    opacity: 0.6,
  },
  botonTexto: {
    color: colores.texto,
    fontSize: 15,
    fontWeight: "800",
  },
  cambio: {
    alignItems: "center",
    paddingVertical: espacios.sm,
  },
  cambioTexto: {
    color: colores.marca,
    fontSize: 12.5,
    fontWeight: "700",
  },
});
