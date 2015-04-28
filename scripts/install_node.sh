#!/bin/sh

NODE_DIST=node-v${NODE_VERSION}-linux-${NODE_ARCH}

cd /tmp
curl -L http://nodejs.org/dist/v${NODE_VERSION}/${NODE_DIST}.tar.gz | tar xvz -
rm -rf /opt/nodejs
mv ${NODE_DIST} /opt/nodejs

ln -sf /opt/nodejs/bin/node /usr/bin/node
ln -sf /opt/nodejs/bin/npm /usr/bin/npm

# for npm module re-building
apt-get -y install
npm install -g node-gyp
# pre-install node source code for faster building
node-gyp install ${NODE_VERSION}
