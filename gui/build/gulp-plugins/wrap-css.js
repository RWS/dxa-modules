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

const through = require('through2');
const css = require('css');

/**
 * Gulp plugin to wrap styles of a css into single class
 * This to make sure that the styles don't affect styles outside of the scope of it's element
 * @module wrap-css
 */
module.exports = options => {
    return through.obj((file, enc, cb) => {
        if (file.isNull()) {
            cb(null, file);
            return;
        }

        if (!options.globalRule) {
            cb(new Error('globalRule option should be specified'));
            return;
        }

        const contents = file.contents.toString();
        const parsedCss = css.parse(contents);

        // Add class to all selectors
        for (let rule of parsedCss.stylesheet.rules) {
            if (Array.isArray(rule.selectors)) {
                let index = 0;
                for (let selector of rule.selectors) {
                    rule.selectors[index] = `${options.globalRule} ${selector}`;
                    index++;
                }
            }
        }

        const updatedCss = css.stringify(parsedCss);

        file.contents = new Buffer(updatedCss);

        cb(null, file);
    });
};
