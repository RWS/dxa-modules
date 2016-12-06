import { PageService } from "services/client/PageService";

// Global Catalina dependencies
import TestBase = SDL.Client.Test.TestBase;

class PageServiceTests extends TestBase {

    public runTests(): void {
        const pageService = new PageService();
        const publicationId = "1656863";

        describe(`Page service tests.`, (): void => {

            it("can get page info", (done: () => void): void => {
                const pageId = "164398";
                pageService.getPageInfo(publicationId, pageId).then(pageInfo => {
                    expect(pageInfo).toBeDefined();
                    if (pageInfo) {
                        expect(pageInfo.title).toBe("Getting started");
                        expect(pageInfo.content.length).toBe(1332);
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
                const pageId = "164398";
                const spy = spyOn(SDL.Client.Net, "getRequest").and.callThrough();
                pageService.getPageInfo(publicationId, pageId).then(pageInfo => {
                    expect(pageInfo).toBeDefined();
                    if (pageInfo) {
                        expect(pageInfo.title).toBe("Getting started");
                        expect(pageInfo.content.length).toBe(1332);
                        expect(spy).not.toHaveBeenCalled();
                    }
                    done();
                }).catch(error => {
                    fail(`Unexpected error: ${error}`);
                    done();
                });
            });

            it("returns a proper error when a page does not exist", (done: () => void): void => {
                pageService.getPageInfo(publicationId, "does-not-exist").then(() => {
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

new PageServiceTests().runTests();
