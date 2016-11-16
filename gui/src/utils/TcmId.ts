import { CdItemTypes, TcmId as TcmIdModel } from "../interfaces/TcmId";

/**
 * Regex to parse tcm uri
 * Format is {namespace}:{publicationId}-{itemId}-{itemType}
 */
const TCM_ID_FORMAT_REGEX = /^([^\/]+):([0-9]+)-([0-9]+)-([0-9]+)$/i;
/**
 * Regext to parse a taxonomy id used by the taxonomy api
 * Format is t{taxonomyId}-p{pageId} or t{taxonomyId}-k{keywordId}
 */
const TAXONOMY_ID_FORMAT_REGEX = /^t([0-9]+)-(p|k)([0-9]+)$/i;

/**
 * Tcm Id helper methods
 *
 * @export
 * @class TcmId
 */
export class TcmId {

    /**
     * Validates if an id has a valid format
     *
     * @static
     * @param {string | null | undefined} id Id to validate
     * @returns {boolean}
     *
     * @memberOf TcmId
     */
    public static isValid(id: string | null | undefined): boolean {
        if (typeof id === "string") {
            return !!id.match(TCM_ID_FORMAT_REGEX);
        }
        return false;
    }

    /**
     * Validates if a page id is valid
     *
     * @static
     * @param {string | null | undefined} id Id to validate
     * @returns {boolean}
     *
     * @memberOf TcmId
     */
    public static isValidPageId(id: string | null | undefined): boolean {
        if (typeof id === "string") {
            return !isNaN(parseInt(id, 10));
        }
        return false;
    }

    /**
     * Get the taxonomy item id
     *
     * @static
     * @param {string} taxonomyId Taxonomy id
     * @param {string} id Tcm id
     * @returns {string | undefined}
     *
     * @memberOf TcmUri
     */
    public static getTaxonomyItemId(taxonomyId: string, id: string): string | undefined {
        const match = id.match(TCM_ID_FORMAT_REGEX);
        if (match) {
            if (match[4] === CdItemTypes.Category.toString()) {
                return `t${taxonomyId}`;
            }
            return `t${taxonomyId}-p${match[3]}`;
        }
        const isNumber = !isNaN(parseInt(id, 10));
        if (isNumber) {
            return `t${taxonomyId}-p${id}`;
        }
        return undefined;
    }

    /**
     * Parse a tcm id
     *
     * @static
     * @param {string | undefined} id Tcm id
     * @returns {TcmIdModel | undefined}
     *
     * @memberOf TcmUri
     */
    public static parseId(id: string | undefined): TcmIdModel | undefined {
        if (typeof id === "string") {
            const match = id.match(TCM_ID_FORMAT_REGEX);
            if (match) {
                return {
                    namespace: match[1],
                    publicationId: match[2],
                    itemId: match[3],
                    itemType: parseInt(match[4], 10)
                };
            }
        }
        return undefined;
    }

    /**
     * Remove a namespace from an id
     * Eg "ish:123-1-1" becomes "123-1-1"
     *
     * @static
     * @param {string} id Id to remove the namespace form
     * @returns {string}
     *
     * @memberOf TcmUri
     */
    public static removeNamespace(id: string): string {
        const match = id.match(TCM_ID_FORMAT_REGEX);
        if (match) {
            return `${match[2]}-${match[3]}-${match[4]}`;
        }
        return id;
    }

    /**
     * Get the item id (page or keyword) from a taxonomy id
     *
     * @static
     * @param {string | undefined} taxonomyId Taxonomy id
     * @returns {(string | undefined)}
     *
     * @memberOf TcmId
     */
    public static getItemIdFromTaxonomyId(taxonomyId: string | undefined): string | undefined {
        if (typeof taxonomyId === "string") {
            const match = taxonomyId.match(TAXONOMY_ID_FORMAT_REGEX);
            if (match) {
                return match[2];
            }
        }
        return undefined;
    }

}
