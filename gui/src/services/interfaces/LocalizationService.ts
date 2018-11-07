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
