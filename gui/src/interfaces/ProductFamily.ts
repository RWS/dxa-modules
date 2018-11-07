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
 * Product Family interface
 *
 * @export
 * @interface IProductFamily
 */
export interface IProductFamily {
    /**
     * Product Family title
     *
     * @type {string}
     * @memberOf IProductFamily
     */
    title: string;

    /**
     * Product Family description
     *
     * @type {string}
     * @memberOf IProductFamily
     */
    description?: string;

    /**
     * If product family has a warning
     *
     * @type {string}
     * @memberOf IProductFamily
     */
    hasWarning?: boolean;
}
