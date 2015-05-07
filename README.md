# chriswessels/meteor-tupperware

*Alpha release - it's working! More documentation coming soon...*

This is a base Docker image that allows you to bundle your [Meteor.js](https://www.meteor.com) application into a lean, production-ready Docker image that you can deploy across your containerised infrastructure.

It includes [Node.js](https://nodejs.org/) and your bundled application (with platform-correct native extensions where required by included npm modules). You can also configure meteor-tupperware to install PhantomJS and ImageMagick if these are dependencies of your application.

## Usage

To use meteor-tupperware, create a `Dockerfile` in your Meteor project directory with the following contents:

    FROM    chriswessels/meteor-tupperware

You'll also need to create a `.dockerignore` file in your Meteor project directory (alongside the Dockerfile) with the following contents:

    .meteor/local
    packages/*/.build*

You can then build your application into a fully assembled Docker image with:

    $ docker build -t yourname/app .

That's it! You can now run the image, push it to a registry, or whatever else you want. You have a production ready image of your app.

The root process of the container will be set to the Node.js entrypoint for your Meteor application, so you can pass runtime settings straight into `docker run -e`, or bake them into your image with `ENV` directives in your Dockerfile. Node.js will listen on port 80 inside the container, but you can bind this to any port on the host.

Example of passing options into docker run:

    $ docker run --rm -e ROOT_URL=http://yourapp.com -e MONGO_URL=mongodb://url -e MONGO_OPLOG_URL=mongodb://oplog_url -p 8080:80 yourname/app

Example of baking options into your Dockerfile:

    FROM    chriswessels/meteor-tupperware
    ENV     MONGO_URL="mongodb://url" MONGO_OPLOG_URL="mongodb://oplog_url" ROOT_URL="http://yourapp.com"

## Build configuration

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

You can override these options by creating a `tupperware.json` configuration file in your Meteor project directory, alongside your `Dockerfile`.

### Configuration Options Schema

- dependencies
  - phantomJs: `Boolean` (for installing PhantomJS)
  - imageMagick: `Boolean` (for installing ImageMagick)
- buildOptions
  - mobileServerUrl: `false` or `string` (for specifying a server URL if you have mobile clients via Cordova)
  - additionalFlags: `false` or `string` (for passing additional command line flags to `meteor build`)

## License

Please see the `LICENSE` file for more information.
