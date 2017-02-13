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
     *
     * @returns {string}
     *
     * @memberOf ILocalizationService
     */
    getDirection(): string;
}
