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
 * Verify code quality of TypeScript using TSLint.
 * @module run-tslint
 * @param {Object} buildOptions Build options.
 * @param {Object} gulp Instance of gulp.
 */
module.exports = function (buildOptions, gulp) {
    var gulpTSLint = require('gulp-tslint');
    var gulpDebug = require('gulp-debug');
    var tsLintRules = require('../../tslint.json').rules;
    tsLintRules['no-debugger'] = !buildOptions.isDebug;

    return function (cb) {
        gulp.src(
            [
                buildOptions.sourcesPath + '**/*.ts',
                buildOptions.sourcesPath + '**/*.tsx',
                buildOptions.testPath + '**/*.ts',
                buildOptions.testPath + '**/*.tsx'
            ])
            .pipe(gulpTSLint({
                configuration: {
                    rules: tsLintRules
                },
                formatter: 'verbose'
            }))
            .pipe(gulpDebug({ title: 'Validated with TSLint' }))
            .pipe(gulpTSLint.report({
                reportLimit: 100
            }))
            .on('error', function (err) {
                cb(new Error('TSLint returned errors.'));
            })
            .on('end', cb);
    }
}
