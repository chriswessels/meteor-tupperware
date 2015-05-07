#!/bin/sh

BASEDIR=`dirname $0`

. $BASEDIR/_common.sh

node $TUPPERBUILD_DIR/main.js
check_code $?

rm -rf /tmp/*

# if [ ! -z "$INSTALL_PHANTOMJS" ]; then
#   ARCH=`uname -m`

#   # Deps
#   echo "> Installing PhantomJS dependencies..."
#   apt-get install -y --no-install-recommends libfreetype6 libfreetype6-dev fontconfig
#   check_code $?

#   echo "> Installing PhantomJS... $PHANTOMJS_VERSION"

#   cd /usr/local/share/

#   wget https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-${PHANTOMJS_VERSION}-linux-${ARCH}.tar.bz2
#   check_code $?

#   tar xjf phantomjs-${PHANTOMJS_VERSION}-linux-${ARCH}.tar.bz2
#   check_code $?

#   ln -s -f /usr/local/share/phantomjs-${PHANTOMJS_VERSION}-linux-${ARCH}/bin/phantomjs /usr/local/share/phantomjs
#   ln -s -f /usr/local/share/phantomjs-${PHANTOMJS_VERSION}-linux-${ARCH}/bin/phantomjs /usr/local/bin/phantomjs
#   ln -s -f /usr/local/share/phantomjs-${PHANTOMJS_VERSION}-linux-${ARCH}/bin/phantomjs /usr/bin/phantomjs

# fi

# APP_PATH=""

# METEOR_VERSION=`cat $APP_PATH/.meteor/release | cut -c 8-`

# curl https://install.meteor.com | sed -e -r 's/RELEASE=".*"/RELEASE="$METEOR_VERSION"/g' | sh

#
