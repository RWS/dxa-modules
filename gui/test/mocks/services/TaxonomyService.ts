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
import { TcmId } from "utils/TcmId";

import { ASYNC_DELAY } from "test/Constants";

let fakeDelay = false;

export class TaxonomyService implements ITaxonomyService {
    private _mockDataToc: {
        error: string | null;
        items: ITaxonomy[];
    } = {
        error: null,
        items: []
    };

    public getSitemapRoot(publicationId: string): Promise<ITaxonomy[]> {
        return this.getSitemapItems(publicationId);
    }

    public getSitemapItems(publicationId: string, parentId?: string): Promise<ITaxonomy[]> {
        const { error, items } = this._mockDataToc;
        if (fakeDelay) {
            return new Promise((resolve: (items?: ITaxonomy[]) => void, reject: (error: string | null) => void) => {
                setTimeout((): void => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(items);
                    }
                }, ASYNC_DELAY);
            });
        } else {
            if (error) {
                return Promise.reject(error);
            } else {
                return Promise.resolve(items);
            }
        }
    }

    public getSitemapPath(publicationId: string, pageId: string, taxonomyId: string): Promise<ITaxonomy[]> {
        const { error, items } = this._mockDataToc;
        const path = items.filter(item => item.id === TcmId.getItemIdFromTaxonomyItemId(taxonomyId));
        if (fakeDelay) {
            return new Promise((resolve: (items?: ITaxonomy[]) => void, reject: (error: string | null) => void) => {
                setTimeout((): void => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(path);
                    }
                }, ASYNC_DELAY);
            });
        } else {
            if (error) {
                return Promise.reject(error);
            } else {
                return Promise.resolve(path);
            }
        }
    }

    public setMockDataToc(error: string | null, items?: ITaxonomy[]): void {
        this._mockDataToc = {
            error: error,
            items: items || []
        };
    }

    public fakeDelay(value: boolean): void {
        fakeDelay = value;
    }
}
