import { Publications as PublicationsBase } from "models/Publications";
import { TestBase } from "@sdl/models";
import { IPublication } from "interfaces/ServerModels";
import { IPublication as IPublicationInterface } from "interfaces/Publication";
import { localization } from "services/common/LocalizationService";
import { DEFAULT_UNKNOWN_PRODUCT_FAMILY_TITLE } from "models/Publications";

const MOCK_DATA: IPublication[] = [
    {
        Id: "Pub1",
        Title: "Pub1",
        ProductFamily: "Family 1",
        CreatedOn: "",
        Version: "1",
        LogicalId: "GUID-123",
        VersionRef: "123",
        Language: "en"
    },
    {
        Id: "Pub2",
        Title: "Pub2",
        ProductFamily: "Family 2",
        CreatedOn: "",
        ProductReleaseVersion: "V1",
        Version: "1",
        LogicalId: "GUID-123",
        VersionRef: "123",
        Language: "en"
    }, {
        Id: "Pub3",
        Title: "Pub3",
        ProductFamily: "Family 2",
        ProductReleaseVersion: null,
        CreatedOn: "",
        Version: "1",
        LogicalId: "GUID-123",
        VersionRef: "123",
        Language: "en"
    },
    {
        Id: "Pub",
        Title: "Pub",
        CreatedOn: "",
        Version: "1",
        LogicalId: "GUID-123",
        VersionRef: "123",
        Language: "en"
    },
    {
        Id: "Pub4",
        Title: "Pub4",
        ProductFamily: null,
        CreatedOn: "",
        Version: "1",
        LogicalId: "GUID-123",
        VersionRef: "123",
        Language: "en"
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
                    expect(families[0].title).toBe(DEFAULT_UNKNOWN_PRODUCT_FAMILY_TITLE);
                    expect(families[1].title).toBe("Family 1");
                    expect(families[2].title).toBe("Family 2");
                }
            });

            it("filters product families in alphabetical order", (): void => {
                spyOn(publicationModel, "getPublications").and.callFake((): IPublicationInterface[] => {
                    return [{
                        id: "1",
                        title: "Title",
                        productFamily: "Blackberry",
                        createdOn: new Date(),
                        version: "1",
                        logicalId: "GUID-123"
                    }, {
                        id: "2",
                        title: "Title",
                        productFamily: "Strawberry",
                        createdOn: new Date(),
                        version: "1",
                        logicalId: "GUID-123"
                    }, {
                        id: "3",
                        title: "Title",
                        productFamily: "blueberry",
                        createdOn: new Date(),
                        version: "1",
                        logicalId: "GUID-123"
                    }, {
                        id: "4",
                        title: "Title",
                        productFamily: "Watermelonberry",
                        createdOn: new Date(),
                        version: "1",
                        logicalId: "GUID-123"
                    }, {
                        id: "5",
                        title: "Title",
                        productFamily: "elderberry",
                        createdOn: new Date(),
                        version: "1",
                        logicalId: "GUID-123"
                    }, {
                        id: "6",
                        title: "Title",
                        productFamily: "Mulberry",
                        createdOn: new Date(),
                        version: "1",
                        logicalId: "GUID-123"
                    }, {
                        id: "7",
                        title: "Salat item 7",
                        createdOn: new Date(),
                        version: "1",
                        logicalId: "GUID-123"
                    }, {
                        id: "8",
                        title: "Salat item 8",
                        productFamily: null,
                        createdOn: new Date(),
                        version: "1",
                        logicalId: "GUID-123"
                    }];
                });

                const families = publicationModel.getProductFamilies();
                expect(families).toBeDefined();
                if (families) {
                    expect(families.length).toBe(7);
                    expect(families[0].title).toBe(DEFAULT_UNKNOWN_PRODUCT_FAMILY_TITLE);
                    expect(families[1].title).toBe("Blackberry");
                    expect(families[2].title).toBe("blueberry");
                    expect(families[3].title).toBe("elderberry");
                    expect(families[4].title).toBe("Mulberry");
                    expect(families[5].title).toBe("Strawberry");
                    expect(families[6].title).toBe("Watermelonberry");
                }
            });

            it("can resolve publications for a product family", (): void => {
                const publications = publicationModel.getPublications("family 2");
                expect(publications).toBeDefined();
                if (publications) {
                    expect(publications.length).toBe(2);
                    expect(publications[0].title).toBe("Pub2");
                    expect(publications[1].title).toBe("Pub3");
                }
            });

            it("can resolve publications for an unknown product family", (): void => {
                const unknownProductFamilyTitle: string = localization.formatMessage("productfamilies.unknown.title");
                const publications = publicationModel.getPublications(unknownProductFamilyTitle);
                expect(publications).toBeDefined();
                if (publications) {
                    expect(publications.length).toBe(2);
                    expect(publications[0].title).toBe("Pub");
                    expect(publications[1].title).toBe("Pub4");
                }
            });

            it("can resolve publications for a product release version", (): void => {
                const publications = publicationModel.getPublications("Family 2", "v1");
                expect(publications).toBeDefined();
                if (publications) {
                    expect(publications.length).toBe(1);
                    expect(publications[0].title).toBe("Pub2");
                }
            });

            it("can resolve publications for an unknown product release version", (): void => {
                const unknownProductReleaseVersion: string = localization.formatMessage("productreleaseversions.unknown.title");
                const publications = publicationModel.getPublications("Family 2", unknownProductReleaseVersion);
                expect(publications).toBeDefined();
                if (publications) {
                    expect(publications.length).toBe(1);
                    expect(publications[0].title).toBe("Pub3");
                }
            });

            it("can resolve product release versions for an unknown product family", (): void => {
                const unknownProductFamilyTitle: string = localization.formatMessage("productfamilies.unknown.title");
                const unknownProductReleaseVersionTitle: string = localization.formatMessage("productreleaseversions.unknown.title");
                const releaseVersions = publicationModel.getProductReleaseVersions(unknownProductFamilyTitle);
                expect(releaseVersions).toBeDefined();
                if (releaseVersions) {
                    expect(releaseVersions.length).toBe(1);
                    expect(releaseVersions[0].title).toBe(unknownProductReleaseVersionTitle);
                }
            });

            it("can resolve product release versions for a publication", (): void => {
                const releaseVersions = publicationModel.getProductReleaseVersionsByPublicationId("Pub3");
                const unknownProductReleaseVersionTitle: string = localization.formatMessage("productreleaseversions.unknown.title");
                expect(releaseVersions).toBeDefined();
                if (releaseVersions) {
                    expect(releaseVersions.length).toBe(2);
                    expect(releaseVersions[0].title).toBe("V1");
                    expect(releaseVersions[1].title).toBe(unknownProductReleaseVersionTitle);
                }
            });

        });
    }
}

new PublicationsModel().runTests();
