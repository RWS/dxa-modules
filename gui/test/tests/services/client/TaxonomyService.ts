import { TaxonomyService } from "services/client/TaxonomyService";
import { TestBase } from "@sdl/models";
import { IWindow } from "interfaces/Window";
import { configureStore } from "store/Store";

//TODO should use beforeEach new TaxonomyService()  instead;
class TaxonomyServiceInvalidatable extends TaxonomyService {
    public ivalidate(): void {
        this.NavigationLinksModels = {};
        this.TocModels = {};
    }
}

class TaxonomyServiceTests extends TestBase {

    public runTests(): void {
        const win = (window as IWindow);
        const mocksFlag = win.SdlDitaDeliveryMocksEnabled;
        const taxonomyService = new TaxonomyServiceInvalidatable();
        const publicationId = "1961702";
        configureStore();

        describe(`Taxonomy service tests.`, (): void => {

            beforeEach(() => {
                win.SdlDitaDeliveryMocksEnabled = true;
            });

            afterEach(() => {
                win.SdlDitaDeliveryMocksEnabled = mocksFlag;
            });

            it("can get site map items for the root", (done: () => void): void => {
                taxonomyService.getSitemapRoot(publicationId)
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
            });

            it("can get site map items from memory", (done: () => void): void => {
                const spy = spyOn(XMLHttpRequest.prototype, "open").and.callThrough();
                taxonomyService.getSitemapRoot(publicationId)
                    .then(items => {
                        expect(items).toBeDefined();
                        if (items) {
                            expect(items.length).toBe(9);
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
                    taxonomyService.getSitemapItems(publicationId, parentId)
                        .then(items => {
                            expect(items).toBeDefined();
                            if (items) {
                                expect(items.length).toBe(7);
                            }
                            done();
                        }).catch(error => {
                            fail(`Unexpected error: ${error}`);
                            done();
                        });
                };
                taxonomyService.getSitemapRoot(publicationId)
                    .then(items => {
                        expect(items).toBeDefined();
                        if (items) {
                            expect(items.length).toBe(9);
                            // Get Your Phone topic, first item which has childnodes
                            const firstItem = items.filter(item => item.hasChildNodes)[0];
                            expect(firstItem.id).toBeDefined();
                            if (firstItem.id) {
                                getChildren(firstItem.id);
                            }
                        }
                    }).catch(error => {
                        fail(`Unexpected error: ${error}`);
                        done();
                    });
            });

            it("returns a proper error when a parent id does not exist", (done: () => void): void => {
                taxonomyService.getSitemapItems(publicationId, "does-not-exist")
                    .then(() => {
                        fail("An error was expected.");
                        done();
                    })
                    .catch(error => {
                        expect(error).toContain("does-not-exist");
                        done();
                    });
            });

            it("can get a path for a sitemap id", (done: () => void): void => {
                const taxonomyId = "t1-k16";
                const pageId = "164468";
                taxonomyService.getSitemapPath(publicationId, pageId, taxonomyId).then(path => {
                    expect(path).toBeDefined();
                    if (path) {
                        expect(path.length).toBe(1);
                    }
                    done();
                }).catch(error => {
                    fail(`Unexpected error: ${error}`);
                    done();
                });
            });

            it("can get a path for a sitemap id from memory", (done: () => void): void => {
                const taxonomyId = "t1-k16";
                const pageId = "164468";
                const spy = spyOn(XMLHttpRequest.prototype, "open").and.callThrough();
                taxonomyService.getSitemapPath(publicationId, pageId, taxonomyId).then(path => {
                    expect(path).toBeDefined();
                    if (path) {
                        expect(path.length).toBe(1);
                    }
                    expect(spy).not.toHaveBeenCalled();
                    done();
                }).catch(error => {
                    fail(`Unexpected error: ${error}`);
                    done();
                });
            });

            it("returns a proper error when a page does not exist", (done: () => void): void => {
                taxonomyService.getSitemapPath(publicationId, "", "does-not-exist").then(() => {
                    fail("An error was expected.");
                    done();
                }).catch(error => {
                    expect(error).toContain("does-not-exist");
                    done();
                });
            });

            it("returns a proper error when a path is not pointing to the expected page", (done: () => void): void => {
                const taxonomyId = "t1-k8";
                const pageId = "546545678";
                taxonomyService.getSitemapPath(publicationId, pageId, taxonomyId).then(() => {
                    fail("An error was expected.");
                    done();
                }).catch(error => {
                    expect(error).toContain(pageId);
                    done();
                });
            });

            it("does not perform extra http requests to fetch siblings for toc after locating a sitemap item", (done: () => void): void => {
                const onError = (error: string) => {
                    fail(`Unexpected error: ${error}`);
                    done();
                };
                // Invalidate the service to make sure we start with an empty cache
                taxonomyService.ivalidate();
                // Retrieve path of item in toc
                const taxonomyId = "t1-k18";
                const pageId = "164363";
                taxonomyService.getSitemapPath(publicationId, pageId, taxonomyId).then(path => {
                    expect(path).toBeDefined();
                    if (path) {
                        expect(path.length).toBe(3);
                    }
                    // Retrieve toc items up to the path of the current retrieved page
                    // There should be no extra http requests as the data is already fetched as part of the locate
                    const spy = spyOn(XMLHttpRequest.prototype, "open").and.callThrough();
                    taxonomyService.getSitemapRoot(publicationId).then(rootItems => {
                        expect(rootItems.length).toBe(9);
                        taxonomyService.getSitemapItems(publicationId, rootItems[4].id || "").then(callFunctionsItems => {
                            expect(callFunctionsItems.length).toBe(2);
                            taxonomyService.getSitemapItems(publicationId, callFunctionsItems[0].id || "").then(makingACallItems => {
                                expect(makingACallItems.length).toBe(2);
                                expect(spy).not.toHaveBeenCalled();
                                done();
                            }).catch(onError);
                        }).catch(onError);
                    }).catch(onError);
                }).catch(onError);
            });
        });
    }
}

new TaxonomyServiceTests().runTests();
