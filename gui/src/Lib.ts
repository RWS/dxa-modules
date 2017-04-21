/**
 * Load global stylesheets
 */
import "@sdl/controls-react-wrappers/dist/stylesheets/main";

/**
 * Components
 */
import * as AppComp from "@sdl/dd/containers/app";
import * as HomeComp from "@sdl/dd/components/home";
import * as PublicationContentComp from "@sdl/dd/components/publication-content";
import * as PublicationsListComp from "@sdl/dd/components/publications-list";
import * as BreadcrumbsComp from "@sdl/dd/presentations/breadcrumbs";
import * as ContentNavigationComp from "@sdl/dd/presentations/content-navigation";
import * as NavigationMenuComp from "@sdl/dd/presentations/navigation-menu";
import * as PageComp from "@sdl/dd/components/page";
import * as PageLinkComp from "@sdl/dd/components/page-link";
import * as SearchBarComp from "@sdl/dd/presentations/search-bar";
import * as TocComp from "@sdl/dd/presentations/toc";
import * as TopBarComp from "@sdl/dd/presentations/top-bar";
import * as TileComp from "@sdl/dd/presentations/tile";
import * as TilesListComp from "@sdl/dd/presentations/top-bar";
import * as ErrorComp from "@sdl/dd/presentations/error";
import * as ErrorTocComp from "@sdl/dd/presentations/error-toc";
import * as VersionSelectorComp from "@sdl/dd/presentations/version-selector";
import * as ErrorContentComp from "@sdl/dd/containers/error-content";
import * as ProductFamiliesListComp from "@sdl/dd/containers/product-families-list";
import * as ContentLanguageWarningComp from "@sdl/dd/components/content-language-warning";
import * as DropdownComp from "@sdl/dd/components/dropdown";

export const Components = {
    AppComp, HomeComp, PublicationContentComp, PublicationsListComp,
    BreadcrumbsComp, ContentNavigationComp, NavigationMenuComp,
    PageComp, SearchBarComp, TocComp, TopBarComp,
    TileComp, TilesListComp, ErrorComp, ErrorTocComp,
    VersionSelectorComp, ErrorContentComp, ProductFamiliesListComp,
    ContentLanguageWarningComp, DropdownComp, PageLinkComp
};

export * from "interfaces/Error";
export * from "interfaces/Page";
export * from "interfaces/ProductFamily";
export * from "interfaces/ProductReleaseVersion";
export * from "interfaces/Publication";
export * from "interfaces/PublicationContentPropsParams";
export * from "interfaces/Taxonomy";
export * from "interfaces/TcmId";
export * from "interfaces/Window";
export * from "interfaces/Services";

/**
 * Models
 *
 */

import * as NavigationLinksModel from "models/NavigationLinks";
import * as PageModel from "models/Page";
import * as PublicationsModel from "models/Publications";
import * as TocModel from "models/Toc";

export const Models = {
    NavigationLinksModel, PageModel, PublicationsModel, TocModel
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
