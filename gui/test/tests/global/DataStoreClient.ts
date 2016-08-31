/// <reference path="../../../src/components/container/App.tsx" />
/// <reference path="../../../src/global/DataStoreClient.ts" />

module Sdl.DitaDelivery.Tests {

    class DataStoreClientTests extends SDL.Client.Test.TestBase {

        public runTests(): void {
            const DataStore = new DataStoreClient();

            describe(`Data Store tests (Toc).`, (): void => {

                it("can get site map items for the root", (done: () => void): void => {
                    DataStore.getSitemapRoot((error, children) => {
                        expect(error).toBeNull();
                        expect(children.length).toBe(1);
                        done();
                    });
                });

                it("can get site map items from memory", (done: () => void): void => {
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
                        expect(children).toBeUndefined();
                        done();
                    });
                });

            });

            describe(`Data Store tests (Page).`, (): void => {

                it("can get page info", (done: () => void): void => {
                    const pageId = "ish:39137-6222-16";
                    DataStore.getPageInfo(pageId, (error, pageInfo) => {
                        expect(error).toBeNull();
                        expect(pageInfo.title).toBe("getting started");
                        expect(pageInfo.content.length).toBe(127);
                        const element = document.createElement("span");
                        element.innerHTML = pageInfo.content;
                        expect(element.children.length).toBe(1);
                        expect((element.children[0] as HTMLElement).children.length).toBe(2);
                        done();
                    });
                });

                it("can get page info from memory", (done: () => void): void => {
                    const pageId = "ish:39137-6222-16";
                    const spy = spyOn(SDL.Client.Net, "getRequest").and.callThrough();
                    DataStore.getPageInfo(pageId, (error, pageInfo) => {
                        expect(error).toBeNull();
                        expect(pageInfo.title).toBe("getting started");
                        expect(pageInfo.content.length).toBe(127);
                        expect(spy).not.toHaveBeenCalled();
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

        }
    }

    new DataStoreClientTests().runTests();
}
