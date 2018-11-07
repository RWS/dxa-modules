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

import { ITaxonomyService } from "services/interfaces/TaxonomyService";
import { ITaxonomy } from "interfaces/Taxonomy";
import { Promise } from "es6-promise";

/**
 * Taxonomy service for the server.
 *
 * @export
 * @class TaxonomyService
 * @implements {ITaxonomyService}
 */
export class TaxonomyService implements ITaxonomyService {

    private _mockDataToc: {
        error: string | null;
        children: ITaxonomy[]
    } = {
        error: null,
        children: []
    };

    /**
     * Get the root objects of the sitemap
     *
     * @param {string} publicationId Publication Id
     * @returns {Promise<ITaxonomy[]>} Promise to return the items
     *
     * @memberOf DataStoreServer
     */
    public getSitemapRoot(publicationId: string): Promise<ITaxonomy[]> {
        return this.getSitemapItems(publicationId, "root");
    }

    /**
     * Get the site map items for a parent
     *
     * @param {string} publicationId Publication Id
     * @param {string} parentId The parent id
     * @returns {Promise<ITaxonomy[]>} Promise to return the items
     *
     * @memberOf DataStoreServer
     */
    public getSitemapItems(publicationId: string, parentId: string): Promise<ITaxonomy[]> {
        const { error, children } = this._mockDataToc;
        if (error) {
            return Promise.reject(error);
        } else {
            return Promise.resolve(children);
        }
    }

    /**
     * Get the full path for a sitemap item within a sitemap
     *
     * @param {string} publicationId Publication Id
     * @param {string} pageId Page id
     * @param {string} taxonomyId The taxonomy id (eg t1-k5)
     * @returns {Promise<ITaxonomy[]>} Promise to return the full path
     *
     * @memberOf DataStoreServer
     */
    public getSitemapPath(publicationId: string, pageId: string, taxonomyId: string): Promise<ITaxonomy[]> {
        return new Promise((resolve: (path?: ITaxonomy[]) => void, reject: (error: string | null) => void) => {
            //
        });
    }
}
