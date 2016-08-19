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
                    // Don't open the browser in case of tests
                    // Karma is responsible for launching the browsers
                    open: !buildOptions.isTest,
                    // Server config
                    server: {
                        baseDir: buildOptions.distPath,
                        routes: {
                            // Third party dependencies
                            '/SDL/Common': './node_modules/sdl-catalina/' + commonFolderName() + '/',
                            '/SDL/Test': './node_modules/sdl-catalina/Test/',
                            '/SDL/ReactComponents': './node_modules/sdl-catalina-react-wrappers/dist/components/',
                            '/lib/react': './node_modules/react/dist/',
                            '/lib/react-dom': './node_modules/react-dom/dist/',
                            // Put test folder behind a virtual directory
                            '/test': buildOptions.testPath,
                            '/mocks': './mocks/'
                        }
                    },
                    middleware: [
                        (req, res, next) => {
                            if (buildOptions.isTestCoverage) {
                                // Redirect all js files to the ones which are instrumented to be used for code coverage
                                var url = req.url;
                                if (!_.startsWith(url, '/SDL/') && !_.startsWith(url, '/test/')
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
                        }
                    ]
                };

                browserSync.init(browserSyncOptions, cb);
            }
        });
    };
};
