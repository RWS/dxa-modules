'use strict';

const fs = require('fs-extra');
const ditaOtStylesDir = './node_modules/dita-ot/src/main/plugins/org.dita.xhtml/resource/';
const gulpWrapCss = require('../gulp-plugins/wrap-css');
const gulpDebug = require('gulp-debug');
const gulpChmod = require('gulp-chmod');
const gulpIf = require('gulp-if');
const gulpCsso = require('gulp-csso');

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
            .pipe(gulpIf('*ltr.css', gulpWrapCss({ globalRule: '.page-content.ltr' })))
            .pipe(gulpIf('*rtl.css', gulpWrapCss({ globalRule: '.page-content.rtl' })))
            .pipe(gulpDebug({ title: 'Wrapped css into a single class' }))
            .pipe(gulpIf(!buildOptions.isDebug, gulpCsso()))
            .pipe(gulpIf(!buildOptions.isDebug, gulpDebug({ title: 'Uglified output' })))
            .pipe(gulp.dest(buildOptions.distPath + 'dita-ot/styles/'));
    };
}
