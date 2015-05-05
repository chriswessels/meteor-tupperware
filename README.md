# chriswessels:meteor-tupperware

*Work in progress and not functional. Nothing to see here, yet!*

This is a parent Docker image that allows you to bundle your [Meteor.js](https://www.meteor.com) application into a Docker image that you can deploy across your containerised infrastructure.

It includes [Node.js](https://nodejs.org/) and your bundled application (with platform-correct native extensions where required by included npm modules). You can also configure meteor-tupperware to install PhantomJS and ImageMagick if these are dependencies of your application.

## Use

To use meteor-tupperware, create a `Dockerfile` in your Meteor project directory with the following contents:

    FROM chriswessels:meteor-tupperware

You can then build your application into a fully assembled Docker image with:

    $ docker build -t your-application .

The root process of the container will be set to the Node.js entrypoint for your Meteor application, so you can pass runtime settings straight into `docker run -e`, or bake them into your image with `ENV` directives in your Dockerfile.

## Build configuration

```json
/* Default configuration settings */
{
  "dependencies": {
    "phantomJs": false,
    "imageMagick": false
  },
  "buildOptions": {
    "mobileServer": false,
    "additionalFlags": false
  }
}
```

You can override these options by creating a `tupperware.json` configuration file in your Meteor project directory, alongside your `Dockerfile`.

## License

Please see the `LICENSE` file for more information.
