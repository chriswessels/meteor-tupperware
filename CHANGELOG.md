# chriswessels/meteor-tupperware

## Change log

### 0.1.2 (2015-07-23)

- Updated Node.js.
- Switched from Docker Hub to Quay.io as primary Docker Repository host (better auto-tagging). Docker Hub will still build the latest releases, but without tagging the version release.
- Updated Quickstart with new `FROM` directive.
- Updated Tupperbuild with latest dependencies.

Bundles:

- Node.js 0.10.40
- Tupperbuild 0.1.1
- Quickstart 0.1.1
- PhantomJS 1.9.8 (optional)
- ImageMagick 8:6.7.7.10-5+deb7u3 (optional)

### 0.1.1 (2015-07-03)

- Updated Node.js.
- Changed app run script to set environment variables `NODE_ENV` and `METEOR_ENV` to `production` by default. You can override these in your `docker run` command with `-e`.
- Waiting for a static binary of PhantomJS 2.0.1 to be released before upgrading.

Bundles:

- Node.js 0.10.39
- PhantomJS 1.9.8 (optional)
- ImageMagick 8:6.7.7.10-5+deb7u3 (optional)
- Quickstart 0.1.0
- Tupperbuild 0.1.0

### 0.1.0 (2015-05-09)

- Initial Release.

Bundles:

- Node.js 0.10.38
- PhantomJS 1.9.8 (optional)
- ImageMagick 8:6.7.7.10-5+deb7u3
- Quickstart 0.1.0
- Tupperbuild 0.1.0
