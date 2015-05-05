#!/bin/sh

cd $TUPPERBUILD_DIR

npm install
check_code $?

cd $BASEDIR
