# chriswessels/meteor-tupperware

*Alpha release - it's working! More documentation coming soon...*

This is a base Docker image that allows you to bundle your [Meteor.js](https://www.meteor.com) application into a lean, production-ready Docker image that you can deploy across your containerised infrastructure.

It includes [Node.js](https://nodejs.org/) and your bundled application (with platform-correct native extensions where required by included npm modules). You can also configure meteor-tupperware to install PhantomJS and ImageMagick if these are dependencies of your application.

## Usage

### Quickstart

In your Meteor.js project directory, run the following command:

    curl https://raw.githubusercontent.com/chriswessels/meteor-tupperware/master/quickstart.sh > /tmp/quickstart.sh && sh /tmp/quickstart.sh

This script will write a `Dockerfile` and `.dockerignore` into your current directory, preconfigured as below.

After running the quickstart script, and assuming you have Docker running, you can build an image of your Meteor.js app by running:

    docker build -t yourname/app .

### Manual setup

Using meteor-tupperware is very simple. Create a `Dockerfile` in your Meteor project directory with the following contents:

    FROM    chriswessels/meteor-tupperware

This base image contains build triggers that will run when you build your app image. These triggers will build your app, install any dependencies, and leave you with a lean, production-ready image.

You'll also need to create a `.dockerignore` file in your Meteor project directory (alongside the Dockerfile) with the following contents:

    .meteor/local
    packages/*/.build*

This file instructs Docker not to copy build artifacts into the image as these will be rebuilt anyway.

Assuming you have Docker running, you can build an image of your Meteor.js app by running:

    docker build -t yourname/app .

## Running your app image

The root process of the image will be set to the Node.js entrypoint for your Meteor application, so you can pass runtime settings straight into `docker run -e`, or bake them into your image with `ENV` directives in your Dockerfile. Node.js will listen on port 80 inside the container, but you can bind this to any port on the host.

Example of passing options into docker run:

    docker run --rm -e ROOT_URL=http://yourapp.com -e MONGO_URL=mongodb://url -e MONGO_OPLOG_URL=mongodb://oplog_url -p 8080:80 yourname/app

Example of baking options into your image using your `Dockerfile`:

    FROM    chriswessels/meteor-tupperware
    ENV     MONGO_URL="mongodb://url" MONGO_OPLOG_URL="mongodb://oplog_url" ROOT_URL="http://yourapp.com"

## Build configuration

meteor-tupperware supports a few build configuration options that can be modified by creating a `tupperware.json` file in your Meteor project directory, alongside your `Dockerfile`.

Default configuration options:

```json
{
  "dependencies": {
    "phantomJs": false,
    "imageMagick": false
  },
  "buildOptions": {
    "mobileServerUrl": false,
    "additionalFlags": false
  }
}
```

### Configuration Options Schema

- dependencies
  - phantomJs: `true` or `false` (for installing PhantomJS)
  - imageMagick: `true` or `false` (for installing ImageMagick)
- buildOptions
  - mobileServerUrl: `false` or type `string` (for specifying a server URL if you have mobile clients via Cordova)
  - additionalFlags: `false` or type `string` (for passing additional command line flags to `meteor build`)

## License

Please see the `LICENSE` file for more information.
