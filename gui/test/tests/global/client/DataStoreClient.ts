import { DataStoreClient } from "../../../../src/global/client/DataStoreClient";

// Global Catalina dependencies
import TestBase = SDL.Client.Test.TestBase;
import IWebRequest = SDL.Client.Net.IWebRequest;

class DataStoreClientTests extends TestBase {

    public runTests(): void {
        const DataStore = new DataStoreClient();
        const publicationId = "ish:1656863-1-1";

        describe(`Data Store tests (Toc).`, (): void => {

            it("can get site map items for the root", (done: () => void): void => {
                DataStore.getSitemapRoot(publicationId)
                    .then(items => {
                        expect(items).toBeDefined();
                        if (items) {
                            expect(items.length).toBe(1);
                        }
                        done();
                    }).catch(error => {
                        fail(`Unexpected error: ${error}`);
                        done();
                    });
            });

            it("can get site map items from memory", (done: () => void): void => {
                const spy = spyOn(SDL.Client.Net, "getRequest").and.callThrough();
                DataStore.getSitemapRoot(publicationId)
                    .then(items => {
                        expect(items).toBeDefined();
                        if (items) {
                            expect(items.length).toBe(1);
                        }
                        expect(spy).not.toHaveBeenCalled();
                        done();
                    }).catch(error => {
                        fail(`Unexpected error: ${error}`);
                        done();
                    });
            });

            it("can get site map items for a child", (done: () => void): void => {
                const getChildren = (parentId: string): void => {
                    DataStore.getSitemapItems(publicationId, parentId)
                        .then(items => {
                            expect(items).toBeDefined();
                            if (items) {
                                expect(items.length).toBe(9);
                            }
                            done();
                        }).catch(error => {
                            fail(`Unexpected error: ${error}`);
                            done();
                        });
                };
                DataStore.getSitemapRoot(publicationId)
                    .then(items => {
                        expect(items).toBeDefined();
                        if (items) {
                            expect(items.length).toBe(1);
                            const firstItem = items[0];
                            expect(firstItem.Id).toBeDefined();
                            if (firstItem.Id) {
                                getChildren(firstItem.Id);
                            }
                        }
                    }).catch(error => {
                        fail(`Unexpected error: ${error}`);
                        done();
                    });
            });

            it("returns a proper error when a parent id does not exist", (done: () => void): void => {
                DataStore.getSitemapItems(publicationId, "does-not-exist")
                    .then(() => {
                        fail("An error was expected.");
                        done();
                    })
                    .catch(error => {
                        expect(error).toContain("does-not-exist");
                        done();
                    });
            });
        });

        describe(`Data Store tests (Page).`, (): void => {

            it("can get page info", (done: () => void): void => {
                const pageId = "ish:1656863-164398-16";
                DataStore.getPageInfo(publicationId, pageId).then(pageInfo => {
                    expect(pageInfo).toBeDefined();
                    if (pageInfo) {
                        expect(pageInfo.title).toBe("getting started");
                        expect(pageInfo.content.length).toBe(1216);
                        const element = document.createElement("span");
                        element.innerHTML = pageInfo.content;
                        expect(element.children.length).toBe(3); // title, content, related links
                        expect((element.children[1] as HTMLElement).children.length).toBe(2);
                    }
                    done();
                }).catch(error => {
                    fail(`Unexpected error: ${error}`);
                    done();
                });
            });

            it("can get page info from memory", (done: () => void): void => {
                const pageId = "ish:1656863-164398-16";
                const spy = spyOn(SDL.Client.Net, "getRequest").and.callThrough();
                DataStore.getPageInfo(publicationId, pageId).then(pageInfo => {
                    expect(pageInfo).toBeDefined();
                    if (pageInfo) {
                        expect(pageInfo.title).toBe("getting started");
                        expect(pageInfo.content.length).toBe(1216);
                        expect(spy).not.toHaveBeenCalled();
                    }
                    done();
                }).catch(error => {
                    fail(`Unexpected error: ${error}`);
                    done();
                });
            });

            it("returns a proper error when a page does not exist", (done: () => void): void => {
                DataStore.getPageInfo(publicationId, "does-not-exist").then(() => {
                    fail("An error was expected.");
                    done();
                }).catch(error => {
                    expect(error).toContain("does-not-exist");
                    done();
                });
            });

        });

        describe(`Data Store tests (Publications).`, (): void => {

            it("returns a proper error when publications cannot be retrieved", (done: () => void): void => {
                // Put this test first, otherwise the publication would be already in the cache and the spy would not work
                const failMessage = "failure";
                const fakeGetRequest = (url: string, onSuccess: Function, onFailure: (error: string, request: IWebRequest | null) => void): void => {
                    onFailure(failMessage, null);
                };
                spyOn(SDL.Client.Net, "getRequest").and.callFake(fakeGetRequest);
                DataStore.getPublications().then(() => {
                    fail("An error was expected.");
                    done();
                }).catch(error => {
                    expect(error).toBe(failMessage);
                    done();
                });
            });

            it("returns a proper error when publication title cannot be retrieved", (done: () => void): void => {
                // Put this test first, otherwise the publication would be already in the cache and the spy would not work
                const failMessage = "failure";
                const fakeGetRequest = (url: string, onSuccess: Function, onFailure: (error: string, request: IWebRequest | null) => void): void => {
                    onFailure(failMessage, null);
                };
                spyOn(SDL.Client.Net, "getRequest").and.callFake(fakeGetRequest);
                DataStore.getPublicationTitle(failMessage).then(() => {
                    fail("An error was expected.");
                    done();
                }).catch(error => {
                    expect(error).toBe(failMessage);
                    done();
                });
            });

            it("can get the publications", (done: () => void): void => {
                DataStore.getPublications().then(publications => {
                    expect(publications).toBeDefined();
                    if (publications) {
                        expect(publications.length).toBe(5);
                        expect(publications[0].Title).toBe("Publication MP330");
                    }
                    done();
                }).catch(error => {
                    fail(`Unexpected error: ${error}`);
                    done();
                });
            });

            it("can get the publications from memory", (done: () => void): void => {
                const spy = spyOn(SDL.Client.Net, "getRequest").and.callThrough();
                DataStore.getPublications().then(publications => {
                    expect(publications).toBeDefined();
                    if (publications) {
                        expect(publications.length).toBe(5);
                        expect(publications[0].Title).toBe("Publication MP330");
                        expect(spy).not.toHaveBeenCalled();
                    }
                    done();
                }).catch(error => {
                    fail(`Unexpected error: ${error}`);
                    done();
                });
            });

            it("can get a publication title", (done: () => void): void => {
                DataStore.getPublicationTitle(publicationId).then(title => {
                    expect(title).toBe("Publication MP330");
                    done();
                }).catch(error => {
                    fail(`Unexpected error: ${error}`);
                    done();
                });
            });

            it("can get a publication title from memory", (done: () => void): void => {
                const spy = spyOn(SDL.Client.Net, "getRequest").and.callThrough();
                DataStore.getPublicationTitle(publicationId).then(title => {
                    expect(title).toBe("Publication MP330");
                    expect(spy).not.toHaveBeenCalled();
                    done();
                }).catch(error => {
                    fail(`Unexpected error: ${error}`);
                    done();
                });
            });

            it("returns a proper error when a publication title cannot be resolved", (done: () => void): void => {
                DataStore.getPublicationTitle("does-not-exist").then(() => {
                    fail("An error was expected.");
                    done();
                }).catch(error => {
                    expect(error).toContain("does-not-exist");
                    done();
                });
            });

        });

        describe(`Data Store tests (Navigation Links).`, (): void => {

            it("can get a path for a page", (done: () => void): void => {
                const pageId = "ish:1656863-164187-16";
                DataStore.getSitemapPath(publicationId, pageId).then(path => {
                    expect(path).toBeDefined();
                    if (path) {
                        expect(path.length).toBe(3);
                    }
                    done();
                }).catch(error => {
                    fail(`Unexpected error: ${error}`);
                    done();
                });
            });

            it("can get a path for a page from memory", (done: () => void): void => {
                const pageId = "ish:1656863-164187-16";
                const spy = spyOn(SDL.Client.Net, "getRequest").and.callThrough();
                DataStore.getSitemapPath(publicationId, pageId).then(path => {
                    expect(path).toBeDefined();
                    if (path) {
                        expect(path.length).toBe(3);
                    }
                    expect(spy).not.toHaveBeenCalled();
                    done();
                }).catch(error => {
                    fail(`Unexpected error: ${error}`);
                    done();
                });
            });

            it("returns a proper error when a page does not exist", (done: () => void): void => {
                DataStore.getSitemapPath(publicationId, "does-not-exist").then(() => {
                    fail("An error was expected.");
                    done();
                }).catch(error => {
                    expect(error).toContain("does-not-exist");
                    done();
                });
            });

        });

    }
}

new DataStoreClientTests().runTests();
