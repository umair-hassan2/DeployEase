#!/bin/bash
# go to the target project directory
PROJECT_DIRECTORY=$1
cd dist
cd projects/${PROJECT_DIRECTORY}
echo "Now load dependencies"
npm install