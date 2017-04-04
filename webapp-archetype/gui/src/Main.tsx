import * as React from "react";
import * as ReactDOM from "react-dom";
import { Components, Services } from "sdl-dita-delivery-web-app-gui";
import { browserHistory } from "react-router";

const { App } = Components.AppComp;
const { PageService, PublicationService, TaxonomyService } = Services.Client;
const { localization} = Services.Common;

const mainElement = document.getElementById("main-view-target");

/**
 * Set instances for services
 */
const services = {
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
