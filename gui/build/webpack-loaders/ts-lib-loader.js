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

const fs = require('fs-extra');
const path = require('path');
const loaderUtils = require('loader-utils');

module.exports = function (contents, sourceMap) {
    this.cacheable && this.cacheable();

    const callback = this.async();
    const fileParts = path.parse(this.resource);
    const ext = ['.ts', '.tsx'].indexOf(fileParts.ext) >= 0 ? '.js' : fileParts.ext;
    const srcPath = process.cwd().replace(/\\/gi, '/') + '/src';
    const contextPath = this.context.replace(/\\/gi, '/');

    if (contextPath.indexOf(srcPath) === 0) {
        const outputPath = process.cwd() + contextPath.replace(srcPath, '/dist/lib');

        fs.ensureDir(outputPath, errEnsureDir => {
            if (errEnsureDir) {
                throw new Error('Ts Lib Loader: outputPath does not exist', 30, 'ts-lib-loader.js');
            }

            fs.writeFile(path.join(outputPath, fileParts.name + ext), contents, err => {
                if (err) {
                    throw err;
                }
            });
        });
    }

    callback(null, contents, sourceMap);
}
