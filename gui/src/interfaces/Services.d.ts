import { ITaxonomyService } from "../services/interfaces/TaxonomyService";
import { IPageService } from "../services/interfaces/PageService";
import { IPublicationService } from "../services/interfaces/PublicationService";

/**
 * List of all services
 *
 * @export
 * @interface IServices
 */
export interface IServices {
    /**
     * Taxonomy service
     *
     * @type {ITaxonomyService}
     * @memberOf IServices
     */
    taxonomyService: ITaxonomyService;
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
}
