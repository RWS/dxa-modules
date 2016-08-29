/// <reference path="../../src/components/App.tsx" />
/// <reference path="../../src/DataStore.ts" />

module Sdl.DitaDelivery.Tests {

    import DataStore = Sdl.DitaDelivery.DataStore;

    class DataStoreTests extends SDL.Client.Test.TestBase {

        public runTests(): void {

            describe(`Data Store tests (Toc).`, (): void => {

                it("can get site map items for the root", (done: () => void): void => {
                    DataStore.getSitemapRoot((error, children) => {
                        expect(error).toBeNull();
                        expect(children.length).toBe(1);
                        done();
                    });
                });

                it("can get page content from memory", (done: () => void): void => {
                    const spy = spyOn(SDL.Client.Net, "getRequest").and.callThrough();
                    DataStore.getSitemapRoot((error, children) => {
                        expect(error).toBeNull();
                        expect(children.length).toBe(1);
                        expect(spy).not.toHaveBeenCalled();
                        done();
                    });
                });

                it("can get site map items for a child", (done: () => void): void => {
                    const getChildren = (parentId: string): void => {
                        DataStore.getSitemapItems(parentId, (error, children) => {
                            expect(error).toBeNull();
                            expect(children.length).toBe(9);
                            done();
                        });
                    };

                    DataStore.getSitemapRoot((error, children) => {
                        expect(error).toBeNull();
                        expect(children.length).toBe(1);
                        getChildren(children[0].Id);
                    });
                });

                it("returns a proper error when a parent id does not exist", (done: () => void): void => {
                    DataStore.getSitemapItems("does-not-exist", (error, children) => {
                        expect(error).toContain("does-not-exist");
                        expect(children.length).toBe(0);
                        done();
                    });
                });

            });

            describe(`Data Store tests (Page).`, (): void => {

                it("can get page content", (done: () => void): void => {
                    const pageId = "ish:39137-6222-16";
                    DataStore.getPageContent(pageId, (error, content) => {
                        expect(error).toBeNull();
                        expect(content.length).toBe(127);
                        const element = document.createElement("span");
                        element.innerHTML = content;
                        expect(element.children.length).toBe(1);
                        expect((element.children[0] as HTMLElement).children.length).toBe(2);
                        done();
                    });
                });

                it("can get page content from memory", (done: () => void): void => {
                    const pageId = "ish:39137-6222-16";
                    const spy = spyOn(SDL.Client.Net, "getRequest").and.callThrough();
                    DataStore.getPageContent(pageId, (error, content) => {
                        expect(error).toBeNull();
                        expect(content.length).toBe(127);
                        expect(spy).not.toHaveBeenCalled();
                        done();
                    });
                });

                it("returns a proper error when a page does not exist", (done: () => void): void => {
                    DataStore.getPageContent("does-not-exist", (error, content) => {
                        expect(error).toContain("does-not-exist");
                        expect(content).toBe("");
                        done();
                    });
                });

            });

        }
    }

    new DataStoreTests().runTests();
}
