#!/bin/sh

BASEDIR=`dirname $0`

. $BASEDIR/_common.sh

node $TUPPERBUILD_DIR/main.js
check_code $?

rm -rf /tmp/*
