/// <reference path="../../../../src/components/container/App.tsx" />
/// <reference path="../../../../src/global/client/RoutingClient.ts" />

module Sdl.DitaDelivery.Tests {

    class RoutingClientTests extends SDL.Client.Test.TestBase {

        public runTests(): void {
            const Routing = new RoutingClient("/", true);

            describe(`Routing tests.`, (): void => {
                const data = {
                    publicationId: "ish:9137-1-1",
                    pageId: "ish:9137-235-16",
                    nextPageId: "ish:9137-126878-16"
                };

                it("can set the publication location", (): void => {
                    Routing.setPublicationLocation(data.publicationId, "pub title", data.pageId, "page title");
                    const location = Routing.getPublicationLocation();
                    expect(location).toBeDefined();
                    if (location) {
                        expect(location.publicationId).toBe(data.publicationId);
                        expect(location.pageId).toBe(data.pageId);
                    }
                });

                it("can set the page location", (): void => {
                    Routing.setPageLocation(data.nextPageId);
                    const location = Routing.getPublicationLocation();
                    expect(location).toBeDefined();
                    if (location) {
                        expect(location.publicationId).toBe(data.publicationId);
                        expect(location.pageId).toBe(data.nextPageId);
                    }
                });

                it("can set a publication location without a page", (): void => {
                    Routing.setPublicationLocation(data.publicationId, "pub title");
                    const location = Routing.getPublicationLocation();
                    expect(location).toBeDefined();
                    if (location) {
                        expect(location.publicationId).toBe(data.publicationId);
                        expect(location.pageId).toBeNull();
                    }
                });
            });

        }
    }

    new RoutingClientTests().runTests();
}
