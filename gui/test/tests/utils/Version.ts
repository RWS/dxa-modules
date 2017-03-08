import Version from "utils/Version";

describe(`Version tests.`, (): void => {

    it("sorts product release version correctly", (): void => {
        const sortedProductReleaseVersions = Version.sortProductReleaseVersions([])
        expect(sortedProductReleaseVersions).toBe([]);
    });

});
