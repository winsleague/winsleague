#!/bin/bash

# Disabled while we use the forked Spacejam in package.json (needed to instrument coverage)
# echo "Installing Spacejam …"
# if [ ! -e /home/ubuntu/nvm/versions/node/v4.5.0/lib/node_modules/spacejam/bin/spacejam ]; then npm install -g spacejam; fi

echo "Installing local packages …"
yarn --verbose
