'use strict';

/**
 * Run packager.
 * @module run-packager
 * @param {string} workingDirectory Working directory.
 * @param {string} packagerExePath Packager executable path.
 * @param {string} commandLineOptions Command line options.
 */
module.exports = function (workingDirectory, packagerExePath, commandLineOptions) {
    return function (cb) {
        var currentWorkingDirectory = process.cwd();
        process.chdir(workingDirectory);

        var exec = require('child_process').exec;
        exec('"' + packagerExePath + '" ' + commandLineOptions, function (err, stdout, stderr) {
            console.log(stdout);
            console.log(stderr);
            process.chdir(currentWorkingDirectory);
            cb(err);
        });
    };
};
