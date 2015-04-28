FROM          debian
MAINTAINER    Chris Wessels (https://github.com/chriswessels)

ENV           NODE_VERSION="0.10.38" NODE_ARCH="x64" PHANTOMJS_VERSION="1.9.8"

ENV           BUILD_DEPS="wget curl gcc libc6-dev make build-essential libssl-dev git python"

COPY          scripts /tupperware

RUN           sh /tupperware/install_pkgs.sh
RUN           sh /tupperware/install_node.sh
# RUN           sh /tupperware/cleanup.sh

