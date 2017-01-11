'use strict';

/**
 * Copy all source files to the dist folder.
 * @module copy-sources
 * @param {Object} buildOptions Build options.
 * @param {Object} gulp Instance of gulp.
 */
module.exports = function (buildOptions, gulp) {
    var gulpDebug = require('gulp-debug');

    return function (cb) {
        // Copy sources
        gulp.src([
            buildOptions.sourcesPath + '**/*.xml',
            buildOptions.sourcesPath + '**/*.txt',
            buildOptions.sourcesPath + '**/*.html',
            buildOptions.sourcesPath + '**/*.resjson'
        ].concat(buildOptions.excludePatterns.global))
            .pipe(gulpDebug({ title: 'Copying' }))
            .pipe(gulp.dest(buildOptions.distPath))
            .on('end', cb);
    }
};
