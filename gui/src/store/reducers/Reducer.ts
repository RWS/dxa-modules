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

import { MD5 } from "object-hash";
import * as Language from "./Language";
import * as Pages from "./Pages";
import * as Location from "./Location";
import * as Publications from "./Publications";
import * as ReleaseVersions from "./ReleaseVersions";
import splitterPosition from "./SplitterPosition";
import conditions, * as Conditions from "./conditions";
import productFamilies from "./ProductFamilies";
import { IState, ICurrentLocationState } from "store/interfaces/State";
import { IPublication } from "interfaces/Publication";
import { IPage } from "interfaces/Page";
import { combineReducers } from "store/reducers/CombineReducers";
import { IProductReleaseVersion } from "interfaces/ProductReleaseVersion";
import { IPublicationsListPropsParams } from "@sdl/dd/PublicationsList/PublicationsListPresentation";
import { IConditionMap } from "store/interfaces/Conditions";
import * as Comments from "./Comments";
import { IComment } from "interfaces/ServerModels";

export const mainReducer = combineReducers({
    conditions,
    comments: Comments.comments,
    language: Language.language,
    pages: Pages.pages,
    currentLocation: Location.currentLocation,
    publications: Publications.publications,
    releaseVersions: ReleaseVersions.releaseVersions,
    productFamilies,
    splitterPosition
});

// Publications selectors
export const getPubList = (state: IState, filter?: {}): IPublication[] => Publications.getPubList(state.publications, filter);
export const getPubById = (state: IState, id: string): IPublication => Publications.getPubById(state.publications, id);
export const getPubsByLang = (state: IState, language: string): IPublication[] => Publications.getPubsByLang(state.publications, language);
export const getPubListRepresentatives = (state: IState, filter: {}): (IPublication | undefined)[] => Publications.getPubListRepresentatives(state, filter);
export const normalizeProductFamily = (params: IPublicationsListPropsParams): string | null => Publications.normalizeProductFamily(params);
export const normalizeProductReleaseVersion = (params: IPublicationsListPropsParams | string): string | null | undefined => Publications.normalizeProductReleaseVersion(params);

export const getPubForLang = (state: IState, publication: IPublication, language: string): IPublication => Publications.getPubForLang(state.publications, publication, language);
export const isPubsLoading = (state: IState): boolean => Publications.isLoadnig(state.publications);
export const isPublicationFound = (state: IState, pubId: string): boolean => Publications.isPublicationFound(state.publications, pubId);

export const getPubListErrorMessage = (state: IState) => Publications.getLastError(state.publications);

// Conditions selector
export const getAllConditionsByPubId = (state: IState, pubId: string): IConditionMap => Conditions.getAllByPubId(state.conditions, pubId);
export const isConditionsDialogVisible = (state: IState) => Conditions.isDialogVisible(state.conditions);
export const getLastConditions = (state: IState, pubId: string) => Conditions.getLastConditions(state.conditions, pubId);
export const getEditingConditions = (state: IState) => Conditions.getEditingConditions(state.conditions);

// Pages selectors
// helper for page selector (need to moved to pages)
export const getPageKey = (state: IState, pubId: string, pageId: string, conditions?: IConditionMap) => {
    return pageId ? `${pubId}/${pageId}/${MD5(conditions || getLastConditions(state, pubId))}` : "";
};
export const getPageById = (state: IState, pubId: string, pageId: string, conditions?: IConditionMap): IPage => {
    return Pages.getPageById(state.pages, getPageKey(state, pubId, pageId, conditions));
};
export const getErrorMessage = (state: IState, pubId: string, pageId: string, conditions?: IConditionMap): string => {
    return Pages.getErrorMessage(state.pages, getPageKey(state, pubId, pageId, conditions));
};
export const isPageLoading = (state: IState, pubId: string, pageId: string, conditions?: IConditionMap): boolean => {
    return Pages.isPageLoading(state.pages, getPageKey(state, pubId, pageId, conditions));
};

// State selectors
export const getCurrentLocation = (state: IState): ICurrentLocationState => state.currentLocation;
export const getReleaseVersionsForPub = (state: IState, pubId: string): IProductReleaseVersion[] =>
    ReleaseVersions.getReleaseVersionsForPub(state.releaseVersions, pubId);

// ReleaseVersions selector
export const translateProductReleaseVersion = (productReleaseVersion: string): string => ReleaseVersions.translateProductReleaseVersion(productReleaseVersion);
export const translateProductReleaseVersions = (versions: IProductReleaseVersion[]): IProductReleaseVersion[] => ReleaseVersions.translateProductReleaseVersions(versions);

// Comments selectors
export const getCommentsKey = (pubId: string, pageId: string, parentId?: number) => {
    return `${pubId}|${pageId}|${(parentId || 0).toString()}`;
};

export const getComments = (state: IState, pubId: string, pageId: string): IComment[] =>
    Comments.getById(state.comments, getCommentsKey(pubId, pageId));
export const commentsAreLoading = (state: IState, pubId: string, pageId: string, parentId?: number): boolean =>
    Comments.areLoading(state.comments, getCommentsKey(pubId, pageId, parentId));
export const getCommentErrorMessage = (state: IState, pubId: string, pageId: string, parentId?: number): string =>
    Comments.getErrorMessage(state.comments, getCommentsKey(pubId, pageId, parentId));
export const getPostCommentErrorMessage = (state: IState, pubId: string, pageId: string, parentId?: number): string =>
    Comments.getPostErrorMessage(state.comments, getCommentsKey(pubId, pageId, parentId));
export const commentIsSaving = (state: IState, pubId: string, pageId: string, parentId?: number): boolean =>
    Comments.isSaving(state.comments, getCommentsKey(pubId, pageId, parentId));
