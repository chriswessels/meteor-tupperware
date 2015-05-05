#!/bin/sh

BASEDIR=`dirname $0`

. $BASEDIR/_common.sh

PORT=80 node $OUTPUT_DIR/bundle/main.js "$@"
