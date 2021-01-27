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

"use strict";

/**
 * Setup a server.
 * @module serve
 * @param {Object} buildOptions Build options.
 * @param {Object} gulp Instance of gulp.
 * @param {Object} browserSync BrowserSync instance.
 */
module.exports = function(buildOptions, gulp, browserSync) {
  const _ = require("lodash");
  const webpackDevMiddleware = require("webpack-dev-middleware");
  const webpackHotMiddleware = require("webpack-hot-middleware");

  return function(cb, webpackInstance) {
    const webpackConfig = webpackInstance.config;
    const webpackCompiler = webpackInstance.compiler;

    const isDebug = buildOptions.isDebug;
    const routes = {
      // Third party dependencies
      "/lib/react": isDebug
        ? "./node_modules/react/dist/"
        : `${buildOptions.distPath}/lib/react`,
      "/lib/react-dom": isDebug
        ? "./node_modules/react-dom/dist/"
        : `${buildOptions.distPath}/lib/react-dom`,
      // Application
      "/gui/mocks": "./node_modules/@sdl/delivery-ish-dd-webapp-gui/mocks",
      "/": buildOptions.distPath
    };

    const port = 9005;
    // Start browser sync
    var browserSyncOptions = {
      notify: false,
      port: port,
      ui: !buildOptions.isDefaultTask
        ? {
            port: port + 10,
            weinre: {
              port: port + 11
            }
          }
        : false,
      open: !buildOptions.isDefaultTask,
      startPath: "/",
      // Server config
      server: {
        baseDir: buildOptions.distPath,
        routes: routes
      },
      middleware: [
        (req, res, next) => {
          // For test runs a mock folder name is used to proxy browser sync requests
          // As karma also uses socket.io this can lead to collisions (browser is using multiple sockets)
          if (req.url.toLowerCase().indexOf("/browser-sync-mock/") !== -1) {
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
          if (_.startsWith(url, "/gui/mocks/")) {
            res.setHeader(
              "Cache-Control",
              "no-cache, no-store, must-revalidate"
            );
            res.setHeader("Pragma", "no-cache");
            res.setHeader("Expires", "0");
          }
          next();
        },
        (req, res, next) => {
          // Use main page for dynamic urls used for deep linking
          // example: /39137/234/MP330/User-Guide (only the first number is mandatory)
          const publicationContentRegex = /^\/[0-9]+.*$/gi; // All urls starting with a number
          const productFamiliesContentRegex = /^\/publications.*$/gi; // All urls starting with a number
          if (
            req.url.match(/^(\/home(;jsessionid=[\w\d]+)?)?$/gi) ||
            req.url.match(publicationContentRegex) ||
            req.url.match(productFamiliesContentRegex)
          ) {
            req.url = "/index.html";
          }

          next();
        }
      ]
    };

    if (buildOptions.isDebug && !buildOptions.isDefaultTask) {
      // Node.js middleware that compiles application in watch mode with HMR support
      // http://webpack.github.io/docs/webpack-dev-middleware.html
      const webpackDevMiddlewareInstance = webpackDevMiddleware(
        webpackCompiler,
        {
          publicPath: webpackConfig.output.publicPath,
          stats: webpackConfig.stats
        }
      );
      // Enable Hot Module Replacement
      browserSyncOptions.middleware.push(webpackDevMiddlewareInstance);
      browserSyncOptions.middleware.push(
        webpackHotMiddleware(webpackCompiler, { path: "/assets" })
      );

      // Close middleware when browsersync closes
      browserSync.emitter.on("service:exit", () => {
        webpackDevMiddlewareInstance.close();
      });

      webpackCompiler.plugin("done", stats => {
        if (!browserSync.active) {
          browserSync.init(browserSyncOptions, cb);
        }
        if (typeof webpackInstance.onBundleCreated === "function") {
          webpackInstance.onBundleCreated();
        }
      });
    } else {
      browserSync.init(browserSyncOptions, cb);
    }
  };
};
