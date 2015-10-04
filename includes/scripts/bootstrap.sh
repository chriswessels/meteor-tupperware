#!/bin/sh

BASEDIR=`dirname $0`

. $BASEDIR/_common.sh

. $BASEDIR/_pre_clean.sh

. $BASEDIR/_install_deps.sh

. $BASEDIR/_install_node.sh

. $BASEDIR/_setup_tupperbuild.sh

. $BASEDIR/_post_clean.sh
