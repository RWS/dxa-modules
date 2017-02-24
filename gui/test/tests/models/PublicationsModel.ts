import { Publications as PublicationsBase } from "models/Publications";
import { TestBase } from "sdl-models";
import { IPublication } from "interfaces/ServerModels";
import { localization } from "services/common/LocalizationService";

const MOCK_DATA: IPublication[] = [
    {
        Id: "Pub1",
        Title: "Pub1",
        ProductFamily: "Family 1"
    },
    {
        Id: "Pub2",
        Title: "Pub2",
        ProductFamily: "Family 2"
    }, {
        Id: "Pub3",
        Title: "Pub3",
        ProductFamily: "Family 2"
    },
    {
        Id: "Pub",
        Title: "Pub"
    },
    {
        Id: "Pub4",
        Title: "Pub4",
        ProductFamily: null
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

            const publicationModel = new Publications();
            publicationModel.load();

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
