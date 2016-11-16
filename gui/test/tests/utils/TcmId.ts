import { TcmId as TcmIdUtils } from "utils/TcmId";

describe(`TcmId utils tests.`, (): void => {

    it("get a taxonomy id from a page id", (): void => {
        const pageId = "ish:123-54-16";
        const taxonomyId = TcmIdUtils.getTaxonomyId(pageId);
        expect(taxonomyId).toBe("ish:123-1-512");
    });

    it("returns empty result when getting a taxonomy id using an invalid page id", (): void => {
        const pageId = "invalid-id";
        const taxonomyId = TcmIdUtils.getTaxonomyId(pageId);
        expect(taxonomyId).toBeUndefined();
    });

    it("removes a namespace from an id", (): void => {
        const pageId = "ish:123-54-16";
        const withoutNamespace = TcmIdUtils.removeNamespace(pageId);
        expect(withoutNamespace).toBe("123-54-16");
    });

    it("returns same id when removing namespace of an invalid id", (): void => {
        const pageId = "invalid-id";
        const withoutNamespace = TcmIdUtils.removeNamespace(pageId);
        expect(withoutNamespace).toBe(pageId);
    });

});
