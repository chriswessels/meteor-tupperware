#!/bin/sh

echo "Installing Node.js ($NODEJS_APK_VERSION)..."

apk add nodejs=$NODEJS_APK_VERSION
