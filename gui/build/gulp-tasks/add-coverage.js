'use strict';

/**
 * Add coverage instrumentation for testing purposses.
 * @module add-coverage
 * @param {Object} buildOptions Build options.
 * @param {Object} gulp Instance of gulp.
 */
module.exports = function (buildOptions, gulp) {
    var async = require('async');
    var gulpDebug = require('gulp-debug');
    var through = require('through2');
    var gulpInstrumentJs = require('../gulp-plugins/instrument-js');

    // Gulp plugin to register all instrumented files
    var registerFile = function () {
        return through.obj(function (file, enc, cb) {
            buildOptions.coverage.filesInstrumented.push(file.path);

            cb(null, file);
        });
    };

    return function (cb) {
        // Reset instrumented files list
        buildOptions.coverage.filesInstrumented = [];
        if (buildOptions.isTestCoverage) {
            var paths = [
                buildOptions.distPath + '**/*.js',
                '!' + buildOptions.distPath + 'Index.js', // Exclude main page
                '!' + buildOptions.distPath + 'CatalinaPolyfills.js',
                '!' + buildOptions.distPath + 'lib/**',
                '!' + buildOptions.distPath + 'packages/**',
                '!' + buildOptions.distPath + 'SDL/**'
            ];
            // Add instrumentation
            gulp.src(paths)
                .pipe(gulpInstrumentJs())
                .pipe(registerFile())
                .pipe(gulpDebug({ title: 'Added code coverage' }))
                .pipe(gulp.dest(buildOptions.testPath + 'coverage/'))
                .on('end', cb);
        } else {
            cb();
        }
    };
}
