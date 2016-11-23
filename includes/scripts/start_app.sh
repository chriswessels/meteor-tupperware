#!/bin/sh

BASEDIR=`dirname $0`

. $BASEDIR/_common.sh

if [ ! -f $OUTPUT_DIR/bundle/main.js ]; then
  echo "[!] There is no application bundle. Please see usage docs here: https://github.com/chriswessels/meteor-tupperware"
  exit 1
fi

if [ -z "$PORT" ]; then
  export PORT=80
fi

if [ -z "$NODE_ENV" ]; then
  export NODE_ENV="production"
fi

if [ -z "$METEOR_ENV" ]; then
  export METEOR_ENV="production"
fi

echo "[-] meteor-tupperware is starting your application with NODE_ENV=$NODE_ENV and METEOR_ENV=$METEOR_ENV on port $PORT..."

exec node $OUTPUT_DIR/bundle/main.js "$@"
