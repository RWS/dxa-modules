import { TcmId as TcmIdUtils } from "utils/TcmId";
import { CdItemTypes } from "interfaces/TcmId";

describe(`TcmId utils tests.`, (): void => {

    it("checks if page is valid", (): void => {
        expect(TcmIdUtils.isValidPageId("999")).toBeTruthy();
        expect(TcmIdUtils.isValidPageId("999,9")).toBeFalsy();
        expect(TcmIdUtils.isValidPageId("999.9")).toBeFalsy();
        expect(TcmIdUtils.isValidPageId("ish:123-54-16")).toBeFalsy();
        expect(TcmIdUtils.isValidPageId(undefined)).toBeFalsy();
    });

    it("returns a taxonomy item id from a page id", (): void => {
        const pageId = "54";
        expect(TcmIdUtils.getTaxonomyItemId("999", pageId)).toBe("t999-p54");
        const pageIdTcmFormat = "ish:123-54-16";
        expect(TcmIdUtils.getTaxonomyItemId("999", pageIdTcmFormat)).toBe("t999-p54");
    });

    it("returns a taxonomy item id from a taxonomy id", (): void => {
        const taxonomyId = "ish:123-54-512";
        const taxonomyItemId = TcmIdUtils.getTaxonomyItemId("999", taxonomyId);
        expect(taxonomyItemId).toBe("t999");
    });

    it("returns empty result when getting a taxonomy item id using an invalid page id", (): void => {
        const pageId = "invalid-id";
        const taxonomyId = TcmIdUtils.getTaxonomyItemId("999", pageId);
        expect(taxonomyId).toBeUndefined();
    });

    it("returns an item id from a taxonomy item id", (): void => {
        const taxonomyItemIdPage = "t264-p564";
        const itemIdPage = TcmIdUtils.getItemIdFromTaxonomyItemId(taxonomyItemIdPage);
        expect(itemIdPage).toBe("564");
        const taxonomyItemIdKeyword = "t254645-k48787";
        const itemIdKeyword = TcmIdUtils.getItemIdFromTaxonomyItemId(taxonomyItemIdKeyword);
        expect(itemIdKeyword).toBe("48787");
    });

    it("returns empty result when getting an item id using an invalid taxonomy item id", (): void => {
        const taxonomyItemId = "invalid-id";
        const itemId = TcmIdUtils.getItemIdFromTaxonomyItemId(taxonomyItemId);
        expect(itemId).toBeUndefined();
        expect(TcmIdUtils.getItemIdFromTaxonomyItemId(undefined)).toBeUndefined();
    });

    it("returns parsed id for a valid tcm id", (): void => {
        const tcmId = "ns:123-54-16";
        const parsedId = TcmIdUtils.parseId(tcmId);
        expect(parsedId).toBeDefined();
        if (parsedId) {
            expect(parsedId.namespace).toBe("ns");
            expect(parsedId.publicationId).toBe("123");
            expect(parsedId.itemId).toBe("54");
            expect(parsedId.itemType).toBe(CdItemTypes.Component);
        }
    });

    it("returns empty result for an invalid tcm id", (): void => {
        const tcmId = "invalid-id";
        const parsedId = TcmIdUtils.parseId(tcmId);
        expect(parsedId).toBeUndefined();
        expect(TcmIdUtils.parseId(undefined)).toBeUndefined();
    });
});
