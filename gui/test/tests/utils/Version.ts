import Version from "utils/Version";
import { IPublication } from "interfaces/Publication";

describe(`Version tests.`, (): void => {

    it("sorts product release version correctly", (): void => {
        const defaultPub: IPublication = {
            id: "1",
            title: "Title1",
            createdOn: new Date(),
            version: "1",
            logicalId: "GUID-123"
        };
        const publications: IPublication[] = [
            /**
             * With version number between braces at the end
             */
            {
                ...defaultPub,
                productFamily: "PF1",
                productReleaseVersion: "PR v1(1)"
            },
            {
                ...defaultPub,
                productFamily: "PF1",
                productReleaseVersion: "PR v2(2)"
            },
            {
                ...defaultPub,
                productFamily: "PF1",
                productReleaseVersion: "PR v1.2.0(1.2.0)"
            },
            {
                ...defaultPub,
                productFamily: "PF1",
                productReleaseVersion: "PR v1.0.2(1.0.2)"
            },
            {
                ...defaultPub,
                productFamily: "PF1",
                productReleaseVersion: "PR v1.6.18(1.6.18)"
            },
            {
                ...defaultPub,
                productFamily: "PF1",
                productReleaseVersion: "PR v1.11.124(1.11.124)"
            },
            {
                ...defaultPub,
                productFamily: "PF1",
                productReleaseVersion: "PR vx",
                title: "PR vx"
            },
            /**
             * Different product families
             */
            {
                ...defaultPub,
                productFamily: "PF2",
                productReleaseVersion: "PR2.1",
                title: "PR2.1"
            },
            {
                ...defaultPub,
                productFamily: "PF3",
                productReleaseVersion: "PR3.1",
                title: "PR3.1"
            },
            {
                ...defaultPub,
                productFamily: "PF4",
                productReleaseVersion: "PR4.1",
                title: "PR4.1"
            },
            {
                ...defaultPub,
                productFamily: "PF5",
                productReleaseVersion: "PR5.1",
                title: "PR5.1"
            },
            /**
             * Different product release versions
             * With created on and version
             */
            {
                ...defaultPub,
                productFamily: "SDL Web",
                productReleaseVersion: "Web 8",
                title: "Web 8",
                createdOn: new Date(defaultPub.createdOn.setFullYear(2016)),
                version: "4"
            },
            {
                ...defaultPub,
                productFamily: "SDL Web",
                productReleaseVersion: "Tridion 98",
                createdOn: new Date(defaultPub.createdOn.setFullYear(1998)),
                version: "1"
            },
            {
                ...defaultPub,
                productFamily: "SDL Web",
                productReleaseVersion: "Tridion 2013",
                createdOn: new Date(defaultPub.createdOn.setFullYear(2013)),
                version: "2"
            },
            {
                ...defaultPub,
                productFamily: "SDL Web",
                productReleaseVersion: "Tridion 2013SP1",
                createdOn: new Date(defaultPub.createdOn.setFullYear(2015)),
                version: "2.1.1"
            },
            {
                ...defaultPub,
                productFamily: "SDL Web",
                productReleaseVersion: "Tridion 2014",
                createdOn: new Date(defaultPub.createdOn.setFullYear(2014)),
                version: "3"
            },
            /**
             * Sort by title
             */
            {
                ...defaultPub,
                productFamily: "PF6",
                title: "Second",
                productReleaseVersion: "Second",
                version: "1"
            },
            {
                ...defaultPub,
                productFamily: "PF6",
                title: "First",
                productReleaseVersion: "First",
                version: "1"
            },
            /**
             * Product release version across many pubs
             */
            {
                ...defaultPub,
                id: "2",
                productFamily: "PF7",
                productReleaseVersion: "PR7.1",
                version: "1",
                createdOn: new Date(defaultPub.createdOn.setFullYear(2018))
            },
            {
                ...defaultPub,
                id: "2",
                productFamily: "PF7",
                productReleaseVersion: "PR7.2",
                version: "2",
                createdOn: new Date(defaultPub.createdOn.setFullYear(2019))
            },
            {
                ...defaultPub,
                id: "3",
                productFamily: "PF7",
                productReleaseVersion: "PR7.1",
                version: "1",
                createdOn: new Date(defaultPub.createdOn.setFullYear(2020))
            },
            {
                ...defaultPub,
                id: "4",
                productFamily: "PF7",
                productReleaseVersion: "PR7.3",
                version: "1",
                createdOn: new Date(defaultPub.createdOn.setFullYear(2012))
            },
            /**
             * Uncategorized, unknown
             */
            {
                ...defaultPub,
                productFamily: null,
                productReleaseVersion: null,
                title: "no family no release version"
            },
            {
                ...defaultPub,
                productFamily: "PF8",
                productReleaseVersion: "v1",
                title: "v1"
            },
            {
                ...defaultPub,
                productFamily: "PF8",
                productReleaseVersion: null,
                title: "family no release version"
            }
        ];
        expect(Version.sortProductReleaseVersionsByProductFamily("PF1", publications))
            .toEqual(["PR v2", "PR v1.11.124", "PR v1.6.18", "PR v1.2.0", "PR v1.0.2", "PR v1", "PR vx"]);
        expect(Version.sortProductReleaseVersionsByProductFamily("PF2", publications)).toEqual(["PR2.1"]);
        expect(Version.sortProductReleaseVersionsByProductFamily("PF3", publications)).toEqual(["PR3.1"]);
        expect(Version.sortProductReleaseVersionsByProductFamily("PF4", publications)).toEqual(["PR4.1"]);
        expect(Version.sortProductReleaseVersionsByProductFamily("PF5", publications)).toEqual(["PR5.1"]);
        expect(Version.sortProductReleaseVersionsByProductFamily("PF6", publications)).toEqual(["First", "Second"]);
        expect(Version.sortProductReleaseVersionsByProductFamily("SDL Web", publications))
            .toEqual(["Web 8", "Tridion 2014", "Tridion 2013SP1", "Tridion 2013", "Tridion 98"]);
        expect(Version.sortProductReleaseVersionsByProductFamily("PF7", publications)).toEqual(["PR7.2", "PR7.1", "PR7.3"]);
        expect(Version.sortProductReleaseVersionsByProductFamily("PF8", publications)).toEqual(["v1", null]);
        expect(Version.sortProductReleaseVersionsByProductFamily(null, publications)).toEqual([null]);
        expect(Version.sortProductReleaseVersions(publications)).toEqual([
            "PR v2", "PR v1.11.124", "PR v1.6.18", "PR v1.2.0", "PR v1.0.2", "PR v1", "PR7.2", "PR7.1", "Web 8", "Tridion 2014", "Tridion 2013SP1",
            "Tridion 2013", "First", "PR vx", "PR2.1", "PR3.1", "PR4.1", "PR5.1", "Second", "PR7.3", "v1", "Tridion 98", null
        ]);
    });

    it("sorts product family version correctly", (): void => {
        const defaultPub: IPublication = {
            id: "1",
            title: "Title1",
            createdOn: new Date(),
            version: "1",
            logicalId: "GUID-123"
        };
        const publications: IPublication[] = [
            /**
             * With version number between braces at the end
             */
            {
                ...defaultPub,
                productFamily: "PF Second (2.0)",
                productReleaseVersion: "PR v3(3)"
            },
            {
                ...defaultPub,
                productFamily: "PF First (1.0.0)",
                productReleaseVersion: "PR v4.2(4)"
            },
            {
                ...defaultPub,
                productFamily: "PF Last (3.0)",
                productReleaseVersion: "PR v2(2)"
            },
            {
                ...defaultPub,
                productFamily: "PF Other ()",
                productReleaseVersion: "PR v5.2(5.2.0)"
            },
            {
                ...defaultPub,
                productFamily: "PF First (1.0)",
                productReleaseVersion: "PR v4(4)"
            },
            {
                ...defaultPub,
                productFamily: "PF First (1)",
                productReleaseVersion: "PR v4.1(4)"
            },
            {
                ...defaultPub,
                productFamily: "PF Last (3.0)",
                productReleaseVersion: "PR v1(1)"
            },
            {
                ...defaultPub,
                productFamily: "",
                productReleaseVersion: "PR v6.0(6.1.1)"
            },
            {
                ...defaultPub,
                productFamily: "PF Other ()",
                productReleaseVersion: "PR v5.0(5.0.1)"
            },
            {
                ...defaultPub,
                productFamily: "PF First (1.1.4)",
                productReleaseVersion: "PR v4.3(4)"
            },
            {
                ...defaultPub,
                productFamily: "PF First (1.2.)",
                productReleaseVersion: "PR v4.4(4)"
            }
        ];
        expect(Version.sortProductFamilyVersions(publications))
            .toEqual(["PF First", "PF Second", "PF Last", "PF First (1.2.)", "PF Other ()", null]);
    });

    it("compares versions correctly", (): void => {
        expect(Version.compareVersion("1", "2")).toEqual(false);
        expect(Version.compareVersion("1.1.1", "2")).toEqual(false);
        expect(Version.compareVersion("1.1.1.1.2", "2")).toEqual(false);
        expect(Version.compareVersion("1.1.1.1.2", "1.1.2")).toEqual(false);
        expect(Version.compareVersion("1.6.8", "1.11.8")).toEqual(false);
        expect(Version.compareVersion("1", "1")).toEqual(true);
        expect(Version.compareVersion("2", "1")).toEqual(true);
        expect(Version.compareVersion("2", "1.1.2")).toEqual(true);
        expect(Version.compareVersion("2.1.1", "1.1.2")).toEqual(true);
        expect(Version.compareVersion("1.11.8", "1.6.8")).toEqual(true);
    });

});
