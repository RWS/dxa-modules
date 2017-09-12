import { ISearchService } from "services/interfaces/SearchService";
import { ISearchQuery, ISearchQueryResults } from "interfaces/Search";
import { Promise } from "es6-promise";
import { ASYNC_DELAY } from "test/Constants";

let fakeDelay = false;

export class SearchService implements ISearchService {

    private _mockDataSearch: {
        error: string | null;
        result: ISearchQueryResults | undefined
    } = {
        error: null,
        result: undefined
    };

    public getSearchResults(query: ISearchQuery): Promise<ISearchQueryResults | undefined> {
        const { error, result } = this._mockDataSearch;
        if (fakeDelay) {
            return new Promise((resolve: (result?: ISearchQueryResults) => void, reject: (error: string | null) => void) => {
                setTimeout((): void => {
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve(result);
                    }
                }, ASYNC_DELAY);
            });
        } else {
            if (error) {
                return Promise.reject(error);
            } else {
                return Promise.resolve(result);
            }
        }
    }

    public setMockDataSearch(error: string | null, result?: ISearchQueryResults): void {
        this._mockDataSearch = {
            error: error,
            result
        };
    }

    public fakeDelay(value: boolean): void {
        fakeDelay = value;
    }
}
