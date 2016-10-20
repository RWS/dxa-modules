/// <reference path="../typings/index.d.ts" />

import "ts-helpers";
import { App } from "./components/container/App";
import { DataStoreClient } from "./global/client/DataStoreClient";
import { localization } from "./global/client/LocalizationGlobalize";
import { routing } from "./global/client/RoutingClient";

/**
 * Set instances for data store / localization / routing
 */
const dataStore = new DataStoreClient();

const mainElement = document.getElementById("main-view-target");

if (!mainElement) {
    console.error(`Unable to locate element to render application.`);
} else {
    const render = (): void => {
        ReactDOM.render(<App
            dataStore={dataStore}
            routing={routing}
            localization={localization} />, mainElement);
    };

    routing.onLocationChanged(render);
    render();
}
