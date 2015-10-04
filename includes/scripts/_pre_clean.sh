#!/bin/sh

echo "[-] Performing image cleanup..."

# Purge packages
apt-get purge -y `apt-mark showauto`
apt-get remove --purge -y `apt-mark showauto`
check_code $?

# Autoremove any junk
apt-get clean -y
apt-get autoclean -y
apt-get autoremove -y
check_code $?
