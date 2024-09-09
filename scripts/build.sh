#!/bin/bash

# Script should be run from the root of the project.

# echo "Ensure you have extracted the locales with 'ng extract-i18n' and you have the latest version of the locales inside 'locales' folder."

echo " *** Don't forget to update config.json for production ***"

rm -rf dist/lpda2/*

ng build --localize -c production && \
  ./scripts/adjust-configs.sh && \
  echo "Done."