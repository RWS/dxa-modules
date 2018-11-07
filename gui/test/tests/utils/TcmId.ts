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

import { TcmId as TcmIdUtils } from "utils/TcmId";
import { CdItemTypes, TaxonomyItemId } from "interfaces/TcmId";

describe(`TcmId utils tests.`, (): void => {

    it("checks if page is valid", (): void => {
        expect(TcmIdUtils.isValidPageId("999")).toBeTruthy();
        expect(TcmIdUtils.isValidPageId("999,9")).toBeFalsy();
        expect(TcmIdUtils.isValidPageId("999.9")).toBeFalsy();
        expect(TcmIdUtils.isValidPageId("ish:123-54-16")).toBeFalsy();
        expect(TcmIdUtils.isValidPageId(undefined)).toBeFalsy();
    });

    it("returns a taxonomy item id from a sitemap id", (): void => {
        const sitemapId = "54";
        expect(TcmIdUtils.getTaxonomyItemId(TaxonomyItemId.Index, sitemapId)).toBe(`t${TaxonomyItemId.Index}-k54`);
        const sitemapIdTcmFormat = "ish:123-54-1024";
        expect(TcmIdUtils.getTaxonomyItemId(TaxonomyItemId.Toc, sitemapIdTcmFormat)).toBe(`t${TaxonomyItemId.Toc}-k54`);
    });

    it("returns a taxonomy item id from a taxonomy id", (): void => {
        const taxonomyId = "ish:123-54-512";
        const taxonomyItemId = TcmIdUtils.getTaxonomyItemId(TaxonomyItemId.Toc, taxonomyId);
        expect(taxonomyItemId).toBe(`t${TaxonomyItemId.Toc}`);
    });

    it("returns empty result when getting a taxonomy item id using an invalid sitemap id", (): void => {
        const sitemapId = "invalid-id";
        const taxonomyId = TcmIdUtils.getTaxonomyItemId(TaxonomyItemId.Index, sitemapId);
        expect(taxonomyId).toBeUndefined();
    });

    it("returns a taxonomy id when not specifying a sitemap id", (): void => {
        const taxonomyId = TcmIdUtils.getTaxonomyItemId(TaxonomyItemId.Index);
        expect(taxonomyId).toBe(`t${TaxonomyItemId.Index}`);
    });

    it("returns an item id from a taxonomy item id", (): void => {
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
