export interface IPage {
    Id: string;
    Meta: { [key: string]: string | string[] | number | number[] | undefined | null };
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
