var pkgjson = require('./package.json'),
    fs = require('fs'),
    _ = require('lodash'),
    async = require('async'),
    child_process = require('child_process'),
    // https = require('follow-redirects').https;
    request = require('request');

var tupperwareJsonDefaults = {
  "dependencies": {
    "phantomJs": false,
    "imageMagick": false
  },
  "buildOptions": {
    "mobileServerUrl": false,
    "additionalFlags": false
  }
};

var copyPath = '/app',
    meteorReleaseString,
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
      "  _                                                      ",
      " | |                                                     ",
      " | |_ _   _ _ __  _ __   ___ _ ____      ____ _ _ __ ___ ",
      " | __| | | | '_ \\| '_ \\ / _ \\ '__\\ \\ /\\ / / _` | '__/ _ \\",
      " | |_| |_| | |_) | |_) |  __/ |   \\ V  V / (_| | | |  __/",
      "  \\__|\\__,_| .__/| .__/ \\___|_|    \\_/\\_/ \\__,_|_|  \\___|",
      "           | |   | |                                     ",
      "           |_|   |_|",
      ""
    ].join("\n")
  );
  console.log("github.com/chriswessels/meteor-tupperware (tupperbuild v" + pkgjson.version + ")\n");

  done();
}

function checkCopyPath (done) {
  /* Check for .meteor folder in Dockerfile app copy path and extract meteor release version */
  try {
    meteorReleaseString = fs.readFileSync(copyPath + '/.meteor/release');
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

    console.log('Installing PhantomJS dependencies...');

    var tasks = [];

    _.each(aptDependencies, function (dep, index) {
      tasks.push(function (done) {
        try {
          child_process.spawn('apt-get', ['install', '-y', '--no-install-recommends', dep]).on('exit', function (code) {
            if (code !== 0) {
              throw new Error('Exit code: ' + code);
            } else {
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

      console.log('Downloading PhantomJS ' + version + '...');

      res.pipe(fileLocation);

      res.on('end', function () {
        done();
      });
    });
  }

  function installPhantomJs (done) {
    var version = process.env.PHANTOMJS_VERSION,
        folderName = 'phantomjs-' + version + '-linux-x86_64',
        tarName = folderName + '.tar.bz2';

    console.log('Installing PhantomJS ' + version + '...');

    async.series([
      function (done) {
        child_process.spawn('tar', ['-xjf', '/tmp/' + tarName, '-C', '/usr/local/share/']).on('exit', function (code) {
          if (code !== 0) {
            suicide('tar exit code: ' + code);
          } else {
            done();
          }
        });
      },
      function (done) {
        child_process.spawn('ln', ['-s', '-f', '/usr/local/share/' + folderName + '/bin/phantomjs', '/usr/bin/phantomjs']).on('exit', function (code) {
          if (code !== 0) {
            suicide('ln exit code: ' + code);
          } else {
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

    console.log('Installing ImageMagick ' + version + '...');

    var tasks = [];

    _.each(aptDependencies, function (dep, index) {
      tasks.push(function (done) {
        try {
          child_process.spawn('apt-get', ['install', '-y', '--no-install-recommends', dep]).on('exit', function (code) {
            if (code !== 0) {
              throw new Error('Exit code: ' + code);
            } else {
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

function downloadMeteorInstaller (done) {
  var versionRegex = new RegExp('^METEOR@(.*)\n', 'ig');

  var matches = versionRegex.exec(meteorReleaseString);

  meteorVersion = matches[1];

  console.log('Downloading Meteor ' + meteorVersion + ' Installer...');

  async.series([
    function (done) {
      child_process.spawn('curl', ['https://install.meteor.com', '-o', '/tmp/install_meteor.sh']).on('exit', function (code) {
        if (code !== 0) {
          suicide('curl exit code: ' + code);
        } else {
          done();
        }
      });
    },
    function (done) {
      child_process.exec("sed -i.bak -r 's/RELEASE=\".*\"/RELEASE=" + meteorVersion + "/g' /tmp/install_meteor.sh").on('exit', function (code) {
        if (code !== 0) {
          suicide('sed exit code: ' + code);
        } else {
          done();
        }
      });
    },
    function () {
      done();
    }
  ]);
}

function installMeteor (done) {
  console.log('Installing Meteor ' + meteorVersion + '...');
  
  child_process.spawn('sh', ['/tmp/install_meteor.sh'], { stdio: 'inherit' }).on('exit', function (code) {
    if (code !== 0) {
      suicide('installer exit code: ' + code);
    } else {
      done();
    }
  });
}

function buildApp (done) {
  console.log('Building your app...');
  var serverFlag = tupperwareJson.buildOptions.mobileServerUrl ? '--server ' + tupperwareJson.buildOptions.mobileServerUrl + ' ' : '',
      additionalFlags = tupperwareJson.buildOptions.additionalFlags ? tupperwareJson.buildOptions.additionalFlags : '';

  child_process.exec("meteor build --directory " + process.env.OUTPUT_DIR + " --architecture os.linux.x86_64 " + serverFlag + additionalFlags, {
    cwd: copyPath
  }).on('exit', function (code) {
    if (code !== 0) {
      suicide('meteor build exit code: ' + code);
    } else {
      done();
    }
  });
}

function cleanMeteor (done) {
  console.log("Cleaning up Meteor...");
  child_process.exec("rm /usr/local/bin/meteor && rm -rf ~/.meteor").on('exit', function (code) {
    if (code !== 0) {
      suicide('cleanup exit code: ' + code);
    } else {
      done();
    }
  });
}

function npmInstall (done) {
  console.log("Installing npm dependencies for your app...");
  child_process.exec('npm install', {
    cwd: process.env.OUTPUT_DIR + '/bundle/programs/server'
  }).on('exit', function (code) {
    if (code !== 0) {
      suicide('npm exit code: ' + code);
    } else {
      done();
    }
  });
}

function printDone (done) {
  console.log("Done!");
  done();
}

async.series([
  printBanner,
  checkCopyPath,
  extractTupperwareJson,
  installAppDeps,
  downloadMeteorInstaller,
  installMeteor,
  buildApp,
  cleanMeteor,
  npmInstall,
  printDone
]);
