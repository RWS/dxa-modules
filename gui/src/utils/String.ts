
/**
 * Maximum characters for a string
 */
const STR_MAX_CHARS = 250;

/**
 * Truncate ending
 */
const TRUNCATE_ENDING = "...";

/**
 * String helper methods
 *
 * @export
 * @class String
 */
export class String {

    /**
     * Truncates string with number of chars
     *
     * @static
     * @param {string} str String to truncate
     * @param {number} atChar Chars count to truncate to
     * @param {string} string truncate ending string
     * @returns { string }
     *
     * @memberOf String
     */
    public static truncate(str: string, atChar: number = STR_MAX_CHARS, ending: string = TRUNCATE_ENDING): string {
        if (str.length > atChar) {
            str = str.substr(0, atChar);
            atChar = str.lastIndexOf(" ");
            str = ((atChar > 0) ? str.substr(0, atChar) : str) + ending;
        }
        return str;
    }

    /**
     * Trim and normalize string to lowercase
     *
     * @static
     * @param {string} str String to modify
     * @returns {string}
     *
     * @memberOf String
     */
    public static normalize(str: string): string {
        return str ? str.toLowerCase().trim() : "";
    }
}
