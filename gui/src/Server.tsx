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

import "ts-helpers";
import * as React from "react";
import * as ReactDOMServer from "react-dom/server";
import { App } from "@sdl/dd/container/App/App";
import { IServices } from "interfaces/Services";
import { PageService } from "services/server/PageService";
import { PublicationService } from "services/server/PublicationService";
import { TaxonomyService } from "services/server/TaxonomyService";
import { SearchService } from "services/server/SearchService";
import { localization } from "services/common/LocalizationService";

import { DEFAULT_LANGUAGE } from "services/common/LocalizationService";

import { Provider } from "react-redux";
import { IState } from "store/interfaces/State";
import { configureStore } from "store/Store";
import { Store } from "redux";

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
        taxonomyService: new TaxonomyService(),
        searchService: new SearchService()
    };

    const store: Store<IState> = configureStore({ language: DEFAULT_LANGUAGE });

    localization.setStore(store);

    return ReactDOMServer.renderToString(
        <Provider store={store}>
            <App services={services} />
        </Provider>
    );
}
