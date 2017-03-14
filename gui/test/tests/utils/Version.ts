import Version from "utils/Version";
import { IPublication } from "interfaces/Publication";

describe(`Version tests.`, (): void => {

    it("sorts product release version correctly", (): void => {
        const defaultPub = {
            id: "1",
            title: "Title1",
            createdOn: new Date()
        };
        const publications: IPublication[] = [
            /**
             * With version number between braces at the end
             */
            {
                ...defaultPub,
                productFamily: "PF1",
                productReleaseVersion: "PR (1.0.0)"
            },
            {
                ...defaultPub,
                productFamily: "PF1",
                productReleaseVersion: "PR (2.0.0)"
            },
            {
                ...defaultPub,
                productFamily: "PF1",
                productReleaseVersion: "PR (1.2.0)"
            },
            {
                ...defaultPub,
                productFamily: "PF1",
                productReleaseVersion: "PR (1.0.2)"
            },
            /**
             * Different product families
             */
            {
                ...defaultPub,
                productFamily: "PF2",
                productReleaseVersion: "PR2.1"
            },
            {
                ...defaultPub,
                productFamily: "PF3",
                productReleaseVersion: "PR3.1"
            },
            {
                ...defaultPub,
                productFamily: "PF4",
                productReleaseVersion: "PR4.1"
            },
            {
                ...defaultPub,
                productFamily: "PF5",
                productReleaseVersion: "PR5.1"
            },
            /**
             * Different product release versions
             * With created on
             */
            {
                ...defaultPub,
                productFamily: "SDL Web",
                productReleaseVersion: "Web 8",
                createdOn: new Date(new Date().setFullYear(2012))
            },
            {
                ...defaultPub,
                productFamily: "SDL Web",
                productReleaseVersion: "Tridion 98",
                createdOn: new Date(new Date().setFullYear(1998))
            },
            {
                ...defaultPub,
                productFamily: "SDL Web",
                productReleaseVersion: "Tridion 2013SP1",
                createdOn: new Date(new Date().setFullYear(2013))
            },
            {
                ...defaultPub,
                productFamily: "SDL Web",
                productReleaseVersion: "Tridion 2015",
                createdOn: new Date(new Date().setFullYear(2015))
            },
            /**
             * Uncategorized, unknown
             */
            {
                ...defaultPub,
                productFamily: null,
                productReleaseVersion: null
            },
            {
                ...defaultPub,
                productFamily: "PF7",
                productReleaseVersion: "v1"
            },
            {
                ...defaultPub,
                productFamily: "PF7",
                productReleaseVersion: null
            }
        ];
        expect(Version.sortProductReleaseVersions("PF1", publications)).toEqual(["PR (2.0.0)", "PR (1.2.0)", "PR (1.0.2)", "PR (1.0.0)"]);
        expect(Version.sortProductReleaseVersions("PF2", publications)).toEqual(["PR2.1"]);
        expect(Version.sortProductReleaseVersions("PF3", publications)).toEqual(["PR3.1"]);
        expect(Version.sortProductReleaseVersions("PF4", publications)).toEqual(["PR4.1"]);
        expect(Version.sortProductReleaseVersions("PF5", publications)).toEqual(["PR1"]);
        expect(Version.sortProductReleaseVersions("SDL Web", publications)).toEqual(["Web 8", "Tridion 2015", "Tridion 2013SP1", "Tridion 98"]);
        expect(Version.sortProductReleaseVersions("PF7", publications)).toEqual(["v1", null]);
        expect(Version.sortProductReleaseVersions(null, publications)).toEqual([null]);
    });

});
