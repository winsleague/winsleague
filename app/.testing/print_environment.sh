#!/usr/bin/env bash

echo "environment versions:"
. /etc/os-release
echo "operating system $VERSION"
echo "kernel $(uname -a)"
echo "node $(node -v)"
echo "yarn $(yarn -v)"
/opt/google/chrome/google-chrome --version