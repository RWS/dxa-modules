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

var through = require('through2');
var istanbul = require('istanbul');
var instrumenter = new istanbul.Instrumenter({ noCompact: true });

/**
 * Gulp plugin to add Istanbul instrumentation
 * @module instrument-js
 */
module.exports = function () {
    return through.obj(function (file, enc, cb) {
        if (file.isNull()) {
            cb(null, file);
            return;
        }

        var contents = file.contents.toString();
        var instrumentedContents = instrumenter.instrumentSync(contents, file.path);

        // Make sure that the __coverage__ object is shared across all windows
        // For example the authentication script is running inside a different iframe
        var finalContents = 'if (window.parent && window.parent.__coverage__) { window.__coverage__ = window.parent.__coverage__; }\n' + instrumentedContents;
        file.contents = new Buffer(finalContents);

        cb(null, file);
    });
};
