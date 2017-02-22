import { PublicationService } from "services/client/PublicationService";
import { TestBase } from "sdl-models";
import { FakeXMLHttpRequest } from "test/mocks/XmlHttpRequest";

class PublicationServiceTests extends TestBase {

    public runTests(): void {
        const publicationService = new PublicationService();
        const publicationId = "1961702";

        describe(`Publication service tests.`, (): void => {

            it("returns a proper error when product families cannot be retrieved", (done: () => void): void => {
                // Put this test first, otherwise the publication would be already in the cache and the spy would not work
                const failMessage = "failure-retrieving-publications-families";
                spyOn(window, "XMLHttpRequest").and.callFake(() => new FakeXMLHttpRequest(failMessage));
                publicationService.getProductFamilies().then(() => {
                    fail("An error was expected.");
                    done();
                }).catch(error => {
                    expect(error).toContain(failMessage);
                    done();
                });
            });

            it("returns a proper error when publications cannot be retrieved", (done: () => void): void => {
                // Put this test first, otherwise the publication would be already in the cache and the spy would not work
                const failMessage = "failure-retrieving-publications";
                spyOn(window, "XMLHttpRequest").and.callFake(() => new FakeXMLHttpRequest(failMessage));
                publicationService.getPublications().then(() => {
                    fail("An error was expected.");
                    done();
                }).catch(error => {
                    expect(error).toContain(failMessage);
                    done();
                });
            });

            it("returns a proper error when publication title cannot be retrieved", (done: () => void): void => {
                // Put this test first, otherwise the publication would be already in the cache and the spy would not work
                const failMessage = "failure-retrieving-publication-title";
                spyOn(window, "XMLHttpRequest").and.callFake(() => new FakeXMLHttpRequest(failMessage));
                publicationService.getPublicationTitle(failMessage).then(() => {
                    fail("An error was expected.");
                    done();
                }).catch(error => {
                    expect(error).toContain(failMessage);
                    done();
                });
            });

            it("can get product families from publications with undefined properties", (done: () => void): void => {
                spyOn(publicationService, "getPublications").and.callFake(() => {
                    return [
                        {
                            "Id": "Pub1",
                            "Title": "Pub1",
                            "ProductFamily": "Family 1"
                        },
                        {
                            "Id": "Pub2",
                            "Title": "Pub2",
                            "ProductFamily": "Family 2"
                        }, {
                            "Id": "Pub3",
                            "Title": "Pub3",
                            "ProductFamily": "Family 2"
                        },
                        {
                            "Id": "Pub",
                            "Title": "Pub",
                        }
                    ]
                });

                publicationService.getProductFamilies().then(families => {
                    expect(families).toBeDefined();
                    if (families) {
                        expect(families.length).toBe(3);
                        expect(families[3].title).toBe(undefined);
                    }
                    done();
                }).catch(error => {
                    fail(`Unexpected error: ${error}`);
                    done();
                });
            });

            it("can get product families", (done: () => void): void => {
                const spy = spyOn(window, "XMLHttpRequest").and.callThrough();
                publicationService.getProductFamilies().then(families => {
                    expect(families).toBeDefined();
                    if (families) {
                        expect(families.length).toBe(5);
                        expect(families[3].title).toBe("SDL Knowledge Center");
                    }
                    expect(spy).toHaveBeenCalled();
                    done();
                }).catch(error => {
                    fail(`Unexpected error: ${error}`);
                    done();
                });
            });

            it("can get product families from memory", (done: () => void): void => {
                const spy = spyOn(window, "XMLHttpRequest").and.callThrough();
                publicationService.getProductFamilies().then(families => {
                    expect(families).toBeDefined();
                    if (families) {
                        expect(families.length).toBe(5);
                        expect(families[3].title).toBe("SDL Knowledge Center");
                        expect(spy).not.toHaveBeenCalled();
                    }
                    done();
                }).catch(error => {
                    fail(`Unexpected error: ${error}`);
                    done();
                });
            });

            it("can get the publications", (done: () => void): void => {
                const spy = spyOn(window, "XMLHttpRequest").and.callThrough();
                publicationService.getPublications().then(publications => {
                    expect(publications).toBeDefined();
                    if (publications) {
                        expect(publications.length).toBe(8);
                        expect(publications[6].title).toBe("User Guide");
                        expect(spy).toHaveBeenCalled();
                    }
                    done();
                }).catch(error => {
                    fail(`Unexpected error: ${error}`);
                    done();
                });
            });

            it("can get the publications from memory", (done: () => void): void => {
                const spy = spyOn(window, "XMLHttpRequest").and.callThrough();
                publicationService.getPublications().then(publications => {
                    expect(publications).toBeDefined();
                    if (publications) {
                        expect(publications.length).toBe(8);
                        expect(publications[6].title).toBe("User Guide");
                        expect(spy).not.toHaveBeenCalled();
                    }
                    done();
                }).catch(error => {
                    fail(`Unexpected error: ${error}`);
                    done();
                });
            });

            it("can get a publication title", (done: () => void): void => {
                const spy = spyOn(window, "XMLHttpRequest").and.callThrough();
                publicationService.getPublicationTitle(publicationId).then(title => {
                    expect(title).toBe("User Guide");
                    expect(spy).toHaveBeenCalled();
                    done();
                }).catch(error => {
                    fail(`Unexpected error: ${error}`);
                    done();
                });
            });

            it("can get a publication title from memory", (done: () => void): void => {
                const spy = spyOn(window, "XMLHttpRequest").and.callThrough();
                publicationService.getPublicationTitle(publicationId).then(title => {
                    expect(title).toBe("User Guide");
                    expect(spy).not.toHaveBeenCalled();
                    done();
                }).catch(error => {
                    fail(`Unexpected error: ${error}`);
                    done();
                });
            });

            it("returns a proper error when a publication title cannot be resolved", (done: () => void): void => {
                publicationService.getPublicationTitle("does-not-exist").then(() => {
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

new PublicationServiceTests().runTests();
