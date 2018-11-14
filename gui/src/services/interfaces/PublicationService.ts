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
import { IProductFamily } from "interfaces/ProductFamily";
import { IProductReleaseVersion } from "interfaces/ProductReleaseVersion";
import { Promise } from "es6-promise";
import { IConditionMap } from "store/interfaces/Conditions";

/**
 * Publication related services
 */
export interface IPublicationService {

    /**
     * Get the list of publications
     *
     * @param {string} [productFamily] productFamily title
     * @param {string} [productReleaseVersion] product release version title
     * @returns {Promise<IPublication[]>} Promise to return the items
     *
     * @memberOf IDataStore
     */
    getPublications(productFamily?: string, productReleaseVersion?: string): Promise<IPublication[]>;

    /**
     * Get the list of publications product families
     *
     * @returns {Promise<IProductFamily[]>} Promise to return Items
     *
     * @memberOf DataStoreClient
     */
    getProductFamilies(): Promise<IProductFamily[]>;

    /**
     * Get the publication by id
     *
     * @param {string} publicationId Publication id
     * @returns {Promise<IPublication>} Promise to return the publication
     *
     * @memberOf IDataStore
     */
    getPublicationById(publicationId: string): Promise<IPublication>;

    /**
     * Get the list of product release versions for a product ProductFamily
     * Are sorted by release time (latest to oldest)
     *
     * @param {string} productFamily Product family
     * @returns {Promise<IProductReleaseVersion[]>} Promise to return the product release versions
     *
     * @memberOf IPublicationService
     */
    getProductReleaseVersions(productFamily: string): Promise<IProductReleaseVersion[]>;

    /**
     * Get the list of product release versions for a publication
     * Are sorted by release time (latest to oldest)
     *
     * @param {string} publicationId Publication id
     * @returns {Promise<IProductReleaseVersion[]>} Promise to return the product release versions
     *
     * @memberOf IPublicationService
     */
    getProductReleaseVersionsByPublicationId(publicationId: string): Promise<IProductReleaseVersion[]>;

    /**
     * Get the list of conditions for a publication
     *
     * @param {string} publicationId Publication id
     * @returns {Promise<IConditionMap>} Promise to return the publication conditions
     *
     * @memberof IPublicationService
     */
    getConditions(publicationId: string): Promise<IConditionMap>;
}
