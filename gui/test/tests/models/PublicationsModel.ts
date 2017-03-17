import { Publications as PublicationsBase } from "models/Publications";
import { TestBase } from "sdl-models";
import { IPublication } from "interfaces/ServerModels";
import { IPublication as IPublicationInterface } from "interfaces/Publication";
import { localization } from "services/common/LocalizationService";

const MOCK_DATA: IPublication[] = [
    {
        Id: "Pub1",
        Title: "Pub1",
        ProductFamily: "Family 1",
        CreatedOn: "",
        Version: "1"
    },
    {
        Id: "Pub2",
        Title: "Pub2",
        ProductFamily: "Family 2",
        CreatedOn: "",
        Version: "1"
    }, {
        Id: "Pub3",
        Title: "Pub3",
        ProductFamily: "Family 2",
        CreatedOn: "",
        Version: "1"
    },
    {
        Id: "Pub",
        Title: "Pub",
        CreatedOn: "",
        Version: "1"
    },
    {
        Id: "Pub4",
        Title: "Pub4",
        ProductFamily: null,
        CreatedOn: "",
        Version: "1"
    }
];

class Publications extends PublicationsBase {
    protected _executeLoad(reload: boolean): void {
        const onLoad = this.getDelegate(this._onLoad);
        if (onLoad) {
            onLoad(JSON.stringify(MOCK_DATA), null);
        }
    }
}

class PublicationsModel extends TestBase {

    public runTests(): void {

        describe(`Publications model tests.`, (): void => {

            let publicationModel: Publications;
            beforeEach(() => {
                publicationModel = new Publications();
                publicationModel.load();
            });

            afterEach(() => {
                publicationModel.unload();
            });

            it("can resolve product families", (): void => {
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
                spyOn(publicationModel, "getPublications").and.callFake((): IPublicationInterface[] => {
                    return [{
                        "id": "1",
                        "productFamily": "Blackberry"
                    }, {
                        "id": "2",
                        "productFamily": "Strawberry"
                    }, {
                        "id": "3",
                        "productFamily": "blueberry"
                    }, {
                        "id": "4",
                        "productFamily": "Watermelonberry"
                    }, {
                        "id": "5",
                        "productFamily": "elderberry"
                    }, {
                        "id": "6",
                        "productFamily": "Mulberry"
                    }, {
                        "id": "7",
                        "title": "Salat item 7"
                    }, {
                        "id": "8",
                        "title": "Salat item 8",
                        "productFamily": null
                    }];
                });

                const families = publicationModel.getProductFamilies();
                expect(families).toBeDefined();
                if (families) {
                    expect(families.length).toBe(7);
                    expect(families[0].title).toBe("Blackberry");
                    expect(families[1].title).toBe("blueberry");
                    expect(families[2].title).toBe("elderberry");
                    expect(families[3].title).toBe("Mulberry");
                    expect(families[4].title).toBe("Strawberry");
                    expect(families[5].title).toBe("Watermelonberry");
                    expect(families[6].title).toBe("Unknown product");
                }
            });

            it("can resolve publications for a product family", (): void => {
                const publications = publicationModel.getPublications("Family 2");
                expect(publications).toBeDefined();
                if (publications) {
                    expect(publications.length).toBe(2);
                    expect(publications[0].title).toBe("Pub2");
                    expect(publications[1].title).toBe("Pub3");
                }
            });

            it("can resolve publications for an unknown product family", (): void => {
                const unknownProductFamilyTitle: string = localization.formatMessage("components.productfamilies.unknown.title");
                const publications = publicationModel.getPublications(unknownProductFamilyTitle);
                expect(publications).toBeDefined();
                if (publications) {
                    expect(publications.length).toBe(2);
                    expect(publications[0].title).toBe("Pub");
                    expect(publications[1].title).toBe("Pub4");
                }
            });
        });
    }
}

new PublicationsModel().runTests();
