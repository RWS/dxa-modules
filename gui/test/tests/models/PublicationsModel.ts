/**
 *
 *  Copyright (c) 2014 All Rights Reserved by the SDL Group.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

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
        ProductFamily: ["Family 1"],
        CreatedOn: "",
        Version: "1",
        LogicalRef: "123",
        LogicalId: "GUID-123",
        VersionRef: "123",
        Language: "en"
    },
    {
        Id: "Pub2",
        Title: "Pub2",
        ProductFamily: ["Family 2"],
        ProductReleaseVersion: ["V1"],
        CreatedOn: "",
        Version: "1",
        LogicalRef: "123",
        LogicalId: "GUID-123",
        VersionRef: "123",
        Language: "en"
    },
    {
        Id: "Pub3",
        Title: "Pub3",
        ProductFamily: ["Family 2"],
        ProductReleaseVersion: null,
        CreatedOn: "",
        Version: "1",
        LogicalRef: "123",
        LogicalId: "GUID-123",
        VersionRef: "123",
        Language: "en"
    },
    {
        Id: "Pub",
        Title: "Pub",
        CreatedOn: "",
        Version: "1",
        LogicalRef: "123",
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
        LogicalRef: "123",
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
                    expect(families.map(family => family.title)).toEqual([
                        "Family 2", // Occurs twice
                        "Family 1",
                        DEFAULT_UNKNOWN_PRODUCT_FAMILY_TITLE
                    ]);
                }
            });

            it("filters product families in alphabetical order", (): void => {
                const berries = [
                    "Blackberry",
                    "Strawberry",
                    "Blueberry",
                    "Watermelonberry",
                    "Elderberry",
                    "Mulberry",
                    null
                ];

                spyOn(publicationModel, "getPublications").and.callFake((): IPublicationInterface[] =>
                    berries.map(
                        (family, i) =>
                            ({
                                id: `${i}`,
                                title: `Title - ${i}`,
                                productFamily: [family],
                                createdOn: new Date(),
                                version: "1",
                                logicalId: `GUID-${i}`
                            } as IPublicationInterface)
                    )
                );

                const families = publicationModel.getProductFamilies();
                expect(families).toBeDefined();
                if (families) {
                    const sortedBerries = berries.sort();
                    expect(families.length).toBe(7);
                    families.forEach((family, index) => {
                        expect(families[index].title).toBe(
                            index === 6 ? DEFAULT_UNKNOWN_PRODUCT_FAMILY_TITLE : "" + sortedBerries[index]
                        );
                    });
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
                const unknownProductReleaseVersion: string = localization.formatMessage(
                    "productreleaseversions.unknown.title"
                );
                const publications = publicationModel.getPublications("Family 2", unknownProductReleaseVersion);
                expect(publications).toBeDefined();
                if (publications) {
                    expect(publications.length).toBe(1);
                    expect(publications[0].title).toBe("Pub3");
                }
            });

            it("can resolve product release versions for an unknown product family", (): void => {
                const unknownProductFamilyTitle: string = localization.formatMessage("productfamilies.unknown.title");
                const unknownProductReleaseVersionTitle: string = localization.formatMessage(
                    "productreleaseversions.unknown.title"
                );
                const releaseVersions = publicationModel.getProductReleaseVersions(unknownProductFamilyTitle);
                expect(releaseVersions).toBeDefined();
                if (releaseVersions) {
                    expect(releaseVersions.length).toBe(1);
                    expect(releaseVersions[0].title).toBe(unknownProductReleaseVersionTitle);
                }
            });

            it("can resolve product release versions for a publication", (): void => {
                const releaseVersions = publicationModel.getProductReleaseVersionsByPublicationId("Pub3");
                const unknownProductReleaseVersionTitle: string = localization.formatMessage(
                    "productreleaseversions.unknown.title"
                );
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
