
declare module Sdl.DitaDelivery.Server.Models {
    interface ILink {
        Id: string;
    }
    interface INavigationLinks {
        Items: Sdl.DitaDelivery.Server.Models.ILink[];
    }
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
        Id: string;
        IsAbstract: boolean;
        IsLeaf: boolean;
        Title: string;
        Url: string;
    }
}
declare module Sdl.DitaDelivery.Server.Models {
    interface IKeyValuePair<TKey, TValue> {
        Key: TKey;
        Value: TValue;
    }
}
