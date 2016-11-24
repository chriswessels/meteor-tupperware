# chriswessels/meteor-tupperware

## Change log

### 1.3.1 (2016-11-24)

- Added ability to override internal port to bind to (thanks @aldeed)

### 1.3.0 (2016-08-07)

- Updated Node.js to 4.4.7

### 1.2.0 (2016-04-05)

- Updated Node.js to 0.10.43

Bundles:

- Node.js 0.10.43
- Tupperbuild 1.0.0
- Quickstart 0.1.2
- PhantomJS 2.1.1 (optional)
- ImageMagick 8:6.8.9.9-5 (optional)

### 1.1.1 (2016-01-27)

- Updated GPG receive keys for Node.js releases

Bundles:

- Node.js 0.10.41
- Tupperbuild 1.0.0
- Quickstart 0.1.2
- PhantomJS 2.1.1 (optional)
- ImageMagick 8:6.8.9.9-5 (optional)

### 1.1.0 (2016-01-27)

- Updated to `debian:jessie` base image for security updates.
- Updated to Node.js 0.10.41.
- Updated to ImageMagick 8:6.8.9.9-5.
- Updated to PhantomJS 2.1.1.

Bundles:

- Node.js 0.10.41
- Tupperbuild 1.0.0
- Quickstart 0.1.2
- PhantomJS 2.1.1 (optional)
- ImageMagick 8:6.8.9.9-5 (optional)

### 1.0.1 (2016-01-27)

- Updated README and quickstart `.dockerignore` to include `packages/*/.npm*`. Thanks @dperetti.

Bundles:

- Node.js 0.10.40
- Tupperbuild 1.0.0
- Quickstart 0.1.2
- PhantomJS 1.9.8 (optional)
- ImageMagick 8:6.7.7.10-5+deb7u3 (optional)

### 1.0.0 (2015-10-04)

- Improved image cleanup tactics. Images should be slightly smaller.
- Improved the way tupperbuild executes commands. If an error occurs, it will report the `stderr` and `stdout`.
- Added ability to specify pre and post `meteor build` commands to be run. See README.

Bundles:

- Node.js 0.10.40
- Tupperbuild 1.0.0
- Quickstart 0.1.1
- PhantomJS 1.9.8 (optional)
- ImageMagick 8:6.7.7.10-5+deb7u3 (optional)

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
