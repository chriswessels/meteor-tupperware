#!/bin/sh

NODE_DIST=node-v${NODE_VERSION}-linux-${NODE_ARCH}

echo "> Installing Node.js... $NODE_DIST"

cd /tmp
curl -L http://nodejs.org/dist/v${NODE_VERSION}/${NODE_DIST}.tar.gz | tar xvzf --strip-components=1
check_code $?

rm -rf /opt/nodejs
mv ${NODE_DIST} /opt/nodejs

ln -sf /opt/nodejs/bin/node /usr/bin/node
ln -sf /opt/nodejs/bin/npm /usr/bin/npm

# for npm module re-building
apt-get -y install
check_code $?

npm install -g node-gyp
check_code $?

# pre-install node source code for faster building
node-gyp install ${NODE_VERSION}
check_code $?
