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
    const runSequence = require('run-sequence').use(gulp);
    const reload = browserSync.reload;
    const portfinder = require('portfinder');
    portfinder.basePort = buildOptions.ports.httpServer;
    const webpackDevMiddleware = require('webpack-dev-middleware');
    const webpackHotMiddleware = require('webpack-hot-middleware');

    return function (cb, webpackInstance, addWatcher) {
        const webpackConfig = webpackInstance.config;
        const webpackCompiler = webpackInstance.compiler;
        // Node.js middleware that compiles application in watch mode with HMR support
        // http://webpack.github.io/docs/webpack-dev-middleware.html
        const webpackDevMiddlewareInstance = webpackDevMiddleware(webpackCompiler, {
            publicPath: webpackConfig.output.publicPath,
            stats: webpackConfig.stats,
        });

        addWatcher = typeof addWatcher === 'boolean' ? addWatcher : buildOptions.isDebug;
        if (addWatcher) {
            console.log('Setting up file watcher');
            // Not all files are being watched here
            // Most of the files are handled by the webpack watcher
            var watcher = gulp.watch([
                buildOptions.sourcesPath + '**/*.xml',
                buildOptions.sourcesPath + '**/*.html',
                buildOptions.sourcesPath + '**/*.resjson'
            ]);
            watcher.on('change', function (event) {
                console.log('File ' + event.path + ' was ' + event.type + '.');
                if (event.type === 'changed') {
                    runSequence(['run-tslint', 'update-version'], 'copy-sources', reload);
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
                        '/lib/react-dom': './node_modules/react-dom/dist/'
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
                    open: !buildOptions.isDefaultTask,
                    // Server config
                    server: {
                        baseDir: buildOptions.distPath,
                        routes: routes
                    },
                    middleware: [
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
                            const publicationContentRegex = /^\/[^\/]+%3A[0-9]+-[0-9]+-[0-9]+.*$/gi;
                            if (req.url.match(publicationContentRegex)) {
                                req.url = '/index.html';
                            }
                            next();
                        },
                        webpackDevMiddlewareInstance,
                        webpackHotMiddleware(webpackCompiler)
                    ]
                };

                webpackCompiler.plugin('done', stats => {
                    if (!browserSync.active) {
                        browserSync.init(browserSyncOptions, cb);
                    }
                });

            }
        });
    };
};
