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

/**
 * Publication interface
 *
 * @export
 * @interface IPublication
 */
export interface IPublication {
    /**
     * Publication Id
     *
     * @type {string}
     * @memberOf IPublication
     */
    id: string;

    /**
     * Publication title
     *
     * @type {string}
     * @memberOf IPublication
     */
    title: string;

    /**
     * Publication product family
     *
     * @type {string | null}
     * @memberOf IPublication
     */
    productFamily?: string[] | null;

    /**
     * Publication product release version
     *
     * @type {string | null}
     * @memberOf IPublication
     */
    productReleaseVersion?: string[] | null;

    /**
     * Publication verison
     * Creation date
     *
     * @type {Date}
     * @memberOf IPublication
     */
    createdOn: Date;

    /**
     * Version (eg 1, 1.1.1)
     *
     * @type {string}
     * @memberOf IPublication
     */
    versionRef?: string;

    /**
     * Publication language
     */
    version: string;

    /**
     * Logical id
     *
     * @type {string}
     * @memberOf IPublication
     */
    language?: string;

    /**
     * Logical ID
     *
     * @type {string}
     * @memberOf IPublication
     */
    logicalId: string;
}
