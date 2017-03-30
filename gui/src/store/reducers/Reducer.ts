import * as Language from "./Language";
import * as Pages from "./Pages";
import * as Publication from "./Publication";
import * as Publications from "./Publications";
import * as ReleaseVersions from "./ReleaseVersions";
import { find, chain } from "lodash";
import { IState, IPublicationCurrentState } from "store/interfaces/State";
import { IPublication } from "interfaces/Publication";
import { IPage } from "interfaces/Page";
import { combineReducers } from "./CombineReducers";
import { IProductReleaseVersion } from "interfaces/ProductReleaseVersion";
import { IPublicationsListPropsParams } from "components/PublicationsList/PublicationsListPresentation";
import { String } from "utils/String";
import { DEFAULT_UNKNOWN_PRODUCT_FAMILY_TITLE, DEFAULT_UNKNOWN_PRODUCT_RELEASE_VERSION } from "models/Publications";
import { DEFAULT_LANGUAGE, localization } from "services/common/LocalizationService";

export const mainReducer = combineReducers({
    language: Language.language,
    pages: Pages.pages,
    publication: Publication.publication,
    publications: Publications.publications,
    releaseVersions: ReleaseVersions.releaseVersions
});

// Publications selectors
export const getPubList = (state: IState, filter?: {}): IPublication[] => Publications.getPubList(state.publications, filter);
export const getPubById = (state: IState, id: string): IPublication => Publications.getPubById(state.publications, id);
export const getPubsByLang = (state: IState, language: string): IPublication[] => Publications.getPubsByLang(state.publications, language);
export const getPubListRepresentatives = (state: IState, filter: {}): IPublication[] => {
    // Groups publications by versionRef
    // find one we need by language or fallback language
    return chain(getPubList(state, filter))
        .groupBy("versionRef")
        .values()
        .flatMap((pubsByRef: IPublication[]) => find(pubsByRef, {language: state.language})
                                             || find(pubsByRef, {language: DEFAULT_LANGUAGE}))
        .value()
        .filter(publiction => publiction !== undefined);
};

//NOTE: don't like null here, should replace with dummy publication;
export const getPubByIdAndLang = (state: IState, pubId: string, language: string): IPublication | null => Publications.getPubByIdAndLang(state.publications, pubId, language);
export const isPubsLoading = (state: IState): boolean => Publications.isLoadnig(state.publications);

export const getPubListErrorMessage = (state: IState) => Publications.getLastError(state.publications);

// Pages selectors
export const getPageById = (state: IState, pageId: string): IPage => Pages.getPageById(state.pages, pageId);
export const getErrorMessage = (state: IState, pageId: string): string => Pages.getErrorMessage(state.pages, pageId);
export const isPageLoading = (state: IState, pageId: string): boolean => Pages.isPageLoading(state.pages, pageId);

// State selectors
export const getCurrentPub = (state: IState): IPublicationCurrentState => state.publication;
export const getReleaseVersionsForPub = (state: IState, publicationId: string): IProductReleaseVersion[] =>
    ReleaseVersions.getReleaseVersionsForPub(state.releaseVersions, publicationId);

// PublicationsList selectors
export const getProductFamily = (params: IPublicationsListPropsParams): string | null =>
    String.normalize(params.productFamily) === String.normalize(DEFAULT_UNKNOWN_PRODUCT_FAMILY_TITLE) ? null : params.productFamily;
export const getProductReleaseVersion = (params: IPublicationsListPropsParams | string): string | null | undefined => {
    const value = typeof params === "string" ? params : params.productReleaseVersion || "";
    return String.normalize(value) === String.normalize(DEFAULT_UNKNOWN_PRODUCT_RELEASE_VERSION) ? null : value;
};

// ReleaseVersions selector
export const translateProductReleaseVersion = (productReleaseVersion: string): string =>
    String.normalize(productReleaseVersion) === String.normalize(DEFAULT_UNKNOWN_PRODUCT_RELEASE_VERSION)
        ? localization.formatMessage("productreleaseversions.unknown.title")
        : productReleaseVersion;

export const translateProductReleaseVersions = (versions: IProductReleaseVersion[]): IProductReleaseVersion[] => {
    return versions && versions.map(version => {
        let { value, title } = version;

        if (String.normalize(version.value) === String.normalize(DEFAULT_UNKNOWN_PRODUCT_RELEASE_VERSION)) {
            value = String.normalize(localization.formatMessage("productreleaseversions.unknown.title"));
            title = localization.formatMessage("productreleaseversions.unknown.title");
        };

        return { ...version, value, title };
    });
};
