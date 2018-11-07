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

import { IPublication } from "interfaces/Publication";
import { IPage } from "interfaces/Page";
import { IProductFamily } from "interfaces/ProductFamily";
import { IProductReleaseVersion } from "interfaces/ProductReleaseVersion";
import { IConditionsState } from "store/interfaces/Conditions";
import { IComments } from "store/interfaces/Comments";

export interface IProductReleaseVersionState {
    byProductFamily: IProductReleaseVersionMap;
}

export interface IProductReleaseVersionMap {
    [id: string]: IProductReleaseVersion[];
}

/**
 * Pages dictionary based on id
 *
 * @export
 * @interface IPagesMap
 */
export interface IPagesMap {
    [id: string]: IPage;
}

/**
 * Pages' errors dictionary based on page id
 *
 * @export
 * @interface IPageErrorsMap
 */
export interface IPageErrorsMap {
    [pageId: string]: string;
}

/**
 * Pages interface in the state
 *
 * @export
 * @interface IPageState
 */
export interface IPageState {
    /**
     * Pages dictionary
     *
     * @type {IPagesMap}
     * @memberOf IPageState
     */
    byId: IPagesMap;
    /**
     * Errors dictionary
     *
     * @type {IPageErrorsMap}
     * @memberOf IPageState
     */
    errors: IPageErrorsMap;
    /**
     * Loading pages id that are loading
     *
     * @type {string[]}
     * @memberOf IPageState
     */
    loading: string[];
}

/**
 * Publications dictionary based on id
 *
 * @export
 * @interface IPagesMap
 */
export interface IPublicationsMap {
    [id: string]: IPublication;
}

/**
 * Publications interface in the state
 *
 * @export
 * @interface IPageState
 */

export interface IPublicationsState {
    byId: IPublicationsMap;

    /**
     * Flag that show if list of publications is requsted
     * We cannot do flag per publicaiton like we did for pages.
     */
    isLoading: boolean;

    /**
     * It's called lastError, because it might happen that some publications were loaded some not
     */
    lastError: string;
}

/**
 * State's current location interface
 *
 * @export
 * @interface ICurrentLocationState
 */
export interface ICurrentLocationState {
    /**
     * Current publication id
     *
     * @type {string}
     * @memberOf ICurrentLocationState
     */
    publicationId: string;
    /**
     * Current page id
     *
     * @type {string}
     * @memberOf ICurrentLocationState
     */
    pageId: string;
    /**
     * Current page id
     *
     * @type {string}
     * @memberOf ICurrentLocationState
     */
    taxonomyId: string;
    /**
     * Current anchor pointer
     *
     * @type {string}
     * @memberOf ICurrentLocationState
     */
    anchor: string;
}

/**
 * State interface
 *
 * @export
 * @interface IState
 */
export interface IState {
    /**
     * Current UI language
     *
     * @type {string}
     * @memberOf IState
     */
    language: string;

    /**
     * Conditions
     *
     * @type {IConditionsState}
     * @memberof IState
     */
    conditions: IConditionsState;

    /**
     * Comments
     *
     * @type {IComments}
     * @memberof IState
     */
    comments: IComments;
    /**
     * Current selected location
     *
     * @type {IPublicationState}
     * @memberOf IState
     */
    currentLocation: ICurrentLocationState;

    /**
     * Publications and state
     *
     * @type {Object}
     * @memberOf IState
     */
    publications: IPublicationsState;

    /**
     * Pages and it states
     *
     * @type {Object}
     * @memberOf IState
     */
    pages: IPageState;

    /**
     * Release versions
     *
     * @type {IProductReleaseVersionState}
     * @memberof IState
     */
    releaseVersions: IProductReleaseVersionState;

    /**
     * Product families
     *
     * @type {IProductFamilies[]}
     * @memberof IState
     */
    productFamilies: IProductFamily[];

    /**
     * Splitter position
     *
     * @type {number}
     * @memberOf IState
     */
    splitterPosition: number;
}
