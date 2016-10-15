#!/bin/bash

echo "Installing Chimp …"
if [ ! -e /home/ubuntu/nvm/versions/node/v4.5.0/lib/node_modules/chimp/bin/chimp.js ]; then npm install -g chimp@0.40.7; fi
