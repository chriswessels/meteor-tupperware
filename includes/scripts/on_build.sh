#!/bin/sh

BASEDIR=`dirname $0`

. $BASEDIR/_common.sh

node $TUPPERBUILD_DIR/main.js $1
check_code $?

rm -rf /tmp/*
