# 25 · Pokédex con favoritos y tarjetas 3D · App

App móvil del proyecto **Pokédex con favoritos**. Explora Pokémon con paginación y
búsqueda, guarda favoritos sin conexión, arma un equipo de 6 y activa el parallax
3D con el giroscopio.

- Repositorio de la API: `25-pokedex-favoritos-api`
- Documento del proyecto: `25-pokedex-favoritos.md`

## Stack

| Pieza                                       | Uso                                            |
| ------------------------------------------- | ---------------------------------------------- |
| Expo SDK 58 + React Native + TypeScript     | App móvil                                      |
| Expo Router                                 | Rutas por archivos                             |
| `expo-sqlite`                               | Caché, favoritos y equipo offline              |
| `expo-secure-store`                         | Token y refresh token (nunca AsyncStorage)     |
| `expo-sensors`                              | Giroscopio (parallax) y acelerómetro (sacudir) |
| `react-native-gesture-handler` + Reanimated | Doble toque, pulsación larga, pinch y fling    |
| Jest + jest-expo + RNTL                     | Pruebas                                        |

La app **no contiene credenciales** ni `firebaseConfig`. Solo conoce
`EXPO_PUBLIC_API_URL` (pública) y los tokens del usuario.

## Rutas

| Ruta               | Pantalla                                                  |
| ------------------ | --------------------------------------------------------- |
| `(tabs)/index`     | Lista paginada de 20 en 20 con búsqueda (debounce 400 ms) |
| `(tabs)/favoritos` | Favoritos guardados, disponibles sin conexión             |
| `(tabs)/equipo`    | Equipo de máximo 6, sin repetidos                         |
| `pokemon/[id]`     | Ficha con tipos, estadísticas, parallax y zoom            |
| `login`            | Registro e inicio de sesión                               |

## Gestos y accesibilidad

| Gesto                     | Acción                     | Alternativa accesible                    |
| ------------------------- | -------------------------- | ---------------------------------------- |
| Doble toque en tarjeta    | Añadir/quitar favorito     | Botón con corazón y `accessibilityLabel` |
| Pulsación larga           | Añadir al equipo           | Botón «+ Equipo»                         |
| Pellizco en sprite        | Zoom 1×–3×                 | Botones −, + y 1×                        |
| Fling horizontal en ficha | Pokémon anterior/siguiente | Botones «Anterior» y «Siguiente»         |

## Sensores

| Sensor                      | Uso                                     | Fallback                                    |
| --------------------------- | --------------------------------------- | ------------------------------------------- |
| Giroscopio / `DeviceMotion` | Inclinar la tarjeta (parallax)          | Tarjeta estática y botón para desactivar 3D |
| Acelerómetro                | Sacudir para abrir un Pokémon aleatorio | Botón «🎲 Aleatorio»                        |

Se llama `isAvailableAsync()` y se cancela la suscripción al salir. El permiso de
movimiento se pide solo al activar la tarjeta 3D. En el emulador muchos sensores
no existen: probar en un dispositivo físico.

## Datos locales (SQLite)

```sql
CREATE TABLE pokemon_cache (
  id INTEGER PRIMARY KEY, nombre TEXT NOT NULL, tipos TEXT NOT NULL,
  sprite_url TEXT, altura INTEGER, peso INTEGER, stats_json TEXT,
  remote_id TEXT, updated_at TEXT, deleted INTEGER DEFAULT 0, pending INTEGER DEFAULT 0
);
CREATE TABLE favorito (
  pokemon_id INTEGER PRIMARY KEY, agregado_en TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  remote_id TEXT, updated_at TEXT, deleted INTEGER DEFAULT 0, pending INTEGER DEFAULT 0
);
CREATE TABLE equipo (
  posicion INTEGER PRIMARY KEY CHECK (posicion BETWEEN 1 AND 6),
  pokemon_id INTEGER NOT NULL,
  remote_id TEXT, updated_at TEXT, deleted INTEGER DEFAULT 0, pending INTEGER DEFAULT 0
);
```

La app escribe primero en SQLite (`pending = 1`) y `syncService` envía los cambios
cuando hay conexión; después trae el estado del servidor. Un favorito abierto sin
conexión se muestra desde `pokemon_cache`.

## Puesta en marcha

```bash
npm ci
cp env.example .env.local
# edite EXPO_PUBLIC_API_URL con la URL de su API desplegada
npm start
```

En Windows use `copy env.example .env.local`. Compruebe desde el teléfono que
`GET <API>/api/health` responde antes de iniciar sesión.

## Calidad

```bash
npm run check       # secretos + tipos + lint + formato + pruebas con cobertura
npm test
npm run typecheck
npm run lint
npm run format:check
```

Cobertura de la lógica pura y componentes probados: 100 %. CI ejecuta `check`,
`expo export --platform android` y `npm audit --audit-level=high`.

## APK con EAS

```bash
npx eas-cli login
npx eas-cli init          # reemplaza el projectId de app.json
npm run apk               # perfil preview, genera APK
```

El APK se instala y se prueba en un dispositivo físico. La URL del APK se agrega
en la entrega del proyecto.

## Seguridad (lista de verificación)

- [x] Ningún secreto ni `firebaseConfig` en el repositorio ni en el APK.
- [x] `.env*` en `.gitignore`; solo `env.example` con valores falsos.
- [x] Tokens en `expo-secure-store`, nunca en AsyncStorage.
- [x] HTTPS en todas las llamadas; sin `localhost` en el APK.
- [x] Permisos mínimos en `app.json` (solo INTERNET y descripción de movimiento).
- [x] Escaneo de secretos en `npm run check` y CI.

## Configuración de IA

Ver [`IA.md`](IA.md), [`ia/CONFIGURACION.md`](ia/CONFIGURACION.md),
[`ia/PRUEBAS-CONTENCION.md`](ia/PRUEBAS-CONTENCION.md) y
[`ia/BITACORA.md`](ia/BITACORA.md). La configuración está en el primer commit.

## Guías del proyecto

- [`docs/GUIA-FINALIZACION.md`](docs/GUIA-FINALIZACION.md): pasos para Firebase,
  Vercel, ejecución local, EAS/APK, evidencias y entrega.
- [`docs/GUIA-SUSTENTACION.md`](docs/GUIA-SUSTENTACION.md): contexto,
  funcionalidad, arquitectura, demo, seguridad, pruebas, IA y preguntas
  frecuentes.

## Capturas

Guarde las capturas del APK en `docs/capturas/` con estos nombres:
`01-login.png`, `02-lista.png`, `03-favoritos.png`, `04-detalle-3d.png`,
`05-equipo.png`. Ver `docs/capturas/README.md`.

> Nota: la exportación web de `expo-sqlite` requiere un `.wasm` que el paquete no
> incluye en esta versión; el objetivo del proyecto es Android/iOS. La CI valida el
> bundle de Android.
