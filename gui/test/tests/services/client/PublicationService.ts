import { PublicationService } from "services/client/PublicationService";
import { TestBase } from "sdl-models";
import { FakeXMLHttpRequest } from "test/mocks/XmlHttpRequest";

class PublicationServiceTests extends TestBase {

    public runTests(): void {
        const publicationService = new PublicationService();
        const publicationId = "1656863";

        describe(`Publication service tests.`, (): void => {

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

            it("can get the publications", (done: () => void): void => {
                publicationService.getPublications().then(publications => {
                    expect(publications).toBeDefined();
                    if (publications) {
                        expect(publications.length).toBe(8);
                        expect(publications[1].title).toBe("Publication MP330");
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
                        expect(publications[1].title).toBe("Publication MP330");
                        expect(spy).not.toHaveBeenCalled();
                    }
                    done();
                }).catch(error => {
                    fail(`Unexpected error: ${error}`);
                    done();
                });
            });

            it("can get a publication title", (done: () => void): void => {
                publicationService.getPublicationTitle(publicationId).then(title => {
                    expect(title).toBe("Publication MP330");
                    done();
                }).catch(error => {
                    fail(`Unexpected error: ${error}`);
                    done();
                });
            });

            it("can get a publication title from memory", (done: () => void): void => {
                const spy = spyOn(window, "XMLHttpRequest").and.callThrough();
                publicationService.getPublicationTitle(publicationId).then(title => {
                    expect(title).toBe("Publication MP330");
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
