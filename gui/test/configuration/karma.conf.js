module.exports = function (config) {
    config.set({
        basePath: '../../',

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],

        /**
         * Always load these three files in the specified order.
         * Use file paths, not urls inside this configuration section.
         * Paths should be relative to the path of this config file.
         */
        files: [
            // React
            { pattern: './node_modules/react/dist/react-with-addons.js', watched: false },
            { pattern: './node_modules/react-dom/dist/react-dom.js', watched: false },
            { pattern: './node_modules/react-dom/dist/react-dom-server.js', watched: false },
            //Vendors 
            { pattern: './dist/assets/vendor.bundle.js', watched: false },
            // Application
            './dist/assets/testConfiguration.bundle.js',
            './dist/assets/stylesheets/test.css',
            './dist/assets/test.bundle.js',
            {
                pattern: './dist/assets/test.bundle.js.map',
                included: false
            }
        ],

        /**
         * Proxies need to be configured in order to serve files to karma.
         * Karma sets up its own http server and only loads files defined in the "files" section of the config.
         *
         * We configure this inside the main gulp file as the port number is a dynamic property.
         */
        proxies: {
        },

        reporters: ['progress', 'coverage'],

        coverageReporter: { type: 'text-summary' },

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_ERROR,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatchBatchDelay: 1000,
        autoWatch: true,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Chrome', 'Firefox', 'IE'],

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,

        // Output file for jasmine
        htmlReporter: {
            outputFile: 'output/Results.html'
        },

        // The number of disconnections tolerated.
        browserDisconnectTolerance: 1,

        // How long will Karma wait for a message from a browser before disconnecting from it (in ms).
        browserNoActivityTimeout: 180000
    });
};
