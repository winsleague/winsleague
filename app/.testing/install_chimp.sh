echo "Installing Chimp …"
if [ ! -e /home/ubuntu/nvm/versions/node/v5.2.0/lib/node_modules/chimp/bin/chimp.js ]; then npm install -g chimp@0.39.3; fi
