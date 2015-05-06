#!/bin/sh

echo "> Purging build dependencies..."

# Purge build deps
apt-get purge -y $BUILD_DEPS
check_code $?

# Autoremove any junk
apt-get autoremove -y
check_code $?

echo "> Cleaning out docs, pkg management cruft and /tmp..."

# Clean out docs
rm -rf /usr/share/doc /usr/share/doc-base /usr/share/man /usr/share/locale /usr/share/zoneinfo

# Clean out package management dirs
rm -rf /var/lib/cache /var/lib/log

# Clean out /tmp
rm -rf /tmp

echo "> Clearing npm cache"
# Clear npm cache
npm cache clear
