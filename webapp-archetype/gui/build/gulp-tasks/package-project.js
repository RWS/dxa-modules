'use strict';

/**
 * Package current project.
 * @module package-project
 * @param {Object} buildOptions Build options.
 */
module.exports = (buildOptions) => {
    const webpack = require('webpack');

    return (cb) => {
        const config = require('../../webpack.config')(buildOptions.isTest, buildOptions.isDebug);
        let firstRun = true;
        let compiler;

        const onCompleted = (err, stats) => {
            console.log(stats.toString({
                chunks: false, // Makes the build much quieter
                colors: true
            }));

            if (firstRun) {
                firstRun = false;
                const jsonStats = stats.toJson();
                const error = err || (jsonStats.errors && jsonStats.errors.length > 0 ? new Error('Failed to create bundles') : null);
                cb(error, {
                    config,
                    compiler
                });
            }
        };

        compiler = webpack(config, onCompleted);
    }
};
