#!/usr/bin/env bash

export MONGO_URL="mongodb://localhost:3001/cache"
echo "Running meteor to cache it …"
node ./.testing/cache_build_and_dependencies.js
