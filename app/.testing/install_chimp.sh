#!/bin/bash

echo "Installing Chimp …"
if [ ! -e /home/ubuntu/nvm/versions/node/v4.8.1/lib/node_modules/chimp/bin/chimp.js ]; then yarn global add chimp@0.49.0; fi
