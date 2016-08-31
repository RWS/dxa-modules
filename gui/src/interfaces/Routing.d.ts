declare module Sdl.DitaDelivery {

    /**
     * Routing instance
     */
    // tslint:disable-next-line:no-unused-variable
    var Routing: IRouting;

    /**
     * Routing implementation
     */
    interface IRouting {

        /**
         * Get the current location
         *
         * @returns {string}
         */
        getCurrentLocation(): string;
    }
}
