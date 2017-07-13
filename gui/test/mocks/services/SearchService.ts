import { ISearchService } from "services/interfaces/SearchService";
import { ISearchQuery, ISearchQueryResults } from "interfaces/Search";
import { Promise } from "es6-promise";

let fakeDelay = false;
const DELAY = 100;

export class SearchService implements ISearchService {

    private _mockDataSearch: {
        error: string | null;
        items: ISearchQueryResults | undefined
    } = {
        error: null,
        items: undefined
    };

    public getSearchResults(query: ISearchQuery): Promise<ISearchQueryResults> {
        const { error, items } = this._mockDataSearch;
        if (fakeDelay) {
            return new Promise((resolve: (items?: ISearchQueryResults) => void, reject: (error: string | null) => void) => {
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

    public setMockDataSearch(error: string | null, result?: ISearchQueryResults): void {
        this._mockDataSearch = {
            error: error,
            items: result || undefined
        };
    }

    public fakeDelay(value: boolean): void {
        fakeDelay = value;
    }
}
