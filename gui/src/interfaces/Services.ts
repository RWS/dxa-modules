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

import { IPageService } from "services/interfaces/PageService";
import { ILocalizationService } from "services/interfaces/LocalizationService";
import { IPublicationService } from "services/interfaces/PublicationService";
import { ITaxonomyService } from "services/interfaces/TaxonomyService";
import { ISearchService } from "services/interfaces/SearchService";

/**
 * List of all services
 *
 * @export
 * @interface IServices
 */
export interface IServices {

    /**
     * Page service
     *
     * @type {IPageService}
     * @memberOf IServices
     */
    pageService: IPageService;
    /**
     * Publication service
     *
     * @type {IPublicationService}
     * @memberOf IServices
     */
    publicationService: IPublicationService;
    /**
     * Localization service
     *
     * @type {ILocalizationService}
     * @memberOf IServices
     */
    localizationService: ILocalizationService;
    /**
     * Taxonomy service
     *
     * @type {ITaxonomyService}
     * @memberOf IServices
     */
    taxonomyService: ITaxonomyService;

    /**
     * Taxonomy service
     *
     * @type {ISearchService}
     * @memberOf IServices
     */
    searchService: ISearchService;
}
