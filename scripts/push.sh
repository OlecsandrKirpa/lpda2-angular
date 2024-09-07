#!/bin/bash

# Script should be run from the root of the project.

# Checking if the build folder exists
if [ ! -d "../build-angular-lpda2" ]; then
  echo "The build folder does not exist. Expected to find it at '../build-angular-lpda2'."
  exit 1
fi

echo "Clearing output folder..."
rm -rf ../build-angular-lpda2/*

echo "Copying the build files..." && \
  cd dist/lpda2 && cp -r * ../../../build-angular-lpda2/ && \
  echo "Pushing the changes to the repository..." && \
  cd ../../../build-angular-lpda2 && \
  git add . && \
  git commit -m "update build" && \
  git push origin master && \
  echo "Done."