/// <reference path="../../../../src/components/container/App.tsx" />
/// <reference path="../../../../src/global/server/DataStoreServer.ts" />
/// <reference path="../../../../src/global/server/LocalizationServer.ts" />

module Sdl.DitaDelivery.Tests {

    class DataStoreServerTests extends SDL.Client.Test.TestBase {

        public runTests(): void {
            const DataStore = new DataStoreServer();

            describe(`Data Store tests (Publications).`, (): void => {

                beforeAll(() => {
                    Sdl.DitaDelivery.Localization = new LocalizationServer();
                    Sdl.DitaDelivery.Routing = new RoutingServer();
                });

                it("can get a publication title", (done: () => void): void => {
                    const publicationId = "ish:39137-1-1";
                    DataStore.getPublicationTitle(publicationId).then(title => {
                        expect(title).toBe("MP330");
                        done();
                    }).catch(error => {
                        fail(`Unexpected error: ${error}`);
                        done();
                    });
                });
            });
        }
    }

    new DataStoreServerTests().runTests();
}
