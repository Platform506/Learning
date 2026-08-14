#!/usr/bin/env bash
# Build ESS Android APK via EAS (cloud) — recommended on low-RAM machines.
set -euo pipefail
cd "$(dirname "$0")/.."

if ! npx eas-cli whoami >/dev/null 2>&1; then
  echo "Inicia sesión en Expo:"
  echo "  npx eas-cli login"
  exit 1
fi

# Ensure a real Expo project is linked (one-time)
if ! grep -q '"projectId": "[0-9a-f]\{8\}-' app.json 2>/dev/null; then
  echo "Vincula el proyecto (una vez):"
  echo "  npx eas-cli init"
  exit 1
fi

npx eas-cli build --platform android --profile preview --non-interactive
echo "Cuando termine, descarga el APK desde https://expo.dev/accounts (Builds)."
