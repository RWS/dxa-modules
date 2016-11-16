import { TcmId as TcmIdUtils } from "../../../src/utils/TcmId";

describe(`TcmId utils tests.`, (): void => {

    it("returns a taxonomy item id from a page id", (): void => {
        const pageId = "ish:123-54-16";
        const taxonomyId = TcmIdUtils.getTaxonomyItemId("999", pageId);
        expect(taxonomyId).toBe("t999-p54");
    });

    it("returns a taxonomy item id from a taxonomy id", (): void => {
        const pageId = "ish:123-54-512";
        const taxonomyId = TcmIdUtils.getTaxonomyItemId("999", pageId);
        expect(taxonomyId).toBe("t999");
    });

    it("returns empty result when getting a taxonomy item id using an invalid page id", (): void => {
        const pageId = "invalid-id";
        const taxonomyId = TcmIdUtils.getTaxonomyItemId("999", pageId);
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
