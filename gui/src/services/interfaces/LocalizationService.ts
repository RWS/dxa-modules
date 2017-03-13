/**
 * Language
 */
export interface ILanguage {
	/**
	 * Language name written in its native form
	 *
	 * @type {string}
	 * @memberOf ILanguage
	 */
    name: string;

    /**
     * ISO 639-1 language code
     * @type {string}
     */
    iso: string;
}

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
     * Get list of all languages
     *
     * @returns {ILanguage[]}
     */
    getLanguages(): ILanguage[];
}