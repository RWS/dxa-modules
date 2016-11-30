import { ILocalizationService } from "services/interfaces/LocalizationService";

/**
 * Localization implemented for usage on the server
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
        return path;
    }
}

export let localization = new LocalizationService();
