/// <reference path="../typings/index.d.ts" />

import { AppWrapper } from "./modules/AppWrapper";
import { DataStoreServer } from "./global/server/DataStoreServer";
import { localization } from "./global/server/LocalizationServer";
import { routing } from "./global/server/RoutingServer";

// Nashorn script engine needs a global scope
declare var _renderToString: (path: string) => void;

/**
 * Render the application to a string.
 *
 * @param {string} path Current path in the application. Used for deep linking.
 * @returns {string}
 */
export function renderToString(path: string): string {
    /**
     * Set instances for data store / localization / routing
     */
    const dataStore = new DataStoreServer();

    return ReactDOMServer.renderToString(<AppWrapper
        dataStore={dataStore}
        routing={routing}
        localization={localization} />);
};

_renderToString = renderToString;
