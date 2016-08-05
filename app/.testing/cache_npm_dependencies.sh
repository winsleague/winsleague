# Cache npm deps
echo "Installing Chimp …"
if [ ! -e /home/ubuntu/nvm/versions/node/v5.2.0/lib/node_modules/chimp/bin/chimp.js ]; then npm install -g chimp; fi

# Disabled while we use the forked Spacejam in package.json
# echo "Installing Spacejam …"
# if [ ! -e /home/ubuntu/nvm/versions/node/v5.2.0/lib/node_modules/spacejam/bin/spacejam ]; then npm install -g spacejam; fi

echo "Installing local packages …"
npm install
