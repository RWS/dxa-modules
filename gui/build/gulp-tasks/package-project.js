'use strict';

/**
 * Package current project.
 * @module package-project
 * @param {Object} buildOptions Build options.
 */
module.exports = (buildOptions) => {
    const webpack = require('webpack');
    let compiler;

    return (cb) => {
        const config = require('../../webpack.config')(buildOptions.isTest);

        const onCompleted = (err, stats) => {
            console.log(stats.toString({
                chunks: false, // Makes the build much quieter
                colors: true
            }));

            const jsonStats = stats.toJson();
            cb(err || (jsonStats.errors && jsonStats.errors.length > 0 ? new Error('Failed to create bundles') : null));
        };

        if (compiler) {
            compiler.run(onCompleted);
        } else {
            compiler = webpack(config, onCompleted);
        }

    }
};
