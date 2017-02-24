import { Publications } from "models/Publications";
import { TestBase } from "sdl-models";

class PublicationsModel extends TestBase {

    public runTests(): void {

        describe(`Publications model tests.`, (): void => {

            let publicationModel: Publications;
            beforeEach(() => {
                publicationModel  = new Publications();
            });

            afterEach(() => {
                publicationModel.unload();
            });

            it("can resolve product families", (): void => {
                spyOn(publicationModel, "getPublications").and.callFake(() => {
                    return [{
                        "id": "Pub1",
                        "productFamily": "Family 1"
                    }, {
                        "id": "Pub2",
                        "productFamily": "Family 2"
                    }, {
                        "id": "Pub3",
                        "productFamily": "Family 2"
                    }, {
                        "Id": "Pub"
                    }];
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

            it("filters product families in alphabetical order", (): void => {
                spyOn(publicationModel, "getPublications").and.callFake(() => {
                    return [{
                        "id": "1",
                        "productFamily": "Blackberry"
                    }, {
                        "id": "2",
                        "productFamily": "Strawberry"
                    }, {
                        "id": "3",
                        "productFamily": "Blueberry"
                    }, {
                        "id": "4",
                        "productFamily": "Watermelonberry"
                    }, {
                        "id": "5",
                        "productFamily": "Elderberry"
                    }, {
                        "id": "6",
                        "productFamily": "Mulberry"
                    }, {
                        "id": "7",
                        "title": "Salat item 7"
                    }];
                });

                const families = publicationModel.getProductFamilies();
                expect(families).toBeDefined();
                if (families) {
                    expect(families.length).toBe(7);
                    expect(families[0].title).toBe("Blackberry");
                    expect(families[1].title).toBe("Blueberry");
                    expect(families[2].title).toBe("Elderberry");
                    expect(families[3].title).toBe("Mulberry");
                    expect(families[4].title).toBe("Strawberry");
                    expect(families[5].title).toBe("Watermelonberry");
                    expect(families[6].title).toBe("Unknown product");
                }
            });
        });
    }
}

new PublicationsModel().runTests();
