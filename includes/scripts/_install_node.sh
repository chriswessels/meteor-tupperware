#!/bin/sh

NODE_DIST=node-v${NODE_VERSION}-linux-x64

echo "[-] Installing Node.js... $NODE_DIST"

cd /tmp

gpg --keyserver pool.sks-keyservers.net --recv-keys 9554F04D7259F04124DE6B476D5A82AC7E37093B
gpg --keyserver pool.sks-keyservers.net --recv-keys 94AE36675C464D64BAFA68DD7434390BDBE9B9C5
gpg --keyserver pool.sks-keyservers.net --recv-keys 0034A06D9D9B0064CE8ADF6BF1747F4AD2306D93
gpg --keyserver pool.sks-keyservers.net --recv-keys FD3A5288F042B6850C66B31F09FE44734EB7990E
gpg --keyserver pool.sks-keyservers.net --recv-keys 71DCFD284A79C3B38668286BC97EC7A07EDE3FC1
gpg --keyserver pool.sks-keyservers.net --recv-keys DD8F2338BAE7501E3DD5AC78C273792F7D83545D
gpg --keyserver pool.sks-keyservers.net --recv-keys C4F0DFFF4E8C1A8236409D08E73BC641CC11F4C8
gpg --keyserver pool.sks-keyservers.net --recv-keys B9AE9905FFD7803F25714661B63B535A4C206CA9

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
