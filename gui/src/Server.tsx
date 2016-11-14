/// <reference path="../typings/index.d.ts" />

import "ts-helpers";
import { App } from "./components/container/App";
import { IServices } from "./interfaces/Services";
import { PageService } from "./services/server/PageService";
import { PublicationService } from "./services/server/PublicationService";
import { TaxonomyService } from "./services/server/TaxonomyService";
import { localization } from "./services/server/LocalizationService";
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
     * Set instances for services
     */
    const services: IServices = {
        pageService: new PageService(),
        publicationService: new PublicationService(),
        localizationService: localization,
        taxonomyService: new TaxonomyService()
    };

    return ReactDOMServer.renderToString(
        <App services={services} routing={routing} />);
};

_renderToString = renderToString;
