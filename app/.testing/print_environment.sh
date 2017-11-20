#!/usr/bin/env bash

echo "environment versions:"
. /etc/os-release
echo "operating system $VERSION"
echo "kernel $(uname -a)"
echo "which node: $(which node)"
echo "node $(node -v)"
echo "METEOR_WATCH_FORCE_POLLING: $METEOR_WATCH_FORCE_POLLING"
echo "$(meteor --version)"
echo "meteor node $(meteor node -v)"
echo "yarn $(yarn -v)"
/opt/google/chrome/google-chrome --version