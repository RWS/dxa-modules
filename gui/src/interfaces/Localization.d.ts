declare module Sdl.DitaDelivery {

    /**
     * Localization instance
     */
    // tslint:disable-next-line:no-unused-variable
    var Localization: ILocalization;

    /**
     * Localization implementation
     */
    interface ILocalization {

        /**
         * Format a message
         *
         * @static
         * @param {string} path Resource path
         * @param {string[]} [variables] Variables
         * @returns {string}
         */
        formatMessage(path: string, variables?: string[]): string;
    }
}
