FROM          debian
MAINTAINER    Chris Wessels (https://github.com/chriswessels)

ENV           NODE_VERSION="0.10.38"

COPY          includes /tupperware

RUN           sh /tupperware/scripts/bootstrap.sh

EXPOSE        80

ENTRYPOINT    sh /tupperware/scripts/start_app.sh

ONBUILD COPY  ./ /app

ONBUILD RUN   sh /tupperware/scripts/on_build.sh
