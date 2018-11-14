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

import { IWindow } from "interfaces/Window";

const rootPath: string = (window as IWindow).SdlDitaDeliveryRootPath || "/";

/**
 * Path utilities
 *
 * @export
 * @class Path
 */
export class Path {

    private _root: string;

    /**
     * Creates an instance of Path.
     *
     * @param {string} [root="/"] Root path of the application.
     */
    constructor(root: string = "/") {
        this._root = root + (root.slice(-1) == "/" ? "" : "/");
    }

    /**
     * Get the root path
     *
     * @returns {string}
     */
    public getRootPath(): string {
        return this._root;
    }

    /**
     * Get the absolute path
     *
     * @param {string} path Path
     * @returns {string}
     */
    public getAbsolutePath(path: string): string {
         return [this._root.replace(/\/$/, ""), path.replace(/^\//, "")].join("/");
    }

}

export let path = new Path(rootPath);
