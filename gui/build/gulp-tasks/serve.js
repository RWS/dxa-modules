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
  const path = require("path");
  const fs = require("fs-extra");
  const webpackDevMiddleware = require("webpack-dev-middleware");
  const webpackHotMiddleware = require("webpack-hot-middleware");
  const proxy = require("proxy-middleware");
  const url = require("url");

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
      "/$mocks$/": "./mocks/",
      "/gui/theming": buildOptions.distPath + "theming/",
      "/": buildOptions.distPath
    };

    const port = buildOptions.ports.httpServer;
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
          if (_.startsWith(url, "/$mocks$/")) {
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
        },
        ...(buildOptions.proxies || [])
          .map(({from, to}) => {
            const toUrl = url.parse(to);
            toUrl.route = from;
            return toUrl;
          })
          .map(proxy)
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

      // Write output to the disk (for test only)
      // This is needed so karma can pick up changes to the bundle and rerun the tests
      if (buildOptions.isTest) {
        webpackCompiler.plugin("emit", (compilation, callback) => {
          const assets = compilation.assets;
          Object.keys(assets).forEach(key => {
            if (!key.match(/\.hot-update.*$/)) {
              const file = path.resolve(buildOptions.distPath + "assets/", key);
              const data = assets[key].source();
              fs.writeFileSync(file, data);
            }
          });
          callback();
        });
      }

      // Close middleware when browsersync closes
      browserSync.emitter.on("service:exit", () => {
        webpackDevMiddlewareInstance.close();
      });

      webpackCompiler.plugin("done", stats => {
        if (!browserSync.active) {
          browserSync.init(browserSyncOptions, () => {
            buildOptions.ports.httpServer = browserSync.getOption("port");
            cb();
          });
        }
        if (typeof webpackInstance.onBundleCreated === "function") {
          webpackInstance.onBundleCreated();
        }
      });
    } else {
      browserSync.init(browserSyncOptions, () => {
        buildOptions.ports.httpServer = browserSync.getOption("port");
        cb();
      });
    }
  };
};
