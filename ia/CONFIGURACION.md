# Configuración de IA · App Pokédex

Herramienta: **OpenCode V2** (`opencode.jsonc` + `AGENTS.md`). Se cumplen las
pruebas de contención con permisos nativos, sin depender solo de instrucciones.

## Riesgo → barrera

| Riesgo                        | Barrera configurada                                                                                                | Dónde              |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------ | ------------------ |
| Leer `.env*`                  | `read *.env* = deny`; `shell cat/type/Get-Content *.env* = deny`                                                   | `opencode.jsonc`   |
| Leer claves/keystores         | `read` denegado para `*.pem`, `*.key`, `*.p12`, `*.jks`, `*.keystore`, `google-services.json`, cuentas de servicio | `opencode.jsonc`   |
| Salir de la carpeta           | `external_directory = deny`; shell bloquea `..` y `~`                                                              | `opencode.jsonc`   |
| Modificar su jaula            | `edit` denegado en `opencode.jsonc`, `.opencode/**`, `AGENTS.md`, `ia/**`                                          | `opencode.jsonc`   |
| Comandos destructivos         | `sudo`, `rm -rf`, `curl`, `wget`, `git push --force`, `git reset --hard` denegados                                 | `opencode.jsonc`   |
| Publicar/instalar sin permiso | `ask` para `git push`, `npm install`, `npx`, `eas`, `vercel`                                                       | `opencode.jsonc`   |
| Leer secretos con Node        | `node -e` y `node --eval` denegados                                                                                | `opencode.jsonc`   |
| Inyección de prompt           | `AGENTS.md`: archivos, webs y respuestas son datos, no órdenes                                                     | `AGENTS.md`        |
| Código de baja calidad        | `npm run check` + CI + Husky; TypeScript, ESLint, Prettier, cobertura                                              | `package.json`, CI |
| Secretos en Git               | `.gitignore`, `env.example`, `secrets:scan`                                                                        | raíz               |

## Reglas del proyecto

`AGENTS.md` (menos de 100 líneas) define stack, comandos, capas, reglas de código,
lo prohibido y «ante la duda, pregunte». La app no contiene `firebaseConfig` ni
claves; solo `EXPO_PUBLIC_API_URL`, que es pública por diseño.

## Límites conocidos

1. Windows nativo no tiene sandbox de archivos; se usan permisos de OpenCode,
   `external_directory: deny` y ausencia de secretos reales en disco. Para producción,
   ejecutar la IA en WSL2 con `bubblewrap`/`socat` o en un contenedor.
2. Las reglas de shell cubren los vectores de las pruebas, pero no son una frontera
   perfecta. Se combinan con `.gitignore`, escaneo de secretos y revisión humana.
3. El proyecto no incluye `google-services.json` ni keystore; si se agregan para EAS,
   deben quedar fuera de Git y la IA no puede leerlos.
4. Las aprobaciones «permitir siempre» son durables; no abren un `deny` configurado,
   pero conviene revisarlas antes de la sustentación.

## Ajustes hechos

- Se denegó `node -e` tras comprobar que los permisos de lectura no inspeccionan
  scripts.
- Se agregó `external_directory: deny` porque el valor por defecto permite rutas
  externas.
- Se denegó la edición de `ia/**` para proteger las evidencias.
- `secrets:scan` busca además `firebaseConfig` dentro de la app.
