# ESS — Cuadratura de combustibles

App móvil **offline** (Expo + React Native) para cuadrar caja vs litros dispensados en una gasolinera.

- Sin backend, sin base de datos, sin usuarios
- Cálculos 100% en el teléfono
- Exporta un **Excel** al final
- Cámara + detección de imagen **borrosa / poco legible** (pide retomar)

## Casos

### Caso A — Día normal
1. Precios (Diesel / Regular / Super)
2. Caja (billetes, monedas, tarjetas, …) + foto opcional
3. Litros del día (ingreso / salida; **total calculado**)
4. Litros de almuerzo (misma forma)
5. Revisión → resultado (sobra / falta) → Excel

`litros_netos = (salida_día − ingreso_día) − (salida_almuerzo − ingreso_almuerzo)`

### Caso B — Almuercero
1. Precios → caja
2. 4 cuadrantes (cada uno: 12 filas Diesel/Regular/Super × 4 máquinas)
3. Revisión → resultado → Excel

## Desarrollo

```bash
cd ess
npm install
npx expo start
```

Atajos útiles en la app:
- **Cargar ejemplo Caso A** en la pantalla de inicio (datos de la planilla de referencia)

## APK (GitHub Actions — recomendado)

En esta máquina local (~5 GB RAM) **no alcanza** para compilar React Native/NDK.
El APK se genera en la nube:

1. Sube `ess/` y el workflow a GitHub (rama `master`/`main`).
2. Actions → workflow **ESS Android APK** → espera a que termine.
3. Descarga el artifact **`ess-cuadratura-apk`**.

También puedes dispararlo a mano: **Actions → ESS Android APK → Run workflow**.

No necesitas cuenta de Expo ni `EXPO_TOKEN`: el job hace `expo prebuild` + `gradlew assembleRelease` en Ubuntu.

## APK local (solo si tienes ≥16 GB RAM + Android SDK)

```bash
cd ess
npm ci
CI=1 npx expo prebuild --platform android
cd android
./gradlew assembleRelease -PreactNativeArchitectures=arm64-v8a
# APK: android/app/build/outputs/apk/release/app-release.apk
```

## Notas OCR

- Antes de aceptar una foto se mide nitidez (varianza Laplaciana) y brillo.
- Si está **borrosa, oscura o ilegible**, la app pide **tomar de nuevo**.
- El OCR automático de manuscrita en Expo Go es limitado: siempre puedes editar las celdas a mano.
- La columna **Litros totales no viene en el papel**; la genera la app.

## Estructura

```
ess/
  app/                 # pantallas wizard
  src/
    components/
    domain/            # tipos + cálculos
    ocr/               # calidad de imagen + parseo
    excel/             # generación xlsx
    store/             # zustand
```
