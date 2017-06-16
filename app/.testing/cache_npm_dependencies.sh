#!/bin/bash

# Disabled until we get code coverage working. Right now it's a major pain.
# echo "Installing Spacejam …"
# if [ ! -e /home/ubuntu/nvm/versions/node/v4.6.2/lib/node_modules/spacejam/bin/spacejam ]; then yarn global add spacejam; fi

echo "Installing local packages …"
yarn --verbose
