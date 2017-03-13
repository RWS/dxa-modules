/**
 * Load global stylesheets
 */
import "sdl-controls-react-wrappers/dist/stylesheets/main";

/**
 * Components
 */
import * as AppComp from "components/container/App";
import * as HomeComp from "components/container/Home";
import * as PublicationContentComp from "components/PublicationContent/PublicationContentPresentaion";
import * as PublicationsListComp from "components/container/PublicationsList";
import * as BreadcrumbsComp from "components/presentation/Breadcrumbs";
import * as ContentNavigationComp from "components/presentation/ContentNavigation";
import * as NavigationMenuComp from "components/presentation/NavigationMenu";
import * as PageComp from "components/presentation/Page";
import * as SearchBarComp from "components/presentation/SearchBar";
import * as TocComp from "components/presentation/Toc";
import * as TopBarComp from "components/presentation/TopBar";

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
