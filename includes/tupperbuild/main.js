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
  "preBuildCommands": [],
  "postBuildCommands": [],
  "buildOptions": {
    "mobileServerUrl": false,
    "additionalFlags": false
  }
};

var copyPath = '/app',
    meteorReleaseString,
    meteorVersion,
    tupperwareJson = {};

var log = {};

log.info = function () {
  var args = Array.prototype.slice.apply(arguments);
  args.splice(0, 0, '[-] ');
  return console.log.apply(console, args);
};

log.error = function () {
  var args = Array.prototype.slice.apply(arguments);
  args.splice(0, 0, '[!] ');
  return console.log.apply(console, args);
};

/* Utils */
function suicide () {
  log.info('Container build failed. meteor-tupperware is exiting...');
  process.exit(1);
}

function handleExecError(done, cmd, taskDesc, error, stdout, stderr) {
  if (! error) {
    done();
  } else {
    log.error('While attempting to ' + taskDesc + ', the command:', cmd);
    log.error('Failed with the exit code ' + error.code + '. The signal was ' + error.signal + '.');
    if (stdout) {
      log.info('The task produced the following stdout:');
      console.log(stdout);
    }
    if (stderr) {
      log.info('The task produced the following stderr:');
      console.log(stderr);
    }
    suicide();
  }
}

/* Steps */

function printBanner (done) {
  console.log(
    [
      "",
      "  _                                                      ",
      " | |_ _   _ _ __  _ __   ___ _ ____      ____ _ _ __ ___ ",
      " | __| | | | '_ \\| '_ \\ / _ \\ '__\\ \\ /\\ / / _` | '__/ _ \\",
      " | |_| |_| | |_) | |_) |  __/ |   \\ V  V / (_| | | |  __/",
      "  \\__|\\__,_| .__/| .__/ \\___|_|    \\_/\\_/ \\__,_|_|  \\___|",
      "           |_|   |_|                                     ",
      ""
    ].join("\n")
  );
  log.info("github.com/chriswessels/meteor-tupperware (tupperbuild v" + pkgjson.version + ")\n");

  done();
}

function checkCopyPath (done) {
  /* Check for .meteor folder in Dockerfile app copy path and extract meteor release version */
  try {
    meteorReleaseString = fs.readFileSync(copyPath + '/.meteor/release');
  } catch (e) {
    log.error("This doesn't look like a Meteor project.");
    suicide();
  }

  done();
}

function extractTupperwareJson (done) {
  /* Attempt to read in tupperware.json file for settings */
  try {
    tupperwareJson = require(copyPath + '/tupperware.json');
    log.info('Settings in tupperware.json registered.');
  } catch (e) {
    log.info('No tupperware.json found, using defaults.');
  }

  /* Patch object with defaults for anything undefined */
  _.defaults(tupperwareJson, tupperwareJsonDefaults);

  done();
}

