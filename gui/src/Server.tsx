/// <reference path="../typings/index.d.ts" />
/// <reference path="interfaces/DataStore.d.ts" />
/// <reference path="interfaces/Localization.d.ts" />
/// <reference path="global/LocalizationGlobalize.ts" />
/// <reference path="global/DataStoreClient.ts" />
/// <reference path="components/App.tsx" />

import App = Sdl.DitaDelivery.Components.App;

module Sdl.DitaDelivery {
    /**
     * Set instances for data store / localization / routing
     */
    DataStore = new DataStoreClient();
    Localization = new LocalizationGlobalize();
}

/**
 * Render the application to a string.
 *
 * @param {string} path Current path in the application. Used for deep linking.
 * @returns {string}
 */
// tslint:disable-next-line:no-unused-variable
function renderToString(path: string): string {
    return ReactDOMServer.renderToString(<App />);
};
