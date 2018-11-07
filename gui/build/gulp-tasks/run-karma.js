/**
 *
 *  Copyright (c) 2014 All Rights Reserved by the SDL Group.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

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
