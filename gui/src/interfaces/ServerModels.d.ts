
export interface IPage {
    Id: string;
    Meta: IKeyValuePair<string, string | string[] | number | number[]>[];
    Regions: IRegion[];
}
export interface IPublication {
    Id: string;
    Meta: IKeyValuePair<string, string | string[] | number | number[]>[];
    Title: string;
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
