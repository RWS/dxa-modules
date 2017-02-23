import { Publications } from "models/Publications";
import { TestBase } from "sdl-models";

class PublicationsModel extends TestBase {

    public runTests(): void {

        describe(`Publications model tests.`, (): void => {

            const publicationModel = new Publications();

            it("can resolve product families", (): void => {
                spyOn(publicationModel, "getPublications").and.callFake(() => {
                    return [
                        {
                            "id": "Pub1",
                            "title": "Pub1",
                            "productFamily": "Family 1"
                        },
                        {
                            "id": "Pub2",
                            "title": "Pub2",
                            "productFamily": "Family 2"
                        }, {
                            "id": "Pub3",
                            "title": "Pub3",
                            "productFamily": "Family 2"
                        },
                        {
                            "Id": "Pub",
                            "title": "Pub"
                        }
                    ];
                });

                const families = publicationModel.getProductFamilies();
                expect(families).toBeDefined();
                if (families) {
                    expect(families.length).toBe(3);
                    expect(families[0].title).toBe("Family 1");
                    expect(families[1].title).toBe("Family 2");
                    expect(families[2].title).toBe("Unknown product");
                }
            });
        });
    }
}

new PublicationsModel().runTests();
