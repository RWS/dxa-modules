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
 * Page interface
 *
 * @export
 * @interface IPage
 */
export interface IPage {
    /**
     * Page Id
     *
     * @type {string}
     * @memberOf IPage
     */
    id: string;

    /**
     * Page title
     *
     * @type {string}
     * @memberOf IPage
     */
    title?: string;

    /**
     * Page logicalId
     *
     * @type {string}
     * @memberOf IPage
     */
    logicalId?: string;

    /**
     * Page content
     *
     * @type {string}
     * @memberOf IPage
     */
    content: string;

    /**
     * Location of a page inside the Toc
     *
     * @type {string[] | undefined | null}
     * @memberOf IPage
     */
    sitemapIds: string[] | undefined | null;
}
