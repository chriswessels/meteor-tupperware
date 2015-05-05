var progress = require('progress'),
    aptGet = require('node-apt-get'),
    pkgjson = require('./package.json'),
    fs = require('fs'),
    _ = require('lodash'),
    https = require('https');

var tupperwareJsonDefaults = {
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

function suicide () {
  var logArgs = Array.prototype.splice.call(arguments, 0, 0 "\nAn error occurred: ");
  console.log(logArgs);
  process.exit(1);
}

function installPhantomJs (version) {
  var aptDepdendencies = [
    'libfreetype6',
    'fontconfig',
    'libfreetype6-dev'
  ];

  _.each(aptDepdendencies, function (dep, index) {
    try {
      aptGet.install(dep, aptGetOptions);
    } catch (e) {
      suicide("Couldn't install " + dep + ' via apt-get.', e.toString());
    }
  });

  var req = https.request({
    host: 'download.github.com',
    port: 443,
    path: '/visionmedia-node-jscoverage-0d4608a.zip'
  });

  req.on('response', function (res){
    var len = parseInt(res.headers['content-length'], 10);

    var bar = new ProgressBar(' [:bar] :percent :etas', {
      complete: '=',
      incomplete: ' ',
      total: len
    });

    res.on('data', function (chunk) {
      bar.tick(chunk.length);
    });

    res.on('end', function () {
      console.log('\n');
    });
  });

  req.end();
}

function installImageMagick (version) {
  // var aptDepdendencies =
}

function main () {
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

  var copyPath = '/app',
      meteorVersion,
      tupperwareJson = {};

  /* Check for .meteor folder in Dockerfile app copy path and extract meteor release version */
  try {
    meteorVersion = fs.readFileSync(copyPath + '/.meteor/release');
  } catch (e) {
    suicide("This doesn't look like a Meteor project.", e.toString());
  }

  /* Attempt to read in tupperware.json file for settings */
  try {
    tupperwareJson = require(copyPath + '/tupperware.json');
    console.log('Settings in tupperware.json registered...');
  } catch (e) {
    console.log('No tupperware.json found, falling back to default settings...');
  }

  /* Patch object with defaults for anything undefined */
  _.defaults(tupperwareJson, tupperwareJsonDefaults);

  /* If settings specifies PhantomJS should be installed, do it */
  if (typeof tupperwareJson.dependencies.phantomJs === 'string') {
    installPhantomJs(tupperwareJson.dependencies.phantomJs);
  }

  /* If settings specifies ImageMagick should be installed, do it */
  if (typeof tupperwareJson.dependencies.imageMagick === 'string') {
    installImageMagick(tupperwareJson.dependencies.imageMagick);
  }
}

// Kick things off
main();

// steps
// check meteor project validiity
// attempt reading tupperware.json
// download and install deps (phantom or imagemagick)
// check meteor version and download and install meteor
// use meteor build on project
// remove meteor
