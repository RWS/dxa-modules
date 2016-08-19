'use strict';

/**
 * Compile all LESS files.
 * @module compile-less
 * @param {Object} buildOptions Build options.
 * @param {Object} gulp Instance of gulp.
 */
module.exports = function (buildOptions, gulp) {
    var autoPrefixer = require('autoprefixer')({
        browsers: ['last 1 version', 'ie 10', 'ie 11'],
        remove: false
    });
    var gulpLess = require('gulp-less');
    var gulpDebug = require('gulp-debug');
    var gulpIf = require('gulp-if');
    var gulpPostCss = require('gulp-postcss');
    var gulpCsso = require('gulp-csso');

    return function (cb) {
        // Compile Less
        return gulp.src(
            [
                buildOptions.sourcesPath + '**/*.less'
            ])
        .pipe(gulpLess())
        .pipe(gulpDebug({ title: 'Less output' }))
        .pipe(gulpPostCss([autoPrefixer]))
        .pipe(gulpDebug({ title: 'Auto prefixer output' }))
        .pipe(gulpIf(!buildOptions.isDebug, gulpCsso()))
        .pipe(gulpIf(!buildOptions.isDebug, gulpDebug({ title: 'Uglified output' })))
        .pipe(gulp.dest(buildOptions.distPath));
    };
}
