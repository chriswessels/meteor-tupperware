#!/bin/sh

BASEDIR=`dirname $0`

. $BASEDIR/_common.sh

exec node $TUPPERBUILD_DIR/main.js $1
