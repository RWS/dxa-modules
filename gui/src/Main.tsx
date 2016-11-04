/// <reference path="../typings/index.d.ts" />

import { routing } from "./global/client/RoutingClient";
import { localization } from "./global/client/LocalizationGlobalize";
import { DataStoreClient } from "./global/client/DataStoreClient";
import { AppWrapper } from "./modules/AppWrapper";

/**
 * Set instances for services
 */
const services: IServices = {
    pageService: new PageService(),
    publicationService: new PublicationService(),
    localizationService: localization,
    taxonomyService: new TaxonomyService()
};

const mainElement = document.getElementById("main-view-target");

if (!mainElement) {
    console.error(`Unable to locate element to render application.`);
} else {

    /**
     * Set instances for data store / localization / routing
     */
    const dataStore = new DataStoreClient();

    ReactDOM.render(
        <AppWrapper dataStore={dataStore} localization={localization} routing={routing} />,
        mainElement);
}