function installAppDeps (done) {
  function updateAptLists(done) {
    log.info('Updating Package Lists...');
    var cmd = 'apt-get update';
    child_process.exec(cmd, _.partial(handleExecError, done, cmd, 'update apt package lists'));
  }
  function installPhantomJsDeps (done) {
    var aptDependencies = [
      'libfreetype6',
      'fontconfig',
      'libfreetype6-dev'
    ];

    log.info('Installing PhantomJS dependencies...');

    var tasks = [];

    _.each(aptDependencies, function (dep, index) {
      tasks.push(function (done) {
        var cmd = 'apt-get install -y --no-install-recommends ' + dep;
        child_process.exec(cmd, _.partial(handleExecError, done, cmd, 'install ' + dep));
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

      log.info('Downloading PhantomJS ' + version + '...');

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

    log.info('Installing PhantomJS ' + version + '...');

    async.series([
      function (done) {
        var cmd = 'tar -xjf /tmp/' + tarName + ' -C /usr/local/share/';
        child_process.exec(cmd, _.partial(handleExecError, done, cmd, 'extracting PhantomJS'));
      },
      function (done) {
        var cmd = 'ln -s -f /usr/local/share/' + folderName + '/bin/phantomjs /usr/bin/phantomjs';
        child_process.exec(cmd, _.partial(handleExecError, done, cmd, 'linking PhantomJS'));
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

    log.info('Installing ImageMagick ' + version + '...');

    var tasks = [];

    _.each(aptDependencies, function (dep, index) {
      tasks.push(function (done) {
        var cmd = 'apt-get install -y --no-install-recommends ' + dep;
        child_process.exec(cmd, _.partial(handleExecError, done, cmd, 'install ' + dep));
      });
    });

    tasks.push(function () {
      done();
    });

    async.series(tasks);
  }

  var tasks = [];

  if (tupperwareJson.dependencies.phantomJs === true || tupperwareJson.dependencies.imagemagick === true) {
    tasks.push(updateAptLists);
  }

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

  log.info('Downloading Meteor ' + meteorVersion + ' Installer...');

  async.series([
    function (done) {
      var cmd = 'curl https://install.meteor.com -o /tmp/install_meteor.sh';
      child_process.exec(cmd, _.partial(handleExecError, done, cmd, 'download the Meteor.js installer'));
    },
    function (done) {
      var cmd = "sed -i.bak -r 's/RELEASE=\".*\"/RELEASE=" + meteorVersion + "/g' /tmp/install_meteor.sh";
      child_process.exec(cmd, _.partial(handleExecError, done, cmd, 'patch the Meteor.js installer'));
    },
    function () {
      done();
    }
  ]);
}

function installMeteor (done) {
  // Have to use child_process.spawn instead of child_process.exec here
  // Otherwise Meteor installer dies randomly...

  log.info('Installing Meteor ' + meteorVersion + '...');

  var cmd = 'sh',
      args = ['/tmp/install_meteor.sh'];

  var stdOut = '', stdErr = '';

  var child = child_process.spawn(cmd, args);
  child.stdout.on('data', function (data) {
      stdOut += data;
  });
  child.stderr.on('data', function (data) {
      stdErr += data;
  });
  child.on('close', function (code) {
    var error;
    if (code !== 0) {
      error = { code: code };
    }
    handleExecError(done, cmd + ' ' + args.join(' '), 'install Meteor.js', error, stdOut, stdErr);
  });
}

function runPreBuildCommands (done) {
  if (tupperwareJson.preBuildCommands.length > 0) {
    log.info('Running pre-build commands...');

    var tasks = [];

    _.each(tupperwareJson.preBuildCommands, function (cmd, index) {
      tasks.push(function (done) {
        child_process.exec(cmd, {
          cwd: copyPath
        }, _.partial(handleExecError, done, cmd, 'run pre-build command'));
      });
    });

    tasks.push(function () {
      done();
    });

    async.series(tasks);

  } else {
    done();
  }
}

function buildApp (done) {
  log.info('Building your app...');
  var serverFlag = tupperwareJson.buildOptions.mobileServerUrl ? '--server ' + tupperwareJson.buildOptions.mobileServerUrl + ' ' : '',
      additionalFlags = tupperwareJson.buildOptions.additionalFlags ? tupperwareJson.buildOptions.additionalFlags : '';

  var cmd = "meteor build --directory " + process.env.OUTPUT_DIR + " --architecture os.linux.x86_64 " + serverFlag + additionalFlags;
  child_process.exec(cmd, {
    cwd: copyPath
  }, _.partial(handleExecError, done, cmd, 'build your application'));
}

function npmInstall (done) {
  log.info("Installing npm dependencies for your app...");

  var cmd = 'npm install',
      cwd = process.env.OUTPUT_DIR + '/bundle/programs/server';

  child_process.exec(cmd, {
    cwd: cwd
  }, _.partial(handleExecError, done, cmd, 'install your application\'s npm dependencies'));
}

function runPostBuildCommands (done) {
  if (tupperwareJson.postBuildCommands.length > 0) {
    log.info('Running post-build commands...');

    var tasks = [];

    _.each(tupperwareJson.postBuildCommands, function (cmd, index) {
      tasks.push(function (done) {
        child_process.exec(cmd, {
          cwd: copyPath
        }, _.partial(handleExecError, done, cmd, 'run post-build command'));
      });
    });

    tasks.push(function () {
      done();
    });

    async.series(tasks);

  } else {
    done();
  }
}

function runCleanup (done) {
  log.info("Performing final image cleanup...");

  async.series([
    function (done) {
      var cmd = "rm /usr/local/bin/meteor && rm -rf ~/.meteor";
      child_process.exec(cmd, _.partial(handleExecError, done, cmd, 'cleaning Meteor.js from the filesystem'));
    },
    function (done) {
      var cmd = 'sh /tupperware/scripts/_on_build_cleanup.sh';
      child_process.exec(cmd, _.partial(handleExecError, done, cmd, 'perform cleanup actions'));
    },
    function () {
      done();
    }
  ]);
}

function printDone (done) {
  log.info("Success!");
  done();
}

// Kick things off

async.series([
  printBanner,
  checkCopyPath,
  extractTupperwareJson,
  installAppDeps,
  downloadMeteorInstaller,
  installMeteor,
  runPreBuildCommands,
  buildApp,
  npmInstall,
  runPostBuildCommands,
  runCleanup,
  printDone
]);
