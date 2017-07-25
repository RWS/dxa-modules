import { ISearchService } from "services/interfaces/SearchService";
import { ISearchQuery, ISearchQueryResults } from "interfaces/Search";
import { Promise } from "es6-promise";

let fakeDelay = false;
const DELAY = 10;

export class SearchService implements ISearchService {

    private _mockDataSearch: {
        error: string | null;
        result: ISearchQueryResults | undefined
    } = {
        error: null,
        result: undefined
    };

    public getSearchResults(query: ISearchQuery): Promise<ISearchQueryResults> {
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
                }, DELAY);
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
