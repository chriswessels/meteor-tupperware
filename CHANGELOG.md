# chriswessels/meteor-tupperware

## Change log

### 0.1.1

- Updated Node.js.
- Changed app run script to set environment variables `NODE_ENV` and `METEOR_ENV` to `production` by default. You can override these in your `docker run` command with `-e`.
- Waiting for a static binary of PhantomJS 2.0.1 to be released before upgrading.

Bundles:

- Node.js 0.10.39
- PhantomJS 1.9.8 (optional)
- ImageMagick 8:6.7.7.10-5+deb7u3 (optional)
- Quickstart 0.1.0
- Tupperbuild 0.1.0

### 0.1.0

- Initial Release.

Bundles:

- Node.js 0.10.38
- PhantomJS 1.9.8 (optional)
- ImageMagick 8:6.7.7.10-5+deb7u3
- Quickstart 0.1.0
- Tupperbuild 0.1.0
