/// <reference path="../../src/components/App.tsx" />
/// <reference path="../../src/DataStore.ts" />

module Sdl.KcWebApp.Tests {

    import DataStore = Sdl.KcWebApp.DataStore;

    class DataStoreTests extends SDL.Client.Test.TestBase {

        public runTests(): void {

            describe(`Data Store tests.`, (): void => {

                it("can get site map items for the root", (done: () => void): void => {
                    DataStore.getSitemapRoot((error, children) => {
                        expect(error).toBeNull();
                        expect(children.length).toBe(1);
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

        }
    }

    new DataStoreTests().runTests();
}
