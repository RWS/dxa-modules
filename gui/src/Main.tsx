/// <reference path="../typings/index.d.ts" />

import "ts-helpers";
import { App } from "./components/container/App";
import { IServices } from "./interfaces/Services";
import { PageService } from "./services/client/PageService";
import { PublicationService } from "./services/client/PublicationService";
import { TaxonomyService } from "./services/client/TaxonomyService";
import { localization } from "./services/client/LocalizationService";
import { routing } from "./global/client/RoutingClient";

/**
 * Set instances for services
 */
const services: IServices = {
    pageService: new PageService(),
    publicationService: new PublicationService(),
    taxonomyService: new TaxonomyService()
};

const mainElement = document.getElementById("main-view-target");

if (!mainElement) {
    console.error(`Unable to locate element to render application.`);
} else {
    const render = (): void => {
        ReactDOM.render(<App
            services={services}
            routing={routing}
            localization={localization} />, mainElement);
    };

    routing.onLocationChanged(render);
    render();
}
