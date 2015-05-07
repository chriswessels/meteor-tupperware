FROM          debian:wheezy
MAINTAINER    Chris Wessels (https://github.com/chriswessels)

ENV           NODE_VERSION="0.10.38" PHANTOMJS_VERSION="1.9.8" IMAGEMAGICK_VERSION="8:6.7.7.10-5+deb7u3"

COPY          includes /tupperware

RUN           sh /tupperware/scripts/bootstrap.sh

EXPOSE        80

ENTRYPOINT    sh /tupperware/scripts/start_app.sh

ONBUILD COPY  ./ /app

ONBUILD RUN   sh /tupperware/scripts/on_build.sh
