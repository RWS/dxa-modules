﻿'use strict';

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
                // Common UI
                '/SDL/': urlPrefix + '/app/SDL/',
                // Test folder
                '/test/': urlPrefix + '/app/test/',
                // src folder
                '/src/': urlPrefix + '/app/',
                // mocks
                '/gui/mocks/': urlPrefix + '/app/gui/mocks/',
                // theming
                '/gui/theming/': urlPrefix + '/app/theming/',
                // Browsers sync proxies
                '/browser-sync/': urlPrefix + 'browser-sync-mock/'
            },
            browsers: browsersArg ? browsersArg.split(',') : ['PhantomJS'],
            preprocessors: {}
        };

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
            if (results.coverage) {
                latestsResults[browser.id] = results;
            }
        });

        // Call test run completed callback if tests have run
        if (!singleRun && typeof onTestRunCompleted === 'function') {
            karmaServer.on('run_complete', () => onTestRunCompleted(latestsResults));
        }

        // Refresh files when a new bundle is created
        webpackInstance.onBundleCreated = () => karmaServer.refreshFiles();

        karmaServer.start();
    }
}
