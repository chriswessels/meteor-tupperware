FROM          debian
MAINTAINER    Chris Wessels (https://github.com/chriswessels)

ENV           NODE_VERSION="0.10.38" NODE_ARCH="x64"

COPY          includes /tupperware

RUN           sh /tupperware/scripts/bootstrap.sh

ONBUILD COPY  ./ /app

ONBUILD RUN   sh /tupperware/scripts/on_build.sh
