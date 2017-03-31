import { PublicationService } from "services/server/PublicationService";
import { TestBase } from "sdl-models";

class PublicationServiceTests extends TestBase {

    public runTests(): void {
        const publicationService = new PublicationService();

        describe(`Data Store tests (Publications).`, (): void => {

            it("can get a publication by id", (done: () => void): void => {
                const publicationId = "ish:39137-1-1";
                publicationService.getPublicationById(publicationId).then(pub => {
                    expect(pub.title).toBe("MP330");
                    done();
                }).catch(error => {
                    fail(`Unexpected error: ${error}`);
                    done();
                });
            });
        });
    }
}

new PublicationServiceTests().runTests();
