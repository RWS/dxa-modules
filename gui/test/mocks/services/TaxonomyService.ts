import { ITaxonomyService } from "../../../src/services/interfaces/TaxonomyService";
import { ISitemapItem } from "../../../src/interfaces/ServerModels";
import { Promise } from "es6-promise";

let fakeDelay = false;
const DELAY = 100;

export class TaxonomyService implements ITaxonomyService {

    private _mockDataToc: {
        error: string | null;
        items: ISitemapItem[]
    } = {
        error: null,
        items: []
    };

    public getSitemapRoot(publicationId: string): Promise<ISitemapItem[]> {
        return this.getSitemapItems(publicationId);
    }

    public getSitemapItems(publicationId: string, parentId?: string): Promise<ISitemapItem[]> {
        const { error, items } = this._mockDataToc;
        if (fakeDelay) {
            return new Promise((resolve: (items?: ISitemapItem[]) => void, reject: (error: string | null) => void) => {
                setTimeout((): void => {
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve(items);
                    }
                }, DELAY);
            });
        } else {
            if (error) {
                return Promise.reject(error);
            } else {
                return Promise.resolve(items);
            }
        }
    }

    public getSitemapPath(publicationId: string, pageId: string): Promise<ISitemapItem[]> {
        const tocItems = this._mockDataToc.items;
        if (Array.isArray(tocItems)) {
            // Only first level is supported
            const path = tocItems.filter(item => item.Url === pageId);
            return Promise.resolve(path);
        } else {
            return Promise.reject("Unable to resolve path.");
        }
    }

    public setMockDataToc(error: string | null, items?: ISitemapItem[]): void {
        this._mockDataToc = {
            error: error,
            items: items || []
        };
    }

    public fakeDelay(value: boolean): void {
        fakeDelay = value;
    }
}
