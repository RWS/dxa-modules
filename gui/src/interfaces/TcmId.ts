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
 * Tcm id
 *
 * @export
 * @interface ITcmId
 */
export interface ITcmId {
    /**
     * Namespace (eg ish, tcm)
     *
     * @type {string}
     * @memberOf TcmId
     */
    namespace: string;
    /**
     * Publication id
     *
     * @type {string}
     * @memberOf TcmId
     */
    publicationId: string;
    /**
     * Item id
     *
     * @type {string}
     * @memberOf TcmId
     */
    itemId: string;
    /**
     * Item type
     *
     * @type {CdItemTypes}
     * @memberOf TcmId
     */
    itemType: CdItemTypes;
}

/**
 * Content Delivery item types
 *
 * @export
 * @enum {number}
 */
export const enum CdItemTypes {
    Publication = 1,
    Component = 16,
    Category = 512,
    Taxonomy = 1024
}

/**
 * Fixed ids used inside Taxonomy
 *
 * @export
 * @enum {number}
 */
export const enum TaxonomyItemId {
    /**
     * Table of contents
     */
    Toc = 1,
    /**
     * Index table (index terms)
     */
    Index = 100000000
}
