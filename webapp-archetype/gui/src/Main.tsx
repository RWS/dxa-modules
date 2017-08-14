import * as React from "react";
import * as ReactDOM from "react-dom";
import { Components, Services, IState, configureStore } from "@sdl/delivery-ish-dd-webapp-gui";
import { Provider } from "react-redux";
import { Store } from "redux";

const { App } = Components.AppComp;
const { PageService, PublicationService, TaxonomyService, SearchService } = Services.Client;
const { localization} = Services.Common;

const mainElement = document.getElementById("main-view-target");

/**
 * Set instances for services
 */
const services = {
    pageService: new PageService(),
    publicationService: new PublicationService(),
    localizationService: localization,
    taxonomyService: new TaxonomyService(),
    searchService: new SearchService()
};

const store: Store<IState> = configureStore({});

localization.setStore(store);

const render = (AppComp: typeof App): void => {
    if (!mainElement) {
        console.error(`Unable to locate element to render application.`);
    } else {
        ReactDOM.render(
            <Provider store={store}>
                <AppComp services={services}/>
            </Provider>, mainElement);
    }
};
render(App);
