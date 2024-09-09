#!/bin/bash

# Script should be run from the root of the project.

# Checking if the build folder exists
if [ ! -d "../lpda2-angular-build" ]; then
  echo "The build repository folder does not exist. Expected to find it at '../lpda2-angular-build'."
  exit 1
fi

echo "Clearing output folder..."
rm -rf ../lpda2-angular-build/*

echo "Copying the build files..." && \
  cd dist/lpda2 && cp -r * ../../../lpda2-angular-build/ && \
  echo "Pushing the changes to the repository..." && \
  cd ../../../lpda2-angular-build && \
  git add . && \
  git commit -m "update build" && \
  git push origin master && \
  echo "Done."