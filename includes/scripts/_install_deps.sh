#!/bin/sh

echo "> Updating system..."

# System update
apt-get update
check_code $?

echo "> Installing build dependencies... $BUILD_DEPS"

# Build deps (to be removed in cleanup.sh)
apt-get install -y --no-install-recommends $BUILD_DEPS
check_code $?

echo "> Installing image utils... $IMAGE_UTILS"

# Sys utils
apt-get install -y --no-install-recommends $IMAGE_UTILS
check_code $?
