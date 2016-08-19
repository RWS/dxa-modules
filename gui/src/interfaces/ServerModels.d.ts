
declare module Server.Models {
    interface IPage {
        Html: string;
        Id: string;
        Meta: Server.Models.IKeyValuePair<string, string>[];
        Title: string;
    }
    interface IPublication {
        Id: string;
        Meta: Server.Models.IKeyValuePair<string, string>[];
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
declare module Server.Models {
    interface IKeyValuePair<TKey, TValue> {
        Key: TKey;
        Value: TValue;
    }
}
