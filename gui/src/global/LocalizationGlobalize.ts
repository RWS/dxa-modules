/// <reference path="../../typings/index.d.ts" />
/// <reference path="../interfaces/Localization.d.ts" />

module Sdl.DitaDelivery {

    /**
     * Localization implemented using Globalize
     *
     * @export
     * @class Localization
     * @implements {ILocalization}
     */
    export class LocalizationGlobalize implements ILocalization {

        private static _globalize: SDL.SDLGlobalizeStatic = SDL.Globalize;

        /**
         * Format a message
         *
         * @static
         * @param {string} path Resource path
         * @param {string[]} [variables] Variables
         * @returns {string}
         */
        public formatMessage(path: string, variables?: string[]): string {
            return LocalizationGlobalize._globalize.formatMessage(path, variables);
        }
    }

}
