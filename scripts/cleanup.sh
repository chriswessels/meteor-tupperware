#!/bin/sh

apt-get purge -y $BUILD_DEPS

apt-get autoremove -y

rm -rf /usr/share/doc /usr/share/doc-base /usr/share/man /usr/share/locale /usr/share/zoneinfo

rm -rf /var/lib/apt /var/lib/dpkg /var/lib/cache /var/lib/log

rm -rf /tmp
