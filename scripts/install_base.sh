#!/bin/sh

echo "Updating package repositories..."

apk update

echo "Installing curl, wget..."

apk add curl wget
