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
