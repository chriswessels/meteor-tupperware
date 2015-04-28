FROM          debian
MAINTAINER    Chris Wessels (https://github.com/chriswessels)

ENV           NODE_VERSION="0.10.38" NODE_ARCH="x64" PHANTOMJS_VERSION="1.9.8"

ENV           BUILD_DEPS="gcc libc6-dev make build-essential libssl-dev python"

COPY          scripts /tupperware

RUN           sh /tupperware/bootstrap.sh

ONBUILD RUN   sh /tupperware/install_phantomjs.sh

ONBUILD RUN   sh /tupperware/on_build.sh
