import { String } from "sdl-models";
import { ILocalizationService } from "services/interfaces/LocalizationService";
const resources = require("resources/resources.default") as { [path: string]: string };

/**
 * Localization service
 *
 * @export
 * @class LocalizationService
 * @implements {ILocalizationService}
 */
export class LocalizationService implements ILocalizationService {

    /**
     *
     * @type {string[]}
     * @memberOf LocalizationService
     */
    public rtlLanguages: string[] = ["ar", "he", "ur"];

    /**
     * Format a message
     *
     * @param {string} path Resource path
     * @param {string[]} [variables] Variables
     * @returns {string}
     */
    public formatMessage(path: string, variables?: string[]): string {
        const resource = resources[path];
        // TODO: if we have localization we should fall back to the default resources if a translation cannot be found
        // Eg when resource is not availble in nl use the one inside the default resource file
        if (resource) {
            if (Array.isArray(variables)) {
                return String.format(resource, variables);
            } else {
                return resource;
            }
        }
        return `Unable to localize: ${path}`;
    }

    /**
     *
     * @param {string} lang
     * @returns {("rtl" | "ltr")}
     *
     * @memberOf LocalizationService
     */
    public getDirection(lang: string): "rtl" | "ltr" {
        return this.rtlLanguages.some((val: string) => val === lang) ? "rtl" : "ltr";
    }
}

export let localization = new LocalizationService();
