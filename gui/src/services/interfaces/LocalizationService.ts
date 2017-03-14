/**
 * Localization service
 */
export interface ILocalizationService {

    /**
     * Format a message
     *
     * @static
     * @param {string} path Resource path
     * @param {string[]} [variables] Variables
     * @returns {string}
     */
    formatMessage(path: string, variables?: string[]): string;

    /**
     *
     * @param {string} lang
     * @returns {("rtl" | "ltr")}
     *
     * @memberOf ILocalizationService
     */
    getDirection(lang: string): "rtl" | "ltr";
}
