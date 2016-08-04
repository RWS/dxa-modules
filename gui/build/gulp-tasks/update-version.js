'use strict';

/**
* Update version.
* @module update-version
* @param {Object} buildOptions Build options.
* @param {Object} gulp Instance of gulp.
*/
module.exports = function UpdateVersion(buildOptions, gulp) {
    var gulpDebug = require('gulp-debug');
    var gulpReplace = require('gulp-replace');
    var gulpUpdateConfigurationVersion = require('../gulp-plugins/update-configuration-version');
    var async = require('async');

    return function (cb) {
        async.parallel([
            function (next) {
                // Update version in version.txt
                gulp.src([buildOptions.distPath + 'version.txt'])
                    .pipe(gulpReplace(/applicationVersion = .*[^\n]/gi, 'applicationVersion = ' + buildOptions.version))
                    .pipe(gulpReplace(/libraryVersion = .*[^\n]/gi, 'libraryVersion = ' + buildOptions.cuilVersion))
                    .pipe(gulpDebug({ title: 'Updated version' }))
                    .pipe(gulp.dest(buildOptions.distPath))
                    .on('end', next);
            },
            function (next) {
                // Update version in configuration.xml
                gulp.src([
                    buildOptions.distPath + 'configuration.xml'
                ], { base: buildOptions.distPath })
                    .pipe(gulpUpdateConfigurationVersion({
                        version: buildOptions.version,
                        cuilVersion: buildOptions.cuilVersion
                    }))
                    .pipe(gulpDebug({ title: 'Updated version' }))
                    .pipe(gulp.dest(buildOptions.distPath))
                    .on('end', next);
            }
        ], cb);
    }
}
