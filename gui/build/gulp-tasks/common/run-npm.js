'use strict';

/**
 * Run npm.
 * @module run-npm
 * @param {string} command Command to execute
 * @param {string} workingDirectory Working directory.
 * @param {function} cb Callback.
 */
module.exports = function (command, workingDirectory, cb) {
    var exec = require('child_process').exec;
    // Set max buffer to 2MB (default is 200KB)
    var childProcess = exec(`npm ${command}`, {
        maxBuffer: 1024 * 2048,
        cwd: workingDirectory
    }, (err, stdout, stderr) => {
        console.log(stderr);
        cb(err);
    });
    childProcess.stdout.on('data', data => console.log(data));
};
