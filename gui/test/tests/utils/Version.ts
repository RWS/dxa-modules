import Version from "utils/Version";
import { IPublication } from "interfaces/Publication";

describe(`Version tests.`, (): void => {
    const createPublication = (id: string = "0") => ({
        id,
        title: `Title - ${id}`,
        createdOn: new Date(),
        version: "1",
        logicalId: `GUID- ${id}`
    });

    describe(`Product release version.`, (): void => {
        // Sorting sequance of Product Release versions is follwing
        //
        // 1. Sorts by versions defined in release version titles
        // 2. Sorts by publications versions
        // 3. Sorts by publications created on
        // 4. Sorts by most occurances
        // 5. Sorts by Title

        it("sorts by release versions in titles", (): void => {
            let id = 0;
            const getPub = (version: string) => ({
                ...createPublication((++id).toString()),
                productReleaseVersion: [`${version} (${version})`]
            });

            const releaseVersions = Version.sortProductReleaseVersions([
                getPub("18.2.44"),
                getPub("1.18"),
                getPub("5")
            ]);
            expect(releaseVersions).toEqual(["1.18", "5", "18.2.44"]);
        });

        it("Sorts by publications versions", (): void => {
            let id = 0;
            const getPub = (version: string) => ({
                ...createPublication((++id).toString()),
                version,
                productReleaseVersion: [version]
            });

            const releaseVersions = Version.sortProductReleaseVersions([getPub("11"), getPub("19"), getPub("5")]);
            expect(releaseVersions).toEqual(["19", "11", "5"]);
        });

        it("Sorts by created on", (): void => {
            let id = 0;
            const today = new Date();
            const getPub = (createdOnYear: number) => ({
                ...createPublication((++id).toString()),
                createdOn: new Date(today.setFullYear(createdOnYear)),
                productReleaseVersion: [`${createdOnYear}`]
            });

            const releaseVersions = Version.sortProductReleaseVersions([getPub(1991), getPub(2024), getPub(1985)]);
            expect(releaseVersions).toEqual(["2024", "1991", "1985"]);
        });

        it("Sorts by most occurrences", (): void => {
            let id = 0;
            const getPub = (version: string) => ({
                ...createPublication((++id).toString()),
                productReleaseVersion: [`${version}`]
            });

            const releaseVersions = Version.sortProductReleaseVersions([
                getPub("1"),
                getPub("42"),
                getPub("5"),
                getPub("42"),
                getPub("1"),
                getPub("42")
            ]);
            expect(releaseVersions).toEqual(["42", "1", "5"]);
        });

        it("Sorts by version title", (): void => {
            let id = 0;
            const getPub = (version: string) => ({
                ...createPublication((++id).toString()),
                productReleaseVersion: [`${version}`]
            });

            const releaseVersions = Version.sortProductReleaseVersions([
                getPub("AZ Version"),
                getPub("Z Version"),
                getPub("A Version")
            ]);
            expect(releaseVersions).toEqual(["A Version", "AZ Version", "Z Version"]);
        });

        it("Keeps sorting priorities", (): void => {
            let id = 0;
            const today = new Date();
            //const releaseVersions = Version.sortProductReleaseVersions([
            const publications = [
                {
                    ...createPublication((++id).toString()),
                    version: "1",
                    productReleaseVersion: ["PRV v1"]
                },
                {
                    ...createPublication((++id).toString()),
                    version: "27",
                    productReleaseVersion: ["PRV v27"]
                },
                {
                    ...createPublication((++id).toString()),
                    version: "4",
                    createdOn: new Date(today.setFullYear(2011)),
                    productReleaseVersion: ["PRV v4 2011"]
                },
                {
                    ...createPublication((++id).toString()),
                    version: "4",
                    createdOn: new Date(today.setFullYear(2011)),
                    productReleaseVersion: ["Z PRV v4 2011"]
                },
                {
                    ...createPublication((++id).toString()),
                    version: "4",
                    createdOn: new Date(today.setFullYear(2021)),
                    productReleaseVersion: ["PRV v4 2021"]
                },
                // Five similar publications to check count of occurance
                ...new Array(5).fill(null).map(
                    n =>
                        ({
                            ...createPublication((++id).toString()),
                            version: "4",
                            createdOn: new Date(today.setFullYear(2011)),
                            productReleaseVersion: ["PRV v4 2011"]
                        } as IPublication)
                ),
                // End of two similar publications
                {
                    ...createPublication((++id).toString()),
                    productReleaseVersion: null
                },
                {
                    ...createPublication((++id).toString()),
                    version: "4",
                    createdOn: new Date(today.setFullYear(2011)),
                    productReleaseVersion: ["A PRV v4 2011"]
                },
                {
                    ...createPublication((++id).toString()),
                    version: "7",
                    productReleaseVersion: ["PRV v7(1.5.42)"]
                }
            ];
            const releaseVersions = Version.sortProductReleaseVersions(publications);

            expect(releaseVersions).toEqual([
                "PRV v7", // Has version with release in braces
                "PRV v27", // Has the highest publicaition version
                "PRV v4 2021", // Has the freshiest publication created on date
                "PRV v4 2011", // Has the most occurances
                "A PRV v4 2011", // Product family title sorting
                "Z PRV v4 2011",
                "PRV v1", // Has the lowes publication version
                null
            ]);
        });
    });

    describe(`Product families.`, (): void => {
        // Sorting sequance of Product Families
        //
        // 1. Sorts by versions defined in Families titles
        // 2. Sorts by Product Families occurance
        // 3. Sorts by Product Families titles

        it("Sorts by versions defined in Families titles", (): void => {
            let id = 0;
            const getPub = (family: string) => ({
                ...createPublication((++id).toString()),
                productFamily: [`${family} (${family})`]
            });

            const families = Version.sortProductFamilyVersions([getPub("18.2.44"), getPub("1.18"), getPub("5")]);
            expect(families).toEqual(["1.18", "5", "18.2.44"]);
        });

        it("Sorts by Product Families occurance", (): void => {
            let id = 0;
            const getPub = (family: string) => ({
                ...createPublication((++id).toString()),
                productFamily: [`${family}`]
            });

            const families = Version.sortProductFamilyVersions([
                getPub("3"),
                getPub("2"),
                getPub("2"),
                getPub("3"),
                getPub("1"),
                getPub("3")
            ]);
            expect(families).toEqual(["3", "2", "1"]);
        });

        it("Sorts by Product Families titles", (): void => {
            let id = 0;
            const getPub = (version: string) => ({
                ...createPublication((++id).toString()),
                productFamily: [`${version}`]
            });

            const families = Version.sortProductFamilyVersions([
                getPub("A Family"),
                getPub("Family AZ "),
                createPublication("42"),
                getPub("Family Z"),
                getPub("Family A")
            ]);
            expect(families).toEqual(["A Family", "Family A", "Family AZ", "Family Z", null]);
        });

        it("Keeps sorting priorities", (): void => {
            let id = 0;
            const getPub = (version: string | null) => ({
                ...createPublication((++id).toString()),
                productFamily: [`${version}`]
            });

            const families = Version.sortProductFamilyVersions([
                createPublication("42"),
                getPub("A Family"),
                getPub("Family P123 (1.2.3)"),
                getPub("Family A321 (3.2.1)"),
                getPub("Family Q"),
                getPub("Family Y"),
                getPub("Family Y")
            ]);
            expect(families).toEqual([
                "Family P123",
                "Family A321",
                "Family Y",
                "A Family",
                "Family Q",
                null
            ]);
        });
    });

    it("compares versions correctly", (): void => {
        // Version is lower
        expect(Version.compareVersion("1", "2")).toEqual(-1);
        expect(Version.compareVersion("1.1.1", "2")).toEqual(-1);
        expect(Version.compareVersion("1.6.8", "1.11.8")).toEqual(-1);
        expect(Version.compareVersion("1.1.1.1.2", "2")).toEqual(-1);
        expect(Version.compareVersion("1.1.1.1.2", "1.1.2")).toEqual(-1);

        // Version is greater
        expect(Version.compareVersion("2", "1")).toEqual(1);
        expect(Version.compareVersion("2", "1.1.2")).toEqual(1);
        expect(Version.compareVersion("2.1.1", "1.1.2")).toEqual(1);
        expect(Version.compareVersion("1.11.8", "1.6.8")).toEqual(1);

        // Versions are equal
        expect(Version.compareVersion("1", "1")).toEqual(0);
        expect(Version.compareVersion("1.11.8", "1.11.8")).toEqual(0);
    });
});
