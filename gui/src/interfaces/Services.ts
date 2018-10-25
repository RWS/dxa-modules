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
