﻿'use strict';

/**
 * Run karma.
 * @module run-karma
 * @param {Object} buildOptions Build options.
 * @param {Object} browserSync BrowserSync instance.
 */
module.exports = (buildOptions, browserSync) => {
    const karma = require('karma');
    const yargs = require('yargs');

    return (singleRun, cb, onTestRunCompleted) => {
        var configPath = process.cwd() + '/test/configuration/karma.conf.js';
        var urlPrefix = 'http://localhost:' + buildOptions.ports.httpServer + '/';
        var latestsResults = {}; // Set whenever tests are completed

        var browsersArg = yargs.argv.browsers;
        var karmaConfig = {
            configFile: configPath,
            singleRun: singleRun,
            proxies: {
                // Common UI
                '/SDL/': urlPrefix + 'SDL/',
                // Test folder
                '/test/': urlPrefix + 'test/',
                // src folder
                '/src/': urlPrefix,
                // Browsers sync proxies
                '/browser-sync/': urlPrefix + 'browser-sync-mock/'
            },
            browsers: browsersArg ? browsersArg.split(',') : ['Firefox'],
            preprocessors: {}
        };

        if (buildOptions.isTestCoverage) {
            // Add coverage to reporters
            karmaConfig.reporters = ['progress', 'coverage'];
            // Add coverage reporter
            karmaConfig.coverageReporter = { type: 'text-summary' };
        }

        // Start the test server
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
            cb(returnErr, latestsResults);
        });

        // Get the results
        karmaServer.on('browser_complete', (browser, results) => {
            latestsResults[browser.id] = results;
        });

        // Call test run completed callback if tests have run
        if (!singleRun && typeof onTestRunCompleted === 'function') {
            karmaServer.on('run_complete', () => onTestRunCompleted(latestsResults));
        }

        // Refresh files if browsersync reloads browser
        browserSync.emitter.on('browser:reload', () => karmaServer.refreshFiles());

        karmaServer.start();
    }
}
