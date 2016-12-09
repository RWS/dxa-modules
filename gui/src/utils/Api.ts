/**
 * Utilities for generating api urls
 */

import { path } from "utils/Path";
import { IWindow } from "interfaces/Window";

const mocksEnabled: boolean = (window as IWindow).SdlDitaDeliveryMocksEnabled || false;

/**
 * Get navigation links urls
 * Use this url to get the path of a taxonomy item in the toc
 *
 * @export
 * @param {string} publicationId Publication id
 * @param {string} taxonomyId Taxonomy id
 * @returns {string}
 */
export function getNavigationLinksUrl(publicationId: string, taxonomyId: string): string {
     /* istanbul ignore else */
    if (mocksEnabled) {
        return path.getAbsolutePath(`gui/mocks/navigation-${publicationId}-${taxonomyId}.json`);
    } else {
        // TODO: use real end point
        return path.getAbsolutePath(`gui/mocks/navigation-${publicationId}-${taxonomyId}.json`);
    }
}

/**
 * Get page url
 * Use this url to retrieve contents / metadata for a page
 *
 * @export
 * @param {string} publicationId Publication id
 * @param {string} pageId Page id
 * @returns {string}
 */
export function getPageUrl(publicationId: string, pageId: string): string {
    /* istanbul ignore else */
    if (mocksEnabled) {
        return path.getAbsolutePath(`gui/mocks/page-${publicationId}-${pageId}.json`);
    } else {
        // TODO: use real end point
        return path.getAbsolutePath(`gui/mocks/page-${publicationId}-${pageId}.json`);
    }
}

/**
 * Get publications url
 * Use this url to retrieve all publications and their metadata
 *
 * @export
 * @returns {string}
 */
export function getPublicationsUrl(): string {
    /* istanbul ignore else */
    if (mocksEnabled) {
        return path.getAbsolutePath(`gui/mocks/publications.json`);
    } else {
        // TODO: use real end point
        return path.getAbsolutePath(`gui/mocks/publications.json`);
    }
}

/**
 * Get toc items url
 * Use this url to retrieve all childs items of a table of contents item
 *
 * @export
 * @param {string} publicationId Publication id
 * @param {string} parentId Parent id
 * @returns {string}
 */
export function getTocItemsUrl(publicationId: string, parentId: string): string {
    /* istanbul ignore else */
    if (mocksEnabled) {
        return path.getAbsolutePath(`gui/mocks/toc-${publicationId}-${parentId}.json`);
    } else {
        // TODO: use real end point
        return path.getAbsolutePath(`gui/mocks/toc-${publicationId}-${parentId}.json`);
    }
}
