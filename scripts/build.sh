#!/bin/bash

# Script should be run from the root of the project.

echo "Ensure you have extracted the locales with 'ng extract-i18n' and you have the latest version of the locales inside 'locales' folder."

echo "Clearing build folder..."
rm -rf dist/lpda2/*

echo "Building the project..." && \
  ng build --localize -c production && \
  echo "Adjusting the configurations..." && \
  ./scripts/adjust-configs.sh && \
  echo "Done."