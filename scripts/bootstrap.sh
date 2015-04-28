#!/bin/sh

BASEDIR=`dirname $0`

sh $BASEDIR/install_deps.sh

sh $BASEDIR/install_node.sh

sh $BASEDIR/cleanup.sh
