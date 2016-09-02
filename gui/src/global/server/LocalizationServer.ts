/// <reference path="../../../typings/index.d.ts" />
/// <reference path="../../interfaces/Localization.d.ts" />

module Sdl.DitaDelivery {

    /**
     * Localization implemented for usage on the server
     *
     * @export
     * @class LocalizationServer
     * @implements {ILocalization}
     */
    export class LocalizationServer implements ILocalization {

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

}
