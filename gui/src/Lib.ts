/**
 * Load global stylesheets
 */
import "@sdl/controls-react-wrappers/dist/stylesheets/main";

/**
 * Components
 */
import * as AppComp from "@sdl/dd/containers/app";
import * as HomeComp from "components/Home/Home";
import * as PublicationContentComp from "@sdl/dd/components/publication-content";
import * as PublicationsListComp from "@sdl/dd/components/publications-list";
import * as BreadcrumbsComp from "components/presentation/Breadcrumbs";
import * as ContentNavigationComp from "@sdl/dd/presentations/content-navigation";
import * as NavigationMenuComp from "@sdl/dd/presentations/navigation-menu";
import * as PageComp from "components/Page/Page";
import * as SearchBarComp from "@sdl/dd/presentations/search-bar";
import * as TocComp from "@sdl/dd/presentations/toc";
import * as TopBarComp from "@sdl/dd/presentations/top-bar";

export const Components = {
    AppComp, HomeComp, PublicationContentComp, PublicationsListComp,
    BreadcrumbsComp, ContentNavigationComp, NavigationMenuComp,
    PageComp, SearchBarComp, TocComp, TopBarComp
};

/**
 * Services
 */
import { PageService } from "services/client/PageService";
import { PublicationService } from "services/client/PublicationService";
import { TaxonomyService } from "services/client/TaxonomyService";
import { LocalizationService, localization } from "services/common/LocalizationService";

export const Services = {
    Client: { PageService, PublicationService, TaxonomyService },
    Common: { LocalizationService, localization }
};

export * from "services/interfaces/LocalizationService";
export * from "services/interfaces/PageService";
export * from "services/interfaces/PublicationService";
export * from "services/interfaces/TaxonomyService";
