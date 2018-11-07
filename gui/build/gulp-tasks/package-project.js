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
