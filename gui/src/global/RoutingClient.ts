/// <reference path="../../typings/index.d.ts" />
/// <reference path="../interfaces/Routing.d.ts" />

module Sdl.DitaDelivery {
    const HistoryModule = (<Window & { History: HistoryModule.Module }>window).History;

    /**
     * Routing related functionality
     *
     * @export
     * @class Routing
     */
    export class RoutingClient implements IRouting {

        private static _history: HistoryModule.History = HistoryModule.createMemoryHistory();

        /**
         * Get the current location
         *
         * @returns {string}
         */
        public getCurrentLocation(): string {
            return RoutingClient._history.getCurrentLocation().search;
        }
    }

}
