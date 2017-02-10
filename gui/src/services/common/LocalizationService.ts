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

    // This is interim method
    // Implement it in the multi language story
    public getDirection(): string {
        return "rtl";
    }
}

export let localization = new LocalizationService();
