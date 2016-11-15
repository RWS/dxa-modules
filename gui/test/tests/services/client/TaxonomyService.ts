import { TaxonomyService } from "services/client/TaxonomyService";

// Global Catalina dependencies
import TestBase = SDL.Client.Test.TestBase;

class TaxonomyServiceTests extends TestBase {

    public runTests(): void {
        const taxonomyService = new TaxonomyService();
        const publicationId = "ish:1656863-1-1";

        describe(`Taxonomy service tests.`, (): void => {

            it("can get site map items for the root", (done: () => void): void => {
                taxonomyService.getSitemapRoot(publicationId)
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
                taxonomyService.getSitemapRoot(publicationId)
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
                    taxonomyService.getSitemapItems(publicationId, parentId)
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
                taxonomyService.getSitemapRoot(publicationId)
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

            it("can get a path for a page", (done: () => void): void => {
                const pageId = "ish:1656863-164187-16";
                taxonomyService.getSitemapPath(publicationId, pageId).then(path => {
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
                taxonomyService.getSitemapPath(publicationId, pageId).then(path => {
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
                taxonomyService.getSitemapPath(publicationId, "does-not-exist").then(() => {
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

new TaxonomyServiceTests().runTests();
