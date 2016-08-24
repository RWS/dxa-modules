'use strict';

/**
 * Package current project.
 * @module package-project
 * @param {Object} buildOptions Build options.
 * @param {Object} gulp Instance of gulp.
 * @param {string} packagerExePath Packager executable path.
 */
module.exports = function (buildOptions, gulp, packagerExePath) {
    var fs = require('fs-extra');

    return function (cb) {
        if (!buildOptions.isDebug) {
            var basePath = String.prototype.substring.call(buildOptions.distPath, 1);
            // Run packager
            if (process.platform === 'win32') {
                var version = '-v ' + buildOptions.version;

                var workingDirectory = '.';
                var commandLineOptions = basePath + 'configuration.xml ' + basePath + 'configuration.xml ' + basePath + 'packages -release ' + version;

                var runPackagerTask = require('./common/run-packager')(workingDirectory, packagerExePath, commandLineOptions);
                runPackagerTask(cb);
            } else {
                console.log('Running the packager is only supported on Windows.');
                var configurationPath = process.cwd() + basePath + 'configuration.xml';
                // Remove debug flag from main configuration.xml file
                fs.readFile(configurationPath, function (err, data) {
                    if (err) {
                        cb(err);
                    } else {
                        var updatedData = data.toString().replace(/\<setting\s+name="debug"\s+value="true"\s?\/\>/gmi, '');
                        fs.writeFile(configurationPath, updatedData, cb);
                    }
                });
            }
        } else {
            // No need to package anything on debug
            cb();
        }
    }
};
