import * as Language from "./Language";
import * as Pages from "./Pages";
import * as Publication from "./Publication";
import * as Publications from "./Publications";
import * as ReleaseVersions from "./ReleaseVersions";
import conditions, * as Conditions from "./conditions";
import { IState, IPublicationCurrentState } from "store/interfaces/State";
import { IPublication } from "interfaces/Publication";
import { IPage } from "interfaces/Page";
import { combineReducers } from "./CombineReducers";
import { IProductReleaseVersion } from "interfaces/ProductReleaseVersion";
import { IPublicationsListPropsParams } from "@sdl/dd/PublicationsList/PublicationsListPresentation";
import { IConditionMap } from "./conditions/IConditions";

export const mainReducer = combineReducers({
    conditions,
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
export const getPubListRepresentatives = (state: IState, filter: {}): IPublication[] => Publications.getPubListRepresentatives(state, filter);
export const normalizeProductFamily = (params: IPublicationsListPropsParams): string | null => Publications.normalizeProductFamily(params);
export const normalizeProductReleaseVersion = (params: IPublicationsListPropsParams | string): string | null | undefined => Publications.normalizeProductReleaseVersion(params);

export const getPubForLang = (state: IState, publication: IPublication, language: string): IPublication => Publications.getPubForLang(state.publications, publication, language);
export const isPubsLoading = (state: IState): boolean => Publications.isLoadnig(state.publications);
export const isPublicationFound = (state: IState, pubId: string): boolean => Publications.isPublicationFound(state.publications, pubId);

export const getPubListErrorMessage = (state: IState) => Publications.getLastError(state.publications);

//Conditions selector
export const getConditionsByPubId = (state: IState, pubId: string): IConditionMap => Conditions.getByPubId(state.conditions, pubId);
export const isConditionsDialogVisible = (state: IState) => Conditions.isDialogVisible(state.conditions);
export const getLastConditions = (state: IState, pubId: string) => Conditions.getLastConditions(state.conditions, pubId);

// Pages selectors
export const getPageById = (state: IState, pageId: string): IPage => Pages.getPageById(state.pages, pageId);
export const getErrorMessage = (state: IState, pageId: string): string => Pages.getErrorMessage(state.pages, pageId);
export const isPageLoading = (state: IState, pageId: string): boolean => Pages.isPageLoading(state.pages, pageId);

// State selectors
export const getCurrentPub = (state: IState): IPublicationCurrentState => state.publication;
export const getReleaseVersionsForPub = (state: IState, publicationId: string): IProductReleaseVersion[] =>
    ReleaseVersions.getReleaseVersionsForPub(state.releaseVersions, publicationId);

// ReleaseVersions selector
export const translateProductReleaseVersion = (productReleaseVersion: string): string => ReleaseVersions.translateProductReleaseVersion(productReleaseVersion);
export const translateProductReleaseVersions = (versions: IProductReleaseVersion[]): IProductReleaseVersion[] => ReleaseVersions.translateProductReleaseVersions(versions);
