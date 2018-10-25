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

    /**
     *
     * @param {string} lang
     * @returns {("rtl" | "ltr")}
     *
     * @memberOf ILocalizationService
     */
    getDirection(lang: string): "rtl" | "ltr";

    /**
     * Return current language
     *
     * @returns {string}
     * @memberof ILocalizationService
     */
    getLanguage(): string;

    /**
     * Get pretty name by iso code
     *
     * @param {string} iso
     * @returns {string}
     * @memberof ILocalizationService
     */
    isoToName(iso: string): string;
}
