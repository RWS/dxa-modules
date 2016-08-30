/// <reference path="../typings/index.d.ts" />

module Sdl.DitaDelivery {
    const HistoryModule = (<Window & { History: HistoryModule.Module }>window).History;

    /**
     * Routing related functionality
     *
     * @export
     * @class Routing
     */
    export class Routing {

        private static _history: HistoryModule.History & {
            getCurrentLocation: () => HistoryModule.Location
        } = HistoryModule.createMemoryHistory() as HistoryModule.History & {
            getCurrentLocation: () => HistoryModule.Location
        };

        /**
         * Get the current location
         *
         * @static
         * @returns {HistoryModule.Location}
         */
        public static getCurrentLocation(): HistoryModule.Location {
            return Routing._history.getCurrentLocation();
        }
    }

}
