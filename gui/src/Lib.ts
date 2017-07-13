/**
 * Load global stylesheets
 */
import "@sdl/controls-react-wrappers/dist/stylesheets/main";

/**
 * Components
 */
import * as AppComp from "@sdl/dd/container/App/App";
import * as BreadcrumbsComp from "@sdl/dd/presentation/Breadcrumbs";
import * as CommentComp from "@sdl/dd/Comment/Comment";
import * as CommentsListComp from "@sdl/dd/CommentsList/CommentsList";
import * as CommentsSectionComp from "@sdl/dd/CommentsSection/CommentsSection";
import * as ContentLanguageWarningComp from "@sdl/dd/ContentLanguageWarning/ContentLanguageWarningPresentation";
import * as ContentNavigationComp from "@sdl/dd/presentation/ContentNavigation";
import * as DatePickerComp from "@sdl/dd/DatePicker/DatePickerPresentation";
import * as DropdownComp from "@sdl/dd/Dropdown/Dropdown";
import * as ErrorComp from "@sdl/dd/presentation/Error";
import * as ErrorContentComp from "@sdl/dd/container/ErrorContent/ErrorContentPresentation";
import * as ErrorTocComp from "@sdl/dd/presentation/ErrorToc";
import * as HomeComp from "@sdl/dd/Home/Home";
import * as NavigationMenuComp from "@sdl/dd/presentation/NavigationMenu";
import * as PageComp from "@sdl/dd/Page/PagePresentation";
import * as PageLinkComp from "@sdl/dd/PageLink/PageLink";
import * as PostCommentComp from "@sdl/dd/PostComment/PostCommentPresentation";
import * as ProductFamiliesListComp from "@sdl/dd/container/ProductFamiliesList/ProductFamiliesList";
import * as PublicationContentComp from "@sdl/dd/PublicationContent/PublicationContentPresentation";
import * as PublicationsListComp from "@sdl/dd/PublicationsList/PublicationsListPresentation";
import * as SearchBarComp from "@sdl/dd/presentation/SearchBar";
import * as TileComp from "@sdl/dd/presentation/Tile";
import * as TilesListComp from "@sdl/dd/presentation/TopBar";
import * as TocComp from "@sdl/dd/presentation/Toc";
import * as TopBarComp from "@sdl/dd/presentation/TopBar";
import * as VersionSelectorComp from "@sdl/dd/presentation/VersionSelector";
import * as SearchResultsComp from "@sdl/dd/SearchResults/SearchResults";

export const Components = {
    AppComp, BreadcrumbsComp, CommentComp, CommentsListComp, CommentsSectionComp,
    ContentLanguageWarningComp, ContentNavigationComp, DatePickerComp, DropdownComp,
    ErrorComp, ErrorContentComp, ErrorTocComp, HomeComp, NavigationMenuComp,
    PageComp, PageLinkComp, PostCommentComp, ProductFamiliesListComp,
    PublicationContentComp, PublicationsListComp, SearchBarComp, TileComp,
    TilesListComp, TocComp, TopBarComp, VersionSelectorComp, SearchResultsComp
};

export * from "interfaces/Comments";
export * from "interfaces/Error";
export * from "interfaces/Page";
export * from "interfaces/ProductFamily";
export * from "interfaces/ProductReleaseVersion";
export * from "interfaces/Publication";
export * from "interfaces/PublicationContentPropsParams";
export * from "interfaces/Services";
export * from "interfaces/Taxonomy";
export * from "interfaces/TcmId";
export * from "interfaces/Window";
export * from "interfaces/Search";

/**
 * Models
 */
import * as Comment from "models/Comment";
import * as Comments from "models/Comments";
import * as NavigationLinksModel from "models/NavigationLinks";
import * as PageModel from "models/Page";
import * as PublicationsModel from "models/Publications";
import * as TocModel from "models/Toc";
import * as SearchModel from "models/Search";

export const Models = {
    Comment, Comments, NavigationLinksModel, PageModel, PublicationsModel, TocModel, SearchModel
};

/**
 * Services
 */
import { PageService } from "services/client/PageService";
import { PublicationService } from "services/client/PublicationService";
import { TaxonomyService } from "services/client/TaxonomyService";
import { SearchService } from "services/client/SearchService";
import { LocalizationService, localization } from "services/common/LocalizationService";

export const Services = {
    Client: { PageService, PublicationService, TaxonomyService, SearchService },
    Common: { LocalizationService, localization }
};

export * from "services/interfaces/LocalizationService";
export * from "services/interfaces/PageService";
export * from "services/interfaces/PublicationService";
export * from "services/interfaces/TaxonomyService";

/**
 * Store
 */
export { configureStore } from "store/Store";
export * from "store/interfaces/Action";
export * from "store/interfaces/State";
export * from "store/interfaces/Comments";
export * from "store/interfaces/Conditions";

/**
 * Utils
 */
import { Api } from "utils/Api";
import { Html } from "utils/Html";
import { Path, path } from "utils/Path";
import { slugify } from "utils/Slug";
import { String } from "utils/String";
import { TcmId } from "utils/TcmId";
import { Url } from "utils/Url";
import Version from "utils/Version";

export const Utils = {
    Api, Html, Path, path, slugify, String, TcmId, Url, Version
};
