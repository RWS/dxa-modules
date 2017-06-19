'use strict';

/**
 * Run karma.
 * @module run-karma
 * @param {Object} buildOptions Build options.
 */
module.exports = (buildOptions) => {
    const karma = require('karma');
    const yargs = require('yargs');

    return (webpackInstance, singleRun, cb, onTestRunCompleted) => {
        var configPath = process.cwd() + '/test/configuration/karma.conf.js';
        var urlPrefix = 'http://localhost:' + buildOptions.ports.httpServer + '/';
        var latestsResults = {}; // Set whenever tests are completed

        var browsersArg = yargs.argv.browsers;
        var karmaConfig = {
            configFile: configPath,
            singleRun: singleRun,
            proxies: {
                '/$mocks$/': `${urlPrefix}/$mocks$/`,
                // Browsers sync proxies
                '/browser-sync/': `${urlPrefix}/browser-sync-mock/`
            },
            browsers: browsersArg ? browsersArg.split(',') : ['PhantomJS'],
            preprocessors: {}
        };

        // Start the test server
        let karmaExitedCalled = false;
        var karmaServer = new karma.Server(karmaConfig, (exitCode, error) => {
            console.log('Karma has exited with ' + exitCode);
            var returnErr;
            if (exitCode !== 0) {
                // Error object is not necessarily set on an error exit code
                if (error) {
                    returnErr = error;
                } else {
                    returnErr = new Error('Tests failed.');
                }
            }
            if (!karmaExitedCalled) {
                cb(returnErr, latestsResults);
            }
            karmaExitedCalled = true;
        });

        // Get the results
        karmaServer.on('browser_complete', (browser, results) => {
            if (results.coverage) {
                latestsResults[browser.id] = results;
            }
        });

        // Call test run completed callback if tests have run
        if (!singleRun && typeof onTestRunCompleted === 'function') {
            karmaServer.on('run_complete', () => onTestRunCompleted(latestsResults));
        }

        karmaServer.start();
    }
}
