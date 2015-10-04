#!/bin/sh

NODE_DIST=node-v${NODE_VERSION}-linux-x64

echo "[-] Installing Node.js... $NODE_DIST"

cd /tmp

gpg --keyserver pool.sks-keyservers.net --recv-keys 7937DFD2AB06298B2293C3187D33FF9D0246406D 114F43EE0176B71C7BC219DD50A3051F888C628D
check_code $?

curl -SLO "http://nodejs.org/dist/v$NODE_VERSION/$NODE_DIST.tar.gz"
check_code $?

curl -SLO "http://nodejs.org/dist/v$NODE_VERSION/SHASUMS256.txt.asc"
check_code $?

gpg --verify SHASUMS256.txt.asc
check_code $?

grep " $NODE_DIST.tar.gz\$" SHASUMS256.txt.asc | sha256sum -c -
check_code $?

tar -xzf "$NODE_DIST.tar.gz" -C /usr/local --strip-components=1
check_code $?

rm "$NODE_DIST.tar.gz" SHASUMS256.txt.asc
check_code $?
