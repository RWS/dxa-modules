/// <reference path="../../../../src/components/container/App.tsx" />
/// <reference path="../../../../src/global/client/DataStoreClient.ts" />
/// <reference path="../../../../src/global/client/LocalizationGlobalize.ts" />

module Sdl.DitaDelivery.Tests {

    import IWebRequest = SDL.Client.Net.IWebRequest;

    class DataStoreClientTests extends SDL.Client.Test.TestBase {

        public runTests(): void {
            const DataStore = new DataStoreClient();

            describe(`Data Store tests (Toc).`, (): void => {

                beforeAll(() => {
                    Sdl.DitaDelivery.Localization = new Mocks.Localization();
                    Sdl.DitaDelivery.Routing = new Mocks.Routing();
                });

                it("can get site map items for the root", (done: () => void): void => {
                    DataStore.getSitemapRoot((error, items) => {
                        expect(error).toBeNull();
                        expect(items).toBeDefined();
                        if (items) {
                            expect(items.length).toBe(1);
                        }
                        done();
                    });
                });

                it("can get site map items from memory", (done: () => void): void => {
                    const spy = spyOn(SDL.Client.Net, "getRequest").and.callThrough();
                    DataStore.getSitemapRoot((error, items) => {
                        expect(error).toBeNull();
                        expect(items).toBeDefined();
                        if (items) {
                            expect(items.length).toBe(1);
                        }
                        expect(spy).not.toHaveBeenCalled();
                        done();
                    });
                });

                it("can get site map items for a child", (done: () => void): void => {
                    const getChildren = (parentId: string): void => {
                        DataStore.getSitemapItems(parentId, (error, items) => {
                            expect(error).toBeNull();
                            expect(items).toBeDefined();
                            if (items) {
                                expect(items.length).toBe(9);
                            }
                            done();
                        });
                    };

                    DataStore.getSitemapRoot((error, items) => {
                        expect(error).toBeNull();
                        expect(items).toBeDefined();
                        if (items) {
                            expect(items.length).toBe(1);
                            const firstItem = items[0];
                            expect(firstItem.Id).toBeDefined();
                            if (firstItem.Id) {
                                getChildren(firstItem.Id);
                            }
                        }
                    });
                });

                it("returns a proper error when a parent id does not exist", (done: () => void): void => {
                    DataStore.getSitemapItems("does-not-exist", (error, items) => {
                        expect(error).toContain("does-not-exist");
                        expect(items).toBeUndefined();
                        done();
                    });
                });

            });

            describe(`Data Store tests (Page).`, (): void => {

                beforeAll(() => {
                    Sdl.DitaDelivery.Localization = new Mocks.Localization();
                    Sdl.DitaDelivery.Routing = new Mocks.Routing();
                });

                it("can get page info", (done: () => void): void => {
                    const pageId = "ish:39137-6222-16";
                    DataStore.getPageInfo(pageId, (error, pageInfo) => {
                        expect(error).toBeNull();
                        expect(pageInfo).toBeDefined();
                        if (pageInfo) {
                            expect(pageInfo.title).toBe("getting started");
                            expect(pageInfo.content.length).toBe(127);
                            const element = document.createElement("span");
                            element.innerHTML = pageInfo.content;
                            expect(element.children.length).toBe(1);
                            expect((element.children[0] as HTMLElement).children.length).toBe(2);
                        }
                        done();
                    });
                });

                it("can get page info from memory", (done: () => void): void => {
                    const pageId = "ish:39137-6222-16";
                    const spy = spyOn(SDL.Client.Net, "getRequest").and.callThrough();
                    DataStore.getPageInfo(pageId, (error, pageInfo) => {
                        expect(error).toBeNull();
                        expect(pageInfo).toBeDefined();
                        if (pageInfo) {
                            expect(pageInfo.title).toBe("getting started");
                            expect(pageInfo.content.length).toBe(127);
                            expect(spy).not.toHaveBeenCalled();
                        }
                        done();
                    });
                });

                it("returns a proper error when a page does not exist", (done: () => void): void => {
                    DataStore.getPageInfo("does-not-exist", (error, pageInfo) => {
                        expect(error).toContain("does-not-exist");
                        expect(pageInfo).toBeUndefined();
                        done();
                    });
                });

            });

            describe(`Data Store tests (Publications).`, (): void => {

                beforeAll(() => {
                    Sdl.DitaDelivery.Localization = new Mocks.Localization();
                    Sdl.DitaDelivery.Routing = new Mocks.Routing();
                });

                it("returns a proper error when publications cannot be retrieved", (done: () => void): void => {
                    // Put this test first, otherwise the publication would be already in the cache and the spy would not work
                    const failMessage = "failure";
                    const fakeGetRequest = (url: string, onSuccess: Function, onFailure: (error: string, request: IWebRequest | null) => void): void => {
                        onFailure(failMessage, null);
                    };
                    spyOn(SDL.Client.Net, "getRequest").and.callFake(fakeGetRequest);
                    DataStore.getPublications((error, publications) => {
                        expect(error).toBe(failMessage);
                        expect(publications).toBeUndefined();
                        done();
                    });
                });

                it("can get the publications", (done: () => void): void => {
                    DataStore.getPublications((error, publications) => {
                        expect(error).toBeNull();
                        expect(publications).toBeDefined();
                        if (publications) {
                            expect(publications.length).toBe(1);
                            expect(publications[0].Title).toBe("MP330");
                        }
                        done();
                    });
                });

                it("can get the publications from memory", (done: () => void): void => {
                    const spy = spyOn(SDL.Client.Net, "getRequest").and.callThrough();
                    DataStore.getPublications((error, publications) => {
                        expect(error).toBeNull();
                        expect(publications).toBeDefined();
                        if (publications) {
                            expect(publications.length).toBe(1);
                            expect(publications[0].Title).toBe("MP330");
                            expect(spy).not.toHaveBeenCalled();
                        }
                        done();
                    });
                });

                it("can get a publication title", (done: () => void): void => {
                    const publicationId = "ish:39137-1-1";
                    DataStore.getPublicationTitle(publicationId, (error, title) => {
                        expect(error).toBeNull();
                        expect(title).toBe("MP330");
                        done();
                    });
                });

                it("can get a publication title from memory", (done: () => void): void => {
                    const publicationId = "ish:39137-1-1";
                    const spy = spyOn(SDL.Client.Net, "getRequest").and.callThrough();
                    DataStore.getPublicationTitle(publicationId, (error, title) => {
                        expect(error).toBeNull();
                        expect(title).toBe("MP330");
                        expect(spy).not.toHaveBeenCalled();
                        done();
                    });
                });

                it("returns a proper error when a publication title cannot be resolved", (done: () => void): void => {
                    DataStore.getPublicationTitle("does-not-exist", (error, title) => {
                        expect(error).toContain("does-not-exist");
                        expect(title).toBeUndefined();
                        done();
                    });
                });

            });

            describe(`Data Store tests (Navigation Links).`, (): void => {

                beforeAll(() => {
                    Sdl.DitaDelivery.Localization = new Mocks.Localization();
                    Sdl.DitaDelivery.Routing = new Mocks.Routing();
                });

                it("can get a path for a page", (done: () => void): void => {
                    const sitemapItemId = "ish:39137-5-1024";
                    DataStore.getSitemapPath(sitemapItemId, (error, path) => {
                        expect(error).toBeNull();
                        expect(path).toBeDefined();
                        if (path) {
                            expect(path.length).toBe(3);
                        }
                        done();
                    });
                });

                it("can get a path for a page from memory", (done: () => void): void => {
                    const sitemapItemId = "ish:39137-5-1024";
                    const spy = spyOn(SDL.Client.Net, "getRequest").and.callThrough();
                    DataStore.getSitemapPath(sitemapItemId, (error, path) => {
                        expect(error).toBeNull();
                        expect(path).toBeDefined();
                        if (path) {
                            expect(path.length).toBe(3);
                        }
                        expect(spy).not.toHaveBeenCalled();
                        done();
                    });
                });

                it("returns a proper error when a page does not exist", (done: () => void): void => {
                    DataStore.getSitemapPath("does-not-exist", (error, pageInfo) => {
                        expect(error).toContain("does-not-exist");
                        expect(pageInfo).toBeUndefined();
                        done();
                    });
                });

            });

        }
    }

    new DataStoreClientTests().runTests();
}
