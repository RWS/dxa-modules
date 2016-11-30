import { ILocalizationService } from "services/interfaces/LocalizationService";

/**
 * Localization implemented using Globalize
 *
 * @export
 * @class LocalizationGlobalize
 * @implements {ILocalizationService}
 */
export class LocalizationGlobalize implements ILocalizationService {

    private static _globalize: SDL.SDLGlobalizeStatic = SDL.Globalize;

    /**
     * Format a message
     *
     * @param {string} path Resource path
     * @param {string[]} [variables] Variables
     * @returns {string}
     */
    public formatMessage(path: string, variables?: string[]): string {
        return LocalizationGlobalize._globalize.formatMessage(path, variables);
    }
}

export let localization = new LocalizationGlobalize();
