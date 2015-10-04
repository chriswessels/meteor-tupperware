#!/bin/sh

cd $TUPPERBUILD_DIR

echo "[-] Setting up tupperbuild..."

npm install
check_code $?

cd $BASEDIR
