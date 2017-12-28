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
