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
            .pipe(gulp.dest(buildOptions.distPath + 'lib/dita-ot/styles/'));
    };
}
