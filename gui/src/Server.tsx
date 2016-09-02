/// <reference path="../typings/index.d.ts" />
/// <reference path="interfaces/DataStore.d.ts" />
/// <reference path="interfaces/Localization.d.ts" />
/// <reference path="global/server/LocalizationServer.ts" />
/// <reference path="global/server/DataStoreServer.ts" />
/// <reference path="global/server/RoutingServer.ts" />
/// <reference path="components/container/App.tsx" />

import App = Sdl.DitaDelivery.Components.App;

/**
 * Render the application to a string.
 *
 * @param {string} path Current path in the application. Used for deep linking.
 * @returns {string}
 */
// tslint:disable-next-line:no-unused-variable
function renderToString(path: string): string {
    /**
     * Set instances for data store / localization / routing
     */
    Sdl.DitaDelivery.DataStore = new Sdl.DitaDelivery.DataStoreServer();
    Sdl.DitaDelivery.Localization = new Sdl.DitaDelivery.LocalizationServer();
    Sdl.DitaDelivery.Routing = new Sdl.DitaDelivery.RoutingServer();

    return ReactDOMServer.renderToString(<App />);
};
