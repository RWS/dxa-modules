import { ISearchService } from "services/interfaces/SearchService";
import { ISearchQuery, ISearchResult } from "interfaces/Search";
import { Promise } from "es6-promise";

let fakeDelay = false;
const DELAY = 100;

export class SearchService implements ISearchService {

    private _mockDataToc: {
        error: string | null;
        items: ISearchResult[]
    } = {
        error: null,
        items: []
    };

    public getSearchResults(query: ISearchQuery): Promise<ISearchResult[]> {
        const { error, items } = this._mockDataToc;
        if (fakeDelay) {
            return new Promise((resolve: (items?: ISearchResult[]) => void, reject: (error: string | null) => void) => {
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

    public setMockDataToc(error: string | null, items?: ISearchResult[]): void {
        this._mockDataToc = {
            error: error,
            items: items || []
        };
    }

    public fakeDelay(value: boolean): void {
        fakeDelay = value;
    }
}
