'use strict';

/**
 * Package current project.
 * @module package-project
 * @param {Object} buildOptions Build options.
 * @param {Object} browserSync BrowserSync instance.
 */
module.exports = (buildOptions, browserSync) => {
    const webpack = require('webpack');

    return (cb) => {
        const config = require('../../webpack.config')(buildOptions.isTest);
        let firstRun = true;

        const onCompleted = (err, stats) => {
            console.log(stats.toString({
                chunks: false, // Makes the build much quieter
                colors: true
            }));

            if (firstRun) {
                firstRun = false;
                const jsonStats = stats.toJson();
                const error = err || (jsonStats.errors && jsonStats.errors.length > 0 ? new Error('Failed to create bundles') : null);
                cb(error);
            } else {
                browserSync.reload();
            }
        };

        const compiler = webpack(config, onCompleted);
        if (!buildOptions.isDefaultTask && buildOptions.isDebug) {
            compiler.watch({
                aggregateTimeout: 500,
                poll: true
            }, onCompleted);
        }
    }
};
