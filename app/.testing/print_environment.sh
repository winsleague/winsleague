#!/usr/bin/env bash

echo "environment versions:"
. /etc/os-release
echo "operating system $VERSION"
echo "kernel $(uname -a)"
echo "which node: $(which node)"
echo "node $(node -v)"
echo "$(meteor --version)"
echo "meteor node $(meteor node -v)"
echo "yarn $(yarn -v)"
/opt/google/chrome/google-chrome --version