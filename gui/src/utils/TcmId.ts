import { CdItemTypes, ITcmId as TcmIdModel, TaxonomyItemId } from "interfaces/TcmId";

/**
 * Regex to parse tcm uri
 * Format is {namespace}:{publicationId}-{itemId}-{itemType}
 */
const TCM_ID_FORMAT_REGEX = /^([^\/]+):([0-9]+)-([0-9]+)-([0-9]+)$/i;
/**
 * Regext to parse a taxonomy id used by the taxonomy api
 * Format is t{taxonomyId}-k{keywordId}
 */
const TAXONOMY_ID_FORMAT_REGEX = /^t([0-9]+)-k([0-9]+)$/i;

/**
 * Tcm Id helper methods
 *
 * @export
 * @class TcmId
 */
export class TcmId {

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
            return !isNaN(TcmId.parseInt(id));
        }
        return false;
    }

    /**
     * Get the taxonomy item id
     *
     * @static
     * @param {TaxonomyItemId} taxonomyItemId Taxonomy item id
     * @param {string} [id] Tcm id
     * @returns {string | undefined}
     *
     * @memberOf TcmUri
     */
    public static getTaxonomyItemId(taxonomyItemId: TaxonomyItemId, id?: string): string | undefined {
        if (id) {
            const match = id.match(TCM_ID_FORMAT_REGEX);
            if (match) {
                if (match[4] === CdItemTypes.Category.toString()) {
                    return `t${taxonomyItemId}`;
                }
                return `t${taxonomyItemId}-k${match[3]}`;
            }
            const isNumber = !isNaN(TcmId.parseInt(id));
            if (isNumber) {
                return `t${taxonomyItemId}-k${id}`;
            }
        } else {
            return `t${taxonomyItemId}`;
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
                    itemType: TcmId.parseInt(match[4])
                };
            }
        }
        return undefined;
    }

    /**
     * Get the item id (page or keyword) from a taxonomy item id
     *
     * @static
     * @param {string | undefined} taxonomyItemId Taxonomy item id
     * @returns {(string | undefined)}
     *
     * @memberOf TcmId
     */
    public static getItemIdFromTaxonomyItemId(taxonomyItemId: string | undefined): string | undefined {
        if (typeof taxonomyItemId === "string") {
            const match = taxonomyItemId.match(TAXONOMY_ID_FORMAT_REGEX);
            if (match) {
                return match[2];
            }
        }
        return undefined;
    }

    private static parseInt(value: string): number {
        if (/^(\-|\+)?([0-9]+|Infinity)$/.test(value)) {
            return Number(value);
        }
        return NaN;
    }

}
