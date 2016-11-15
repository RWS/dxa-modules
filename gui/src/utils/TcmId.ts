/**
 * Regex to parse tcm uri
 * Format is {namespace}:{publication}-{id}-{itemType}
 */
const TCM_ID_FORMAT_REGEX = /^([^\/]+):([0-9]+)-([0-9]+)-([0-9]+)$/i;

enum CDItemTypes {
    Publication = 1,
    Component = 16,
    Category = 512,
    Taxonomy = 1024
}

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
     * @param {string} id Id to validate
     * @returns {boolean}
     *
     * @memberOf TcmId
     */
    public static isValid(id: string): boolean {
        return !!id.match(TCM_ID_FORMAT_REGEX);
    }

    /**
     * Get the taxonomy id from a publication id
     *
     * @static
     * @param {string} publicationId Publication id
     * @returns {string | undefined}
     *
     * @memberOf TcmUri
     */
    public static getTaxonomyId(publicationId: string): string | undefined {
        const match = publicationId.match(TCM_ID_FORMAT_REGEX);
        if (match) {
            return `${match[1]}:${match[2]}-1-${CDItemTypes.Category}`;
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

}
