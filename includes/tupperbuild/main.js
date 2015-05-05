var progress = require('progress'),
    aptGet = require('node-apt-get'),
    pkgjson = require('./package.json'),
    fs = require('fs'),
    _ = require('lodash'),
    async = require('async'),
    https = require('https');

var bar,
    tupperwareJsonDefaults = {
      "dependencies": {
        "phantomJs": false,
        "imageMagick": false
      },
      "buildOptions": {
        "mobileServer": false,
        "additionalFlags": false
      }
    },
    aptGetOptions = {
      'no-install-recommends': true,
      'force-yes': true
    };

var copyPath = '/app',
    meteorVersion,
    tupperwareJson = {};


/* Error out function */
function suicide () {
  var logArgs = Array.prototype.splice.call(arguments, 0, 0 "\nAn error occurred: ");
  console.log(logArgs);
  process.exit(1);
}

function printBanner (done) {
  console.log(
    [
      "",
      "_/_    __  __    _  __ _   _ _   __   _ ",
      "(__(_(_/_)_/_)__(/_/ (_(_(/ (_(_/ (__(/_",
      "    .-/ .-/                             ",
      "   (_/ (_/                              ",
      ""
    ].join("\n")
  );
  console.log("github.com/chriswessels/meteor-tupperware (tupperbuild v" + pkgjson.version + ")\n");

  done();
}

function checkCopyPath (done) {
  /* Check for .meteor folder in Dockerfile app copy path and extract meteor release version */
  try {
    meteorVersion = fs.readFileSync(copyPath + '/.meteor/release');
  } catch (e) {
    suicide("This doesn't look like a Meteor project.", e.toString());
  }

  done();
}

function extractTupperwareJson (done) {
  /* Attempt to read in tupperware.json file for settings */
  try {
    tupperwareJson = require(copyPath + '/tupperware.json');
    console.log('Settings in tupperware.json registered...');
  } catch (e) {
    console.log('No tupperware.json found, falling back to default settings...');
  }

  /* Patch object with defaults for anything undefined */
  _.defaults(tupperwareJson, tupperwareJsonDefaults);

  done();
}

function installAppDeps (done) {
  function installPhantomJsDeps (done) {
    var aptDependencies = [
      'libfreetype6',
      'fontconfig',
      'libfreetype6-dev'
    ];

    bar = new ProgressBar('Installing PhantomJS dependencies [:bar] :percent :etas', {
      complete: '=',
      incomplete: ' ',
      total: aptDependencies.length
    });

    _.each(aptDependencies, function (dep, index) {
      try {
        aptGet.install(dep, aptGetOptions).on('close', function(code) {
          if (code === 0) {
            bar.tick();
            if (bar.complete) {
              done();
            }
          } else {
            throw new Error('apt-get return code: ' + code);
          }
        }).on('error', function (error) {
          throw error;
        });
      } catch (e) {
        suicide("Couldn't install " + dep + ' via apt-get.', e.toString());
      }
    });
  }
  function installPhantomJs (done) {
    var req = https.request({
      host: 'download.github.com',
      port: 443,
      path: '/visionmedia-node-jscoverage-0d4608a.zip'
    });

    req.on('response', function (res){
      var len = parseInt(res.headers['content-length'], 10);

      var bar = new ProgressBar('Installing PhantomJS [:bar] :percent :etas', {
        complete: '=',
        incomplete: ' ',
        total: len
      });

      res.on('data', function (chunk) {
        bar.tick(chunk.length);
      });

      res.on('end', function () {
        req.end();
        if (bar.complete) {
          done();
        }
      });
    });
  }

  function installImageMagick (done) {
    done();
  }

  var tasks = [];

  if (typeof tupperwareJson.dependencies.phantomJs === 'string') {
    tasks.push.apply(tasks, [installPhantomJsDeps, installPhantomJs]);
  }
  if (typeof tupperwareJson.dependencies.imageMagick === 'string') {
    tasks.push(installImageMagick);
  }

  tasks.push(done);

  async.series(tasks);
}

function installMeteor (done) {

}

async.series([
  printBanner,
  checkCopyPath,
  extractTupperwareJson,
  installAppDeps,
  installMeteor
]);

// steps
// check meteor project validiity
// attempt reading tupperware.json
// download and install deps (phantom or imagemagick)
// check meteor version and download and install meteor
// use meteor build on project
// remove meteor
