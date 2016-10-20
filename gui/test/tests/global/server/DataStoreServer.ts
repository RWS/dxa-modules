import { DataStoreServer } from "../../../../src/global/server/DataStoreServer";

// Global Catalina dependencies
import TestBase = SDL.Client.Test.TestBase;

class DataStoreServerTests extends TestBase {

    public runTests(): void {
        const DataStore = new DataStoreServer();

        describe(`Data Store tests (Publications).`, (): void => {

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
