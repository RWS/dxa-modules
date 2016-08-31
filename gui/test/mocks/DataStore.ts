
module Sdl.DitaDelivery.Tests.Mocks {
    import ISitemapItem = Server.Models.ISitemapItem;
    import IPageInfo = Sdl.DitaDelivery.Models.IPageInfo;

    export class DataStore implements IDataStore {

        public getSitemapRoot(
            callback: (error: string, children: ISitemapItem[]) => void,
            mockData?: {
                error: string,
                children: ISitemapItem[]
            }): void {
            callback(mockData.error, mockData.children);
        }

        public getSitemapItems(
            parentId: string,
            callback: (error: string, children?: ISitemapItem[]) => void,
            mockData?: {
                error: string,
                children?: ISitemapItem[]
            }): void {
            callback(mockData.error, mockData.children);
        }

        public getPageInfo(
            pageId: string,
            callback: (error: string, info?: IPageInfo) => void,
            mockData?: {
                error: string,
                info?: IPageInfo
            }): void {
            callback(mockData.error, mockData.info);
        }

    }

}
