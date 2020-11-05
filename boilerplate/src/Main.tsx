/**
 *
 *  Copyright (c) 2014 All Rights Reserved by the SDL Group.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

import * as React from "react";
import * as ReactDOM from "react-dom";
import { Components, Services, IState, configureStore } from "@sdl/delivery-ish-dd-webapp-gui";
import { Provider } from "react-redux";
import { Store } from "redux";

const { App } = Components.AppComp;
const { PageService, PublicationService, TaxonomyService, SearchService } = Services.Client;
const { localization} = Services.Common;

import { DEFAULT_LANGUAGE } from "services/common/LocalizationService";

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

localization.setStore(store);

const store: Store<IState> = configureStore({ language: DEFAULT_LANGUAGE });

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
