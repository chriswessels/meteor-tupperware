#!/bin/sh

# System update
apt-get update

# Build deps (to be removed in cleanup.sh)
apt-get install -y --no-install-recommends $BUILD_DEPS

# Sys utils
apt-get install -y --no-install-recommends git wget curl ca-certificates sudo
