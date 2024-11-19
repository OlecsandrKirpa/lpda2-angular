#!/bin/bash

# Script should be run from the root of the project.

# echo "Ensure you have extracted the locales with 'ng extract-i18n' and you have the latest version of the locales inside 'locales' folder."

echo " *** Don't forget to update config.json for production ***"
echo "current config.json:"
cat src/assets/config/config.json

rm -rf dist/lpda2/*

ng build --localize -c production && \
  cp -r dist/lpda2/it/* dist/lpda2/ && \
  ./scripts/adjust-configs.sh && \
  echo "Done."