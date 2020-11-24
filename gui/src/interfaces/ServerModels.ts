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

    export interface IComment {
        children: IComment[];
        content: string;
        creationDate: ICommentDate;
        id: number;
        idLong: number;
        itemId: number;
        itemPublicationId: number;
        itemType: number;
        lastModifiedDate: ICommentDate;
        moderatedDate: ICommentDate;
        moderator: string;
        namespaceId: number;
        parent: IComment;
        parentId: number;
        score: number;
        status: number;
        user: IUser;
    }
    export interface ICommentDate {
        dayOfMonth: number;
        dayOfWeek: string;
        dayOfYear: number;
        hour: number;
        minute: number;
        month: string;
        monthValue: number;
        nano: number;
        second: number;
        year: number;
    }
    export interface ICondition {
        datatype: "Date" | "Number" | "Text" | "Version";
        range: boolean;
        values: string[];
    }
    export interface IPage {
        Id: string;
        Meta: { [key: string ]: string | string[] | number | number[] | undefined | null };
        Regions: IRegion[];
    }
    export interface IPublication {
        CreatedOn: string;
        Id: string;
        Language: string;
        LogicalId: string;
        LogicalRef: string;
        ProductFamily?: string[] | null;
        ProductReleaseVersion?: string[] | null;
        Title: string;
        Version: string;
        VersionRef: string;
    }
    export interface ISearchRequestQuery {
        Count: number;
        Language: string;
        PublicationId: number;
        SearchQuery: string;
        StartIndex: number;
    }
    export interface ISearchResult {
        Content: string;
        CreatedDate: string;
        Highlighted?: string;
        Id: string;
        ItemType: string | undefined | null;
        Locale: string;
        Meta: { [key: string ]: string | string[] | number | number[] | undefined | null };
        ModifiedDate?: string;
        ProductFamilyName?: string;
        ProductReleaseName?: string;
        PublicationId: number;
        PublicationTitle: string;
    }
    export interface ISearchResults {
        Count: number;
        Hits: number;
        QueryResults: ISearchResult[];
        StartIndex: number;
    }
    export interface ISitemapItem {
        HasChildNodes: boolean;
        Id?: string;
        IsAbstract: boolean;
        Items: ISitemapItem[];
        Title: string;
        Url?: string;
    }
    export interface IUser {
        emailAddress: string;
        externalId: string;
        id: number;
        name: string;
    }
    export interface IKeyValuePair<TKey, TValue> {
        Key: TKey;
        Value: TValue;
    }
    export interface IEntity {
        Id: string;
        topicBody: IRichText;
        topicTitle: string;
    }
    export interface IFragment {
        Html: string;
    }
    export interface IRegion {
        Entities: IEntity[];
    }
    export interface IRichText {
        Fragments: IFragment[];
    }
