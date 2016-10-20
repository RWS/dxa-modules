import { ILocalization } from "../../interfaces/Localization";

/**
 * Localization implemented using Globalize
 *
 * @export
 * @class LocalizationGlobalize
 * @implements {ILocalization}
 */
export class LocalizationGlobalize implements ILocalization {

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
