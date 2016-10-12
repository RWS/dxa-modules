'use strict';

/**
 * Setup a server.
 * @module serve
 * @param {Object} buildOptions Build options.
 * @param {Object} gulp Instance of gulp.
 * @param {Object} browserSync BrowserSync instance.
 * @param {function} commonFolderName Returns the name of the Catalina Common folder.
 */
module.exports = function (buildOptions, gulp, browserSync, commonFolderName) {
    const _ = require('lodash');
    const path = require('path');
    const runSequence = require('run-sequence').use(gulp);
    const fs = require('fs-extra');
    const reload = browserSync.reload;
    const portfinder = require('portfinder');
    portfinder.basePort = buildOptions.ports.httpServer;

    return function (cb, addWatcher) {
        addWatcher = typeof addWatcher === 'boolean' ? addWatcher : buildOptions.isDebug;
        if (addWatcher) {
            console.log('Setting up file watcher');
            var watcher = gulp.watch([
                buildOptions.sourcesPath + '**/*.less',
                buildOptions.sourcesPath + '**/*.js',
                buildOptions.sourcesPath + '**/*.ts',
                buildOptions.sourcesPath + '**/*.tsx',
                buildOptions.sourcesPath + '**/*.xml',
                buildOptions.sourcesPath + '**/*.htm',
                buildOptions.sourcesPath + '**/*.html',
                buildOptions.sourcesPath + '**/*.json',
                buildOptions.sourcesPath + '**/*.resjson',
                buildOptions.testPath + '**/*.ts',
                buildOptions.testPath + '**/*.tsx'
            ]);
            watcher.on('change', function (event) {
                console.log('File ' + event.path + ' was ' + event.type + '.');
                if (event.type === 'changed') {
                    var filePath = event.path.replace(/\\/g, '/'); // Replace back slashes with forward slashes

                    if (_.endsWith(filePath, '.less')) {
                        runSequence('compile-less', reload);
                    } else if (_.endsWith(filePath, '.ts') || _.endsWith(filePath, '.tsx')) {
                        runSequence(['run-tslint', 'compile-typescript', 'add-coverage'], function (err) {
                            if (err) {
                                console.error(err);
                            } else {
                                reload();
                            }
                        });
                    } else {
                        // Copy the file to the dist folder
                        var absoluteSourcePath = path.resolve(buildOptions.sourcesPath).replace(/\\/g, '/');

                        if (_.startsWith(filePath, absoluteSourcePath)) {
                            var destinationFilePath = buildOptions.distPath + filePath.substring(absoluteSourcePath.length + 1);
                            console.log('Copying ' + filePath + ' to ' + destinationFilePath);
                            fs.copy(filePath, destinationFilePath, function (err) {
                                console.log('Copying ' + filePath + ' to ' + destinationFilePath + ' finished');
                                if (err) {
                                    console.error(err);
                                } else {
                                    reload();
                                }
                            });
                        } else {
                            // A test file changed (does not require to be copied)
                            reload();
                        }
                    }
                }
            });
            console.log('Setting up file watcher finished');
        }

        portfinder.getPort((err, port) => {
            if (err) {
                cb(err);
            } else {
                buildOptions.ports.httpServer = port;

                let routes = {};
                if (buildOptions.isDebug) {
                    routes = {
                        // Third party dependencies
                        '/SDL/Common': './node_modules/sdl-catalina/' + commonFolderName() + '/',
                        '/SDL/ReactComponents': './node_modules/sdl-catalina-react-wrappers/dist/components/',
                        '/lib/react': './node_modules/react/dist/',
                        '/lib/react-dom': './node_modules/react-dom/dist/',
                        '/lib/history': './node_modules/history/umd/',
                        '/lib/es6-promise-polyfill': './node_modules/es6-promise-polyfill/'
                    }
                }
                routes['/test'] = buildOptions.testPath; // Put test folder behind a virtual directory
                routes['/SDL/Test'] = './node_modules/sdl-catalina/Test/';
                routes['/gui/mocks'] = './mocks/';
                routes['/gui/theming'] = buildOptions.distPath + 'theming/';

                // Start browser sync
                var browserSyncOptions = {
                    notify: false,
                    port: port,
                    ui: !buildOptions.isDefaultTask ? {
                        port: (port + 10),
                        weinre: {
                            port: (port + 11)
                        }
                    } : false,
                    open: true,
                    // Server config
                    server: {
                        baseDir: buildOptions.distPath,
                        routes: routes
                    },
                    middleware: [
                        (req, res, next) => {
                            if (buildOptions.isTestCoverage) {
                                // Redirect all js files to the ones which are instrumented to be used for code coverage
                                var url = req.url;
                                if (!_.startsWith(url, '/SDL/') && !_.startsWith(url, '/test/') && !_.startsWith(url, '/lib/')
                                    && _.endsWith(url, '.js?' + buildOptions.version)) {
                                    url = '/test/coverage' + url;
                                    req.url = url;
                                }
                            }
                            next();
                        },
                        (req, res, next) => {
                            // For test runs a mock folder name is used to proxy browser sync requests
                            // As karma also uses socket.io this can lead to collisions (browser is using multiple sockets)
                            if (req.url.toLowerCase().indexOf('/browser-sync-mock/') !== -1) {
                                // Return an empty file
                                res.writeHead(200);
                                res.end();
                            } else {
                                next();
                            }
                        },
                        (req, res, next) => {
                            // Don't cache mocks
                            var url = req.url;
                            if (_.startsWith(url, '/gui/mocks/')) {
                                res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
                                res.setHeader('Pragma', 'no-cache');
                                res.setHeader('Expires', '0');
                            }
                            next();
                        },
                        (req, res, next) => {
                            // Use main page for dynamic urls used for deep linking
                            // example: /ish:39137-1-1/ish:39137-1-512/MP330/User-Guide
                            const publicationContentRegex = /^\/[^\/]+%3A[0-9]+-[0-9]+-[0-9]+\/.*$/gi;
                            if (req.url.match(publicationContentRegex)) {
                                req.url = '/index.html';
                            }
                            next();
                        }
                    ]
                };

                browserSync.init(browserSyncOptions, cb);
            }
        });
    };
};
