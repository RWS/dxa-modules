
declare module Sdl.DitaDelivery.Server.Models {
    interface IPage {
        Html: string;
        Id: string;
        Meta: Sdl.DitaDelivery.Server.Models.IKeyValuePair<string, string | string[] | number | number[]>[];
        Title: string;
    }
    interface IPublication {
        Id: string;
        Meta: Sdl.DitaDelivery.Server.Models.IKeyValuePair<string, string | string[] | number | number[]>[];
        Title: string;
    }
    interface ISitemapItem {
        HasChildNodes: boolean;
        Id?: string;
        IsAbstract: boolean;
        Items: Sdl.DitaDelivery.Server.Models.ISitemapItem[];
        Title: string;
        Url?: string;
    }
}
declare module Sdl.DitaDelivery.Server.Models {
    interface IKeyValuePair<TKey, TValue> {
        Key: TKey;
        Value: TValue;
    }
}
