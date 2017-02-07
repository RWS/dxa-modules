import { ITaxonomyService } from "services/interfaces/TaxonomyService";
import { ITaxonomy } from "interfaces/Taxonomy";
import { Promise } from "es6-promise";

let fakeDelay = false;
const DELAY = 100;

export class TaxonomyService implements ITaxonomyService {

    private _mockDataToc: {
        error: string | null;
        items: ITaxonomy[]
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

    public getSitemapPath(publicationId: string, sitemapId: string): Promise<ITaxonomy[]> {
        const tocItems = this._mockDataToc.items;
        if (Array.isArray(tocItems)) {
            // Only first level is supported
            const path = tocItems.filter(item => item.id === sitemapId);
            return Promise.resolve(path);
        } else {
            return Promise.reject("Unable to resolve path.");
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
