import { SearchService } from "services/client/SearchService";
import { TestBase } from "@sdl/models";
import { IWindow } from "interfaces/Window";
import { ISearchQuery } from "interfaces/Search";

class PageServiceTests extends TestBase {

    public runTests(): void {
        const win = (window as IWindow);
        const mocksFlag = win.SdlDitaDeliveryMocksEnabled;
        const searchService = new SearchService();
        const publicationId = "1961702";
        const _testQuery = "1961702";

        describe("Search service tests.", (): void => {
            beforeEach(() => {
                win.SdlDitaDeliveryMocksEnabled = true;
            });

            afterEach(() => {
                win.SdlDitaDeliveryMocksEnabled = mocksFlag;
            });

            it("can get search results", (done: () => void): void => {
                const query = {
                    publicationId,
                    searchQuery: _testQuery
                } as ISearchQuery;
                searchService.getSearchResults(query).then(searchResults => {
                    expect(searchResults).toBeDefined();
                    if (searchResults) {
                        expect(searchResults.hits).toBe(352);
                        expect(searchResults.queryResults.length).toBe(10);
                    }
                    done();
                }).catch(error => {
                    fail(`Unexpected error: ${error}`);
                    done();
                });
            });

            it("is not cached in memory", (done: () => void): void => {
                const query = {
                    publicationId,
                    searchQuery: _testQuery
                } as ISearchQuery;
                const spy = spyOn(XMLHttpRequest.prototype, "open").and.callThrough();
                searchService.getSearchResults(query).then(searchResults => {
                    expect(searchResults).toBeDefined();
                    if (searchResults) {
                        expect(searchResults.hits).toBe(352);
                        expect(searchResults.queryResults.length).toBe(10);
                        expect(spy).toHaveBeenCalled();
                    }
                    done();
                }).catch(error => {
                    fail(`Unexpected error: ${error}`);
                    done();
                });
            });
        });
    }
}

new PageServiceTests().runTests();
