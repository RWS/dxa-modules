/**
 * Load global stylesheets
 */
import "@sdl/controls-react-wrappers/dist/stylesheets/main";

/**
 * Components
 */
import * as AppComp from "@sdl/dd/container/App/App";
import * as HomeComp from "@sdl/dd/Home/Home";
import * as PublicationContentComp from "@sdl/dd/PublicationContent/PublicationContentPresentation";
import * as PublicationsListComp from "@sdl/dd/PublicationsList/PublicationsListPresentation";
import * as BreadcrumbsComp from "@sdl/dd/presentation/Breadcrumbs";
import * as ContentNavigationComp from "@sdl/dd/presentation/ContentNavigation";
import * as NavigationMenuComp from "@sdl/dd/presentation/NavigationMenu";
import * as PageComp from "@sdl/dd/Page/PagePresentation";
import * as PageLinkComp from "@sdl/dd/PageLink/PageLink";
import * as SearchBarComp from "@sdl/dd/presentation/SearchBar";
import * as TocComp from "@sdl/dd/presentation/Toc";
import * as TopBarComp from "@sdl/dd/presentation/TopBar";
import * as TileComp from "@sdl/dd/presentation/Tile";
import * as TilesListComp from "@sdl/dd/presentation/TopBar";
import * as ErrorComp from "@sdl/dd/presentation/Error";
import * as ErrorTocComp from "@sdl/dd/presentation/ErrorToc";
import * as VersionSelectorComp from "@sdl/dd/presentation/VersionSelector";
import * as ErrorContentComp from "@sdl/dd/container/ErrorContent/ErrorContentPresentation";
import * as ProductFamiliesListComp from "@sdl/dd/container/ProductFamiliesList/ProductFamiliesList";
import * as ContentLanguageWarningComp from "@sdl/dd/ContentLanguageWarning/ContentLanguageWarningPresentation";
import * as DropdownComp from "@sdl/dd/Dropdown/Dropdown";

export const Components = {
    AppComp, HomeComp, PublicationContentComp, PublicationsListComp,
    BreadcrumbsComp, ContentNavigationComp, NavigationMenuComp,
    PageComp, SearchBarComp, TocComp, TopBarComp,
    TileComp, TilesListComp, ErrorComp, ErrorTocComp,
    VersionSelectorComp, ErrorContentComp, ProductFamiliesListComp,
    ContentLanguageWarningComp, DropdownComp, PageLinkComp
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
