/// <reference path="../typings/index.d.ts" />

import "ts-helpers";
import { App } from "./components/container/App";
import { IServices } from "./interfaces/Services";
import { PageService } from "./services/client/PageService";
import { PublicationService } from "./services/client/PublicationService";
import { TaxonomyService } from "./services/client/TaxonomyService";
import { localization } from "./services/client/LocalizationService";
import { browserHistory } from "react-router";

const mainElement = document.getElementById("main-view-target");

/**
 * Set instances for services
 */
const services: IServices = {
    pageService: new PageService(),
    publicationService: new PublicationService(),
    localizationService: localization,
    taxonomyService: new TaxonomyService()
};

if (!mainElement) {
    console.error(`Unable to locate element to render application.`);
} else {
    ReactDOM.render(
        <App services={services} history={browserHistory} />,
        mainElement);
}
