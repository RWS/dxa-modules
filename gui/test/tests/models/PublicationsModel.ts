import { Publications } from "models/Publications";
import { TestBase } from "sdl-models";
import { IPublication } from "interfaces/Publication";

class PublicationsModel extends TestBase {

    public runTests(): void {

        describe(`Publications model tests.`, (): void => {

            const publicationModel = new Publications();
            const MOCK_DATA: IPublication[] = [
                {
                    id: "Pub1",
                    title: "Pub1",
                    productFamily: "Family 1"
                },
                {
                    id: "Pub2",
                    title: "Pub2",
                    productFamily: "Family 2"
                }, {
                    id: "Pub3",
                    title: "Pub3",
                    productFamily: "Family 2"
                },
                {
                    id: "Pub",
                    title: "Pub"
                },
                {
                    id: "Pub4",
                    title: "Pub4",
                    productFamily: null
                }
            ];

            it("can resolve product families", (): void => {
                spyOn(publicationModel, "getPublications").and.callFake(() => MOCK_DATA);

                const families = publicationModel.getProductFamilies();
                expect(families).toBeDefined();
                if (families) {
                    expect(families.length).toBe(3);
                    expect(families[0].title).toBe("Family 1");
                    expect(families[1].title).toBe("Family 2");
                    expect(families[2].title).toBe("Unknown product");
                }
            });

            it("can resolve publications for a product family", (): void => {
                spyOn(publicationModel, "getPublications").and.callFake(() => MOCK_DATA);

                const publications = publicationModel.getPublications("Family 2");
                expect(publications).toBeDefined();
                if (publications) {
                    expect(publications.length).toBe(2);
                    expect(publications[0].title).toBe("Pub2");
                    expect(publications[0].title).toBe("Pub3");
                }
            });

            it("can resolve publications for an unknown product family", (): void => {
                spyOn(publicationModel, "getPublications").and.callFake(() => MOCK_DATA);

                const publications = publicationModel.getPublications();
                expect(publications).toBeDefined();
                if (publications) {
                    expect(publications.length).toBe(2);
                    expect(publications[0].title).toBe("Pub");
                    expect(publications[1].title).toBe("Pub 4");
                }
            });
        });
    }
}

new PublicationsModel().runTests();
