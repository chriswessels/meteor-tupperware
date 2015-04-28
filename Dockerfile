FROM          gliderlabs/alpine:3.1
MAINTAINER    Chris Wessels (https://github.com/chriswessels)

ENV           NODEJS_APK_VERSION 0.10.33-r0

COPY          includes/apk-repositories /etc/apk/repositories

COPY          scripts /opt/tupperware

RUN           sh /opt/tupperware/install_base.sh
RUN           sh /opt/tupperware/install_node.sh
