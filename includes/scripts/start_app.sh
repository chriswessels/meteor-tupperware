#!/bin/sh

BASEDIR=`dirname $0`

. $BASEDIR/_common.sh

if [ ! -f $OUTPUT_DIR/bundle/main.js ]; then
  echo "There is no bundle. Please see usage docs here: https://github.com/chriswessels/meteor-tupperware"
  exit 1
fi

PORT=80 node $OUTPUT_DIR/bundle/main.js "$@"
