import { PageService } from "services/client/PageService";
import { TestBase } from "@sdl/models";
import { IWindow } from "interfaces/Window";
import { IPostComment } from "interfaces/Comments";
import { FakeXMLHttpRequest } from "test/mocks/XmlHttpRequest";

interface IXMLHttpRequestWindow extends Window {
    XMLHttpRequest: {};
}

class PageServiceTests extends TestBase {

    public runTests(): void {
        const win = (window as IWindow);
        const mocksFlag = win.SdlDitaDeliveryMocksEnabled;
        const pageService = new PageService();
        const publicationId = "1961702";

        describe(`Page service tests.`, (): void => {
            beforeEach(() => {
                win.SdlDitaDeliveryMocksEnabled = true;
            });

            afterEach(() => {
                win.SdlDitaDeliveryMocksEnabled = mocksFlag;
            });

            it("can get page info", (done: () => void): void => {
                const pageId = "164398";
                pageService.getPageInfo(publicationId, pageId).then(pageInfo => {
                    expect(pageInfo).toBeDefined();
                    if (pageInfo) {
                        expect(pageInfo.title).toBe("Getting started");
                        expect(pageInfo.content.length).toBe(1323);
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
                const spy = spyOn(XMLHttpRequest.prototype, "open").and.callThrough();
                pageService.getPageInfo(publicationId, pageId).then(pageInfo => {
                    expect(pageInfo).toBeDefined();
                    if (pageInfo) {
                        expect(pageInfo.title).toBe("Getting started");
                        expect(pageInfo.content.length).toBe(1323);
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

            it("can get comments", (done: () => void): void => {
                const pageId = "164398";
                pageService.getComments(publicationId, pageId, false, 0, 0, [0]).then(comments => {
                    expect(comments).toBeDefined();
                    if (comments.length > 0) {

                        expect(comments[0].itemPublicationId).toBeDefined();
                        expect(comments[0].itemId).toBeDefined();
                        expect(comments[0].user).toBeDefined();
                    }
                    done();
                }).catch(error => {
                    fail(`Unexpected error: ${error}`);
                    done();
                });
            });

            it("can get comments from memory", (done: () => void): void => {
                const pageId = "164398";
                const spy = spyOn(XMLHttpRequest.prototype, "open").and.callThrough();
                pageService.getComments(publicationId, pageId, false, 0, 0, [0]).then(comments => {
                    expect(comments).toBeDefined();
                    if (comments.length > 0) {
                        expect(comments[0].itemPublicationId).toBeDefined();
                        expect(comments[0].itemId).toBeDefined();
                        expect(comments[0].user).toBeDefined();
                    }
                    expect(spy).not.toHaveBeenCalled();
                    done();
                }).catch(error => {
                    fail(`Unexpected error: ${error}`);
                    done();
                });
            });
        });

        describe(`Page service tests. Page comments`, (): void => {
            beforeEach(() => {
                win.SdlDitaDeliveryMocksEnabled = false;
            });

            afterEach(() => {
                win.SdlDitaDeliveryMocksEnabled = mocksFlag;
            });

            it("can save comment", (done: () => void): void => {
                let fakeRequest = new FakeXMLHttpRequest("");
                fakeRequest.status = 200;
                fakeRequest.responseText = `{"id":0}`;
                const spy = spyOn(window as IXMLHttpRequestWindow, "XMLHttpRequest").and.callFake(() => fakeRequest);
                pageService.saveComment({
                    publicationId: "1",
                    pageId: "2",
                    username: "tester",
                    email: "test@sdl.com",
                    content: "Comment",
                    parentId: 0
                } as IPostComment).then(comment => {
                    expect(comment).toBeDefined();
                    expect(comment.id).toBe(0);
                    expect(spy).toHaveBeenCalled();
                    done();
                }).catch(error => {
                    fail(`Unexpected error: ${error}`);
                    done();
                });
            });

            it("show error when save comment failed", (done: () => void): void => {
                const failMessage = "failure-saving-comment";
                spyOn(window as IXMLHttpRequestWindow, "XMLHttpRequest").and.callFake(() => new FakeXMLHttpRequest(failMessage));
                pageService.saveComment({
                    publicationId: "1",
                    pageId: "2",
                    username: "tester",
                    email: "test@sdl.com",
                    content: "Comment",
                    parentId: 0
                } as IPostComment).then(() => {
                    fail("An error was expected.");
                    done();
                }).catch(error => {
                    expect(error).toContain(failMessage);
                    done();
                });
            });
        });
    }
}

new PageServiceTests().runTests();
