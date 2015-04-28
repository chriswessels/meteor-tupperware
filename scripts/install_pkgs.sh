#!/bin/sh

apt-get update

apt-get install -y $BUILD_DEPS --no-install-recommends
