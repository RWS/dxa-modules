'use strict';

const fs = require('fs-extra');
const ditaOtStylesDir = './node_modules/dita-ot/src/main/plugins/org.dita.xhtml/resource/';
const gulpWrapCss = require('../gulp-plugins/wrap-css');
const gulpDebug = require('gulp-debug');
const gulpChmod = require('gulp-chmod');
const gulpIf = require('gulp-if');
const gulpPostCss = require('gulp-postcss');
const gulpCsso = require('gulp-csso');
const autoPrefixer = require('autoprefixer')({
    browsers: ['last 1 version', 'ie 10', 'ie 11'],
    remove: false
});

/**
 * Add a specific scope to the dita-ot stylesheets.
 * This to make sure that they don't apply styles to elements outside of the preview.
 * @module wrap-dita-ot-css
 * @param {Object} buildOptions Build options.
 * @param {Object} gulp Instance of gulp.
 */
module.exports = (buildOptions, gulp) => {
    return cb => {
        // Compile Less
        return gulp.src(
            [
                `${ditaOtStylesDir}commonltr.css`,
                `${ditaOtStylesDir}commonrtl.css`
            ])
            .pipe(gulpChmod(666)) // Remove read-only flag
            .pipe(gulpWrapCss({ className: 'page-content' }))
            .pipe(gulpDebug({ title: 'Wrapped css into a single class' }))
            .pipe(gulpPostCss([autoPrefixer]))
            .pipe(gulpDebug({ title: 'Auto prefixer output' }))
            .pipe(gulpIf(!buildOptions.isDebug, gulpCsso()))
            .pipe(gulpIf(!buildOptions.isDebug, gulpDebug({ title: 'Uglified output' })))
            .pipe(gulp.dest(buildOptions.distPath + 'dita-ot/styles/'));
    };
}
