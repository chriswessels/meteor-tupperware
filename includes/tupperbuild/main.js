var ProgressBar = require('progress'),
    pkgjson = require('./package.json'),
    fs = require('fs'),
    _ = require('lodash'),
    async = require('async'),
    child_process = require('child_process'),
    // https = require('follow-redirects').https;
    request = require('request');

var bar,
    barOptions = {
      complete: '=',
      incomplete: ' ',
      width: 20,
      stream: process.stdout
    },
    tupperwareJsonDefaults = {
      "dependencies": {
        "phantomJs": false,
        "imageMagick": false
      },
      "buildOptions": {
        "mobileServer": false,
        "additionalFlags": false
      }
    };

var copyPath = '/app',
    meteorVersion,
    tupperwareJson = {};


/* Error out function */
function suicide () {
  var args = Array.prototype.slice.call(arguments);

  args.splice(0, 0, "\nAn error occurred:");

  console.log.apply(console, args);
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

    bar = new ProgressBar('Installing PhantomJS dependencies [:bar] :percent :etas', _.extend({}, barOptions, {
      total: aptDependencies.length
    }));

    var tasks = [];

    bar.render();

    _.each(aptDependencies, function (dep, index) {
      tasks.push(function (done) {
        try {
          child_process.spawn('apt-get', ['install', '-y', '--no-install-recommends', dep]).on('exit', function (code) {
            if (code !== 0) {
              throw new Error('Exit code: ' + code);
            } else {
              bar.tick();
              done();
            }
          });
        } catch (e) {
          suicide("Couldn't install " + dep + ' via apt-get.', e.toString());
        }
      });
    });

    tasks.push(function () {
      done();
    });

    async.series(tasks);
  }
  function downloadPhantomJs (done) {
    var version = process.env.PHANTOMJS_VERSION,
        folderName = 'phantomjs-' + version + '-linux-x86_64',
        tarName = folderName + '.tar.bz2',
        fileLocation = fs.createWriteStream("/tmp/" + tarName);

    fileLocation.on('finish', function () {
      fileLocation.close();
    });

    request.get('https://bitbucket.org/ariya/phantomjs/downloads/' + tarName).on('response', function (res) {
      var len = parseInt(res.headers['content-length'], 10);

      bar = new ProgressBar('Downloading PhantomJS ' + version + ' [:bar] :percent :etas', _.extend({}, barOptions, {
        total: len
      }));

      bar.render();

      res.pipe(fileLocation);

      res.on('data', function (chunk) {
        bar.tick(chunk.length);
      });

      res.on('end', function () {
        if (bar.complete) {
          done();
        } else {
          throw new Error('Download finished prematurely.');
        }
      });
    });
  }

  function installPhantomJs (done) {
    var version = process.env.PHANTOMJS_VERSION,
        folderName = 'phantomjs-' + version + '-linux-x86_64',
        tarName = folderName + '.tar.bz2';

    var steps = 2;

    bar = new ProgressBar('Installing PhantomJS ' + version + ' [:bar] :percent :etas', _.extend({}, barOptions, {
      total: steps
    }));

    bar.render();

    async.series([
      function (done) {
        child_process.spawn('tar', ['-xjf', '/tmp/' + tarName, '-C', '/usr/local/share/']).on('exit', function (code) {
          if (code !== 0) {
            suicide('tar exit code: ' + code);
          } else {
            bar.tick();
            done();
          }
        });
      },
      function (done) {
        child_process.spawn('ln', ['-s', '-f', '/usr/local/share/' + folderName + '/bin/phantomjs', '/usr/bin/phantomjs']).on('exit', function (code) {
          if (code !== 0) {
            suicide('ln exit code: ' + code);
          } else {
            bar.tick();
            done();
          }
        });
      },
      function () {
        done();
      }
    ]);
  }

  function installImageMagick (done) {
    var version = process.env.IMAGEMAGICK_VERSION;

    var aptDependencies = [
      'imagemagick='+version
    ];

    bar = new ProgressBar('Installing ImageMagick ' + version + ' [:bar] :percent :etas', _.extend({}, barOptions, {
      total: aptDependencies.length
    }));

    var tasks = [];

    bar.render();

    _.each(aptDependencies, function (dep, index) {
      tasks.push(function (done) {
        try {
          child_process.spawn('apt-get', ['install', '-y', '--no-install-recommends', dep]).on('exit', function (code) {
            if (code !== 0) {
              throw new Error('Exit code: ' + code);
            } else {
              bar.tick();
              done();
            }
          });
        } catch (e) {
          suicide("Couldn't install " + dep + ' via apt-get.', e.toString());
        }
      });
    });

    tasks.push(function () {
      done();
    });

    async.series(tasks);
  }

  var tasks = [];

  if (tupperwareJson.dependencies.phantomJs === true) {
    tasks.push(installPhantomJsDeps);
    tasks.push(downloadPhantomJs);
    tasks.push(installPhantomJs);
  }
  if (tupperwareJson.dependencies.imageMagick === true) {
    tasks.push(installImageMagick);
  }

  tasks.push(function () {
    done();
  });

  async.series(tasks);
}

function installMeteor (done) {
  process.exit(0);
  // console.log("Installing Meteor.js " + meteorVersion + "...");
  // child_process.spawn('curl', ['https://install.meteor.com | sed -e -r 's/RELEASE=\".*\"/RELEASE=" + meteorVersion + "/g' | sh");
  done();
}

function bundleApp (done) {
  // child_process.spawnSync("meteor bundle --architecture os.linux.x64_86");
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
