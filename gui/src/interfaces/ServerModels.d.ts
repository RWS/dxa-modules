
export interface IPage {
    Html: string;
    Id: string;
    Meta: IKeyValuePair<string, string | string[] | number | number[]>[];
    Title: string;
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
