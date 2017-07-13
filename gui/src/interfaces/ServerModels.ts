
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
    ProductFamily?: string | null;
    ProductReleaseVersion?: string | null;
    Title: string;
    Version: string;
    VersionRef: string;
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
export interface ISearchResult {
    Id: string;
    Content: string;
    Locale: string;
    Fields: IKeyValuePair<string, string>;
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
