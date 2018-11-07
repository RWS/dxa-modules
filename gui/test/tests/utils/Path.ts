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

import { path, Path as PathUtils } from "utils/Path";

describe(`Url utils tests.`, (): void => {

    it("gets absolute path", (): void => {
        const absolutePath = path.getAbsolutePath("foo/bar");
        expect(absolutePath).toBe("/foo/bar");
    });

    it("has option to set different root path", (): void => {
        const rootPath = "/some-dir/";
        const pathUtil = new PathUtils(rootPath);

        const testTootPath = pathUtil.getRootPath();
        expect(testTootPath).toBe(rootPath);

        const absolutePath = pathUtil.getAbsolutePath("foo/bar");
        expect(absolutePath).toBe(`${rootPath}foo/bar`);
    });

});
